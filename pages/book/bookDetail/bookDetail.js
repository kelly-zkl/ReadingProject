
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

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
    lanaugae:'英文原声',
    lanIdx:1,
    currentIdx:0,
    currentStr:'',
    follow:0,
    pause:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scrowHeight: app.globalData.device.windowHeight - 145,
      currentStr: (this.data.currentIdx + 1) + "/" + this.data.imgUrls.length,
      bookId: options.id
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBookDetail();
  },
  // 滑动图片
  changeImg:function(e){
    console.log(e);
    this.setData({
      currentIdx: e.detail.current,
      currentStr: (e.detail.current + 1) + "/" + this.data.imgUrls.length
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
      currentStr: (index + 1) + "/" + this.data.imgUrls.length
    });
  },
  // 下一页
  nextImg:function(){
    var index = this.data.currentIdx;
    if (index < this.data.imgUrls.length-1) {
      index = index + 1;
    }
    this.setData({
      currentIdx: index,
      currentStr: (index + 1) + "/" + this.data.imgUrls.length
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
    if (this.data.follow == 0){
      this.setData({
        follow:1
      })
    }else{
      this.setData({
        follow: 0
      })
    }
  },
  // 分享
  share:function(){

  },
  // 读书暂停/开始
  readBook: function () {
    if (this.data.pause == 0) {
      this.setData({
        pause: 1
      })
    } else {
      this.setData({
        pause: 0
      })
    }
  },
  //绘本详情
  getBookDetail: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "book/detail/" + that.data.bookId,
      params: { bookId:that.data.bookId},
      msg: "加载中...",
      success: res => {
        this.setData({
          bookDetail: res.data
        });
      }
    }, false);
  },
})