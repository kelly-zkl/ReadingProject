// pages/user/setUserId/setUserId.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choose:0,
    showPopu: false,
    identity: ""
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

  //选择身份
  bindChecked: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      choose: index
    })
  },
  // 设置弹框
  togglePopu: function () {
    this.setData({
      identity: "",
      showPopu: !this.data.showPopu
    })
  },
  // 自定义身份
  inputIdentity: function (e) {
    this.setData({
      identity: e.detail.value
    })
  },
  saveIdentity: function () {
    if (!!this.data.identity) {
      this.setData({
        showPopu: false
      })
      wx.navigateBack()
    } else {
      wx.showToast({
        title: '请输入语音指令',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 确认选择
  saveChoose:function(){

  }
})