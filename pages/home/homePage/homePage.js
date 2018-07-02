
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgWidth:'0px',
    isBind:true,
    star:0,
    bindW:0,
    unbindW:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      imgWidth: app.globalData.homeWidth.imgWidth,
      bindW: app.globalData.homeWidth.bindW,
      unbindW: app.globalData.homeWidth.unbindW,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**跳转到设备设置页面*/
  gotoSet:function(){
    wx.navigateTo({
      url: '/pages/device/deviceSet/deviceSet',
    })
  },
  /**跳转到添加/绑定设备*/
  bindDevice:function(){
    wx.navigateTo({
      url: '/pages/device/bindDevice/bindDevice',
    })
  },
  /**跳转到已绑定的设备列表页面*/
  gotoDevice:function(){
    wx.navigateTo({
      url: '/pages/device/deviceList/deviceList',
    })
  },
  /**扫码添加家庭成员*/
  scanCode:function(){
  
  }
})