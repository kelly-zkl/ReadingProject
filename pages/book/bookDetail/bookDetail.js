
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img.zcool.cn/community/01d881579dc3620000018c1b430c4b.JPG@3000w_1l_2o_100sh.jpg',
      'http://img.zcool.cn/community/010f87596f13e6a8012193a363df45.jpg@1280w_1l_2o_100sh.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    showPopup: false,
    lanaugae:'中文原声',
    lanIdx:2,
    currentIdx:0,
    currentStr:'',
    pause:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scrowHeight: app.globalData.device.windowHeight - 145,
      currentStr: (this.data.currentIdx + 1) + "/" + 1,
      bookId: options.id,
      isBind: app.globalData.userInfo.isBind
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBookDetail();
    // this.getBookPage();
    this.getCollect();
  },
  // 滑动图片
  changeImg:function(e){
    console.log(e);
    this.setData({
      currentIdx: e.detail.current,
      currentStr: (e.detail.current + 1) + "/" + this.bookDetail.pageList.length
    });
  },
  // 上一页
  preImg:function(){
    var index = this.data.currentIdx;
    if (index > 0){
      index = index-1;
    }
    this.setData({
      currentIdx: index,
      currentStr: (index + 1) + "/" + this.bookDetail.pageList.length
    });
  },
  // 下一页
  nextImg:function(){
    var index = this.data.currentIdx;
    if (index < this.bookDetail.pageList.length-1) {
      index = index + 1;
    }
    this.setData({
      currentIdx: index,
      currentStr: (index + 1) + "/" + this.bookDetail.pageList.length
    });
  },

  imageLoad: function (e) {
    var res = wx.getSystemInfoSync();
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;
    this.setData({
      bannerHeight: res.windowWidth / ratio
    })
  },
  //设置身份
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  popuChange: function (e) {
    var that = this;
    var str = '英文原声';
    var id = e.currentTarget.id;
    if (id == 1) {//英文原声
      str = '英文原声';
      this.setData({
        lanaugae: str,
        lanIdx: id
      });
    } else if (id == 2) {//中文原声
      str = '中文原声';
      this.setData({
        lanaugae: str,
        lanIdx: id
      });
    }
    this.setData({
      showPopup: false
    });
  },
  // 收藏
  collect:function(){
    if (!!this.data.bfId){
      this.cancelCollect();
    }else{
      this.collectBook();
    }
  },
  // 读书暂停/开始
  readBook: function () {
    var url ="";
    if (this.data.lanIdx==1){
      url = this.bookDetail.pageList[this.data.currentIdx].audioEn[0]
    }else{
      url = this.bookDetail.pageList[this.data.currentIdx].audioZh[0]
    }
    innerAudioContext.src = url

    if (this.data.pause == 0) {
      innerAudioContext.play();
      this.setData({
        pause: 1
      })
    } else {
      innerAudioContext.pause();
      this.setData({
        pause: 0
      })
    }

    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      wx.showToast({title: res.errMsg, icon: 'info', duration: 1500})
    })
  },
  //绘本详情
  getBookDetail: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "book/detail/" + that.data.bookId,
      params: {},
      msg: "加载中...",
      success: res => {
        this.setData({
          bookDetail: res.data
        });
      }
    }, false);
  },
  //绘本书页
  getBookPage: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "bookPage/query",
      params: {bookId:that.data.bookId},
      msg: "加载中...",
      success: res => {
        this.setData({
          bookPage: res.data
        });
      }
    }, false);
  },
  //收藏绘本
  collectBook:function(){
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "favo/book/create",
      params: [{bookId: that.data.bookId,userId:app.globalData.userInfo.userId}],
      msg: "加载中...",
      success: res => {
        wx.showToast({title: '收藏成功', icon: 'info', duration: 1500});
        that.getCollect();
      }
    }, false);
  },
  //取消收藏绘本
  cancelCollect:function(){
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "favo/book/delete",
      params: [that.data.bfId],
      msg: "加载中...",
      success: res => {
        wx.showToast({title: '已取消收藏', icon: 'info', duration: 1500});
        that.getCollect();
      }
    }, false);
  },

  //查询是否收藏
  getCollect:function(){
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "favo/book/detail",
      params: {bookId: that.data.bookId, userId:app.globalData.userInfo.userId},
      msg: "加载中...",
      success: res => {
        that.setData({
          bfId: res.data
        })
      }
    }, false);
  },

  //添加到宝宝书单
  addToBaby:function(){
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "childBook/create",
      params: {bookId:that.data.bookId, userId:app.globalData.userInfo.userId,childId: app.globalData.userInfo.childId},
      msg: "操作中...",
      success: res => {
        wx.showToast({ title: '已添加到宝宝书单', icon: 'info', duration: 1500 });
      }
    }, true);
  },
  //推送到设备
  pushToDevice:function(){
    // var that = this;
    // http.postRequest({
    //   baseType: 2,
    //   url: "childBook/create",
    //   params: {bookId: that.data.bookId, userId: app.globalData.userInfo.userId, childId: app.globalData.userInfo.childId },
    //   msg: "操作中...",
    //   success: res => {
    //     wx.showToast({ title: '推送成功', icon: 'info', duration: 1500 });
    //   }
    // }, true);
  },

  //页面卸载是销毁播放器
  onUnload:function(){
    innerAudioContext.destroy();
  },
  //分享页面
  onShareAppMessage: function (e) {
    var text = '/pages/login/login?bookId=' + this.data.bookId;
    console.log(text);

    return {
      title: '小精灵',
      desc: this.data.bookDetail.bookName,
      path: text,
      success: function (res) {// 转发成功
        wx.showToast({ title: '分享成功', icon: 'info', duration: 1500 })
      },
      fail: function (res) {// 转发失败
        wx.showToast({ title: '分享失败', icon: 'info', duration: 1500 })
      }
    }
  }
})