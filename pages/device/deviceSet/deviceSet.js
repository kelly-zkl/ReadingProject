
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceW: 0,
    sex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.setData({
      deviceW: app.globalData.homeWidth.bindW
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**跳转到宝宝档案页面*/
  gotoBaby:function(){
    wx.navigateTo({
      url: '/pages/baby/babyFile/babyFile'
    })
  },
  /**跳转到成员管理页面*/
  gotoUserManager:function(){
    wx.navigateTo({
      url: '/pages/user/userManager/userManager'
    })
  },
  /**跳转到成员身份页面*/
  gotoUserId:function(){
    wx.navigateTo({
      url: '/pages/user/setUserId/setUserId'
    })
  },
  // 设备解绑
  unBindDevice:function(){
    wx.showModal({
      title: '提示',
      content: '解绑后，当前用户将无法管理设备',
      confirmText:'确认解绑',
      confirmColor:'#00d2ff',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  }
})