// pages/user/setUserId/setUserId.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choose:0
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

  //选择比赛
  bindChecked: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      choose: index
    })
  },
})