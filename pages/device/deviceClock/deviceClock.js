
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopu: false,
    upNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  // 开关
  switchChange: function (e) {
    this.togglePopu();
  },

  // 跳转添加闹钟界面
  addClock:function(){
    wx.navigateTo({
      url: '/pages/device/addClock/addClock'
    })
  },
  // 设置弹框
  togglePopu: function () {
    this.setData({
      showPopu: !this.data.showPopu
    })
  },
  // 开始设置
  startChange: function () {
    var that = this;
    that.setData({
      showPopu: false
    });
    wx.showLoading({
      title: this.data.upNum + '%',
      mask: true
    })
    var num = this.data.upNum;
    var i = setInterval(function () {
      if (num < 100) {
        num = num + 10;
        that.setData({
          upNum: num
        });
        wx.hideLoading();
        wx.showLoading({
          title: that.data.upNum + '%',
          mask: true
        })
      } else {
        clearInterval(i);
        wx.hideLoading();
        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 2000
        })
      }
    }, 1000)
  },
})