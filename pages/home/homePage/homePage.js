// pages/home/homePage/homePage.js
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

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          imgWidth: ((res.windowWidth - 76) / 3)+'px',
          bindW: (res.windowHeight*0.28),
          unbindW: (res.windowHeight * 0.42),
        })
      }
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
  /**添加/绑定设备*/
  bindDevice:function(){
    wx.navigateTo({
      url: '/pages/device/bindDevice/bindDevice',
    })
  },
  /**扫码添加家庭成员*/
  scanCode:function(){
  
  }
})