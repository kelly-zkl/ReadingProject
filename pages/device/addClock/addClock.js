// pages/device/addClock/addClock.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:'07:00',
    showPopu:false,
    lingStr: "未设置"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  // 设置弹框
  togglePopu: function () {
    this.setData({
      ling:"",
      showPopu: !this.data.showPopu
    })
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
  // 语音指令
  inputLing:function(e){
    this.setData({
      ling: e.detail.value
    })
  },
  saveLing:function(){
    if (!!this.data.ling){
      this.setData({
        lingStr: this.data.ling,
        showPopu: false
      })
    }else{
      wx.showToast({
        title: '请输入语音指令',
        icon: 'none',
        duration: 2000
      })
    }
  },
  
  // 保存闹钟设置
  saveClock:function(){

  }
})