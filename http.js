/**
 * http请求
 * */
// const baseUrl = "https://www.yaojia.com/GlofApi/";
const baseUrl = "https://www.yaojia.com/educate-ucenter-web/";
var requestHandler = {
  baseType:0,
  url:"",
  params: {},
  msg:"",
  success: function (res) {}
}
const request = (method, requestHandler, isShowLoading) => {
  var param = requestHandler.params;
  var contentType ='application/json'
  if (requestHandler.baseType == 0){//用户中心接口
    var baseUrl = 'https://www.yaojia.com/educate-ucenter-web/';
  } else if (requestHandler.baseType == 1){//设备模块接口
    var baseUrl = 'https://www.yaojia.com/educate-device-web/';
  } else if (requestHandler.baseType == 2){//绘本模块接口
    var baseUrl = 'https://www.yaojia.com/educate-book-web/';
  } else if (requestHandler.baseType == 3) {//听一听模块
    var baseUrl = 'https://m.baxueshe.com/tuling/';//https://m.baxueshe.com/tuling/
    contentType = 'application/x-www-form-urlencoded';
  }
  console.log("url = " + baseUrl+requestHandler.url);
  console.log(param);
  isShowLoading && wx.showLoading && wx.showLoading({ title: requestHandler.msg})  
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + requestHandler.url,
      method:method,
      data:param,
      header: {
        'content-type': contentType
      },
      success: function (res) {//请求成功
        isShowLoading && wx.hideLoading && wx.hideLoading();
        console.log(res.data);
        if (res.data.code == '000000' || requestHandler.url =='app-author/bind'){
          requestHandler.success(res.data);
        }else{
          wx.showToast({
            title: res.data.msg ? res.data.msg:'',
            icon: 'none',
            duration: 1500
          });
        }
        resolve(res.data);
      },
      fail:function(err){//请求失败
        console.log(err);
        isShowLoading && wx.hideLoading && wx.hideLoading();
        wx.showToast({
          title: '网络请求失败' + err.errMsg,
          icon: 'none',
          duration: 1500
        });
        reject(new Error('Network request failed'));
      }
    })
  })
}
//get请求
const getRequest = (requestHandler, isShowLoading) =>{
  request("GET", requestHandler, isShowLoading);
}
//post请求
const postRequest = (requestHandler, isShowLoading) => {
  request("POST", requestHandler, isShowLoading);
}

/**
 * 上传文件
 * */
const uploadFile = (path, requestHandler) =>{
  wx.showLoading({ title: '正在上传...', })
  return new Promise((resolve, reject) => {
    const uploadTask = wx.uploadFile({
      url: baseUrl + "file/upload",
      filePath: path,
      name: 'file',
      formData: requestHandler.param,
      success: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 1500
        });
        console.log(res.data);
        requestHandler.success(JSON.parse(res.data));
        resolve(JSON.parse(res.data));
      },
      fail: function (err) {
        console.log(err);
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'none',
          duration: 1500
        });
        reject(new Error('Network request failed'));
      }
    })
  })
}

/**
 * 下载文件
 */
const downloadFile = (url) =>{
  const downloadTask = wx.downloadFile({
    url: url,
    success: function (res) {
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500
          })
        }
      })
    },
    fail: function (err) {
      console.log(err);
    }
  })
}
  
module.exports = {
  getRequest: getRequest,
  postRequest: postRequest,
  uploadFile: uploadFile,
  downloadFile: downloadFile
}
    