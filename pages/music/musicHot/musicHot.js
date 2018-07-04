// pages/music/musicHot/musicHot.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: ""
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

  /**跳转到音乐列表页*/
  gotoList:function(){
    wx.navigateTo({
      url: '/pages/music/musicList/musicList'
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      show: false
    });
    // this.getCourts();
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      show: false
    });
    // this.getCourts();
  },
  inputTyping: function (e) {
    console.log(e.detail.value);
    this.setData({
      inputVal: e.detail.value,
      show: false
    });
    if (e.detail.value.length > 0) {
      // this.getCourts();
    }
  }
})