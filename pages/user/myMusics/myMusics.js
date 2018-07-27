
var sliderWidth = 64; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["英语", "音乐", "故事", "诗词文学", "百科全说"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    refresh: false,
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sliderLeft: (app.globalData.device.windowWidth / this.data.tabs.length - sliderWidth) / 2,
      sliderOffset: app.globalData.device.windowWidth / this.data.tabs.length * this.data.activeIndex,
      imgWidth: (app.globalData.device.windowWidth - 48) / 2
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      page: 1
    })
    this.getMusics();
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {//英语
    } else if (e.currentTarget.id == 1) {//音乐
    } else if (e.currentTarget.id == 2) {//故事
    } else if (e.currentTarget.id == 3) {//诗词文学
    } else {//百科全说

    }
  },
  //收藏专辑列表
  getMusics: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "favo/album/query",
      params: {userId: app.globalData.userInfo.userId, page: that.data.page, size: that.data.size},
      msg: "加载中...",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (that.data.page <= 1) {
          that.setData({
            musics: res.data.content
          })
        } else {
          that.setData({
            musics: that.data.musics.concat(res.data.content)
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

    this.getMusics();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getMusics();
  }
})