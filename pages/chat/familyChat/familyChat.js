
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.navigateTo({
      url: '/pages/chat/chatRoom/chatRoom'
    })
  },
  onUnload:function(e){
   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  }
})