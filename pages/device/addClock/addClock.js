// pages/device/addClock/addClock.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:'07:00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  // 设置时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  
  // 保存闹钟设置
  saveClock:function(){

  }
})