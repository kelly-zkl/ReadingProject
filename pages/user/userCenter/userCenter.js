// pages/user/userCenter/userCenter.js
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**跳转我的身份页面*/
  gotoIdentity:function(){
    wx.navigateTo({
      url: '',
    })
  },
  /**跳转已绑定设备页面*/
  gotoMyDevice:function(){
    wx.navigateTo({
      url: '',
    })
  },
  /**跳转我的专辑页面*/
  gotoMyMusics: function () {
    wx.navigateTo({
      url: '',
    })
  },
  /**跳转我的绘本页面*/
  gotoMyBooks: function () {
    wx.navigateTo({
      url: '',
    })
  }
})