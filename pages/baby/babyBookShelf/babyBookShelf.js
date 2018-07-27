
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags:[],
    refresh: false,
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgWidth: (app.globalData.device.windowWidth - 40) / 3
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      page: 1
    })
    this.getBabyBooks();
    this.getReadCount();
  },

  /**
   * 跳转录制列表
   */
  gotoRocords:function(){
    wx.navigateTo({
      url: '/pages/baby/babyRecords/babyRecords'
    })
  },
  //查询宝宝阅读情况
  getReadCount:function(){
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "childBook/stat",
      params: { childId: app.globalData.userInfo.childId },
      msg: "加载中...",
      success: res => {
        this.setData({
          tags: [{num: res.data.bookCount+"本"}, {num: res.data.readCount+"遍"},{num:"0分"}],
        });
      }
    }, false);
  },
  //宝宝书架
  getBabyBooks: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "childBook/query",
      params: {childId: app.globalData.userInfo.childId,page:that.data.page,size:that.data.size},
      msg: "加载中...",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (that.data.page <= 1) {
          that.setData({
            books: res.data.content
          })
        } else {
          that.setData({
            books: that.data.books.concat(res.data.content)
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

    this.getBabyBooks();
    this.getReadCount();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getBabyBooks();
  }
})