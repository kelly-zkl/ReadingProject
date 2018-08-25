
var sliderWidth = 64; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["已录完", "草稿箱"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    up:0,
    refresh: false,
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   sliderLeft: (app.globalData.device.windowWidth / this.data.tabs.length - sliderWidth) / 2,
    //   sliderOffset: app.globalData.device.windowWidth / this.data.tabs.length * this.data.activeIndex
    // });
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {//已录完
    } else {//草稿箱

    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getRecords();
  },
  // 上传录制音频
  uploadBook:function(){
    if (this.data.up == 0){
      this.setData({
        up:1
      })
    }else{
      this.setData({
        up: 0
      })
    }
  },
  //宝宝书架
  getRecords: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "childBook/customizeAudio/query",
      params: { childId: app.globalData.userInfo.childId, page: that.data.page, size: that.data.size },
      msg: "加载中...",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (that.data.page <= 1) {
          that.setData({
            records: res.data.content
          })
        } else {
          that.setData({
            records: that.data.records.concat(res.data.content)
          })
        }
      }
    }, false);
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh: true,
      page: 1
    });

    this.getRecords();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getRecords();
  }
})