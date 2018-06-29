// pages/device/deviceSet/deviceSet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceW: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: (res.windowHeight * 0.28)
        })
      }
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
      url: '/pages/baby/babyFile/babyFile',
    })
  }
})