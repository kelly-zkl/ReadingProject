
var http = require("http.js");

App({
  onLaunch: function () {
    // 展示本地存储能力
    // wx.clearStorage();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.homeWidth['imgWidth']=((res.windowWidth - 70) / 3) + 'px';
        that.globalData.homeWidth['bindW']= (res.windowHeight * 0.28);
        that.globalData.homeWidth['unbindW']= (res.windowHeight * 0.40);
        that.globalData.device = res;
      }
    });
  },
  globalData: {
    userInfo: {},
    homeWidth:{},
    device:{},
    baby:{}
  }
})