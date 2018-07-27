
const app = getApp();
var http = require("../../../http.js");
var drawQrcode = require('../../../utils/qrcode.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:'',
    marginLeft:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      familyId: options.familyId,
      text: '/pages/user/userCenter/userCenter?familyId='+ options.familyId,
      marginLeft: (app.globalData.device.windowWidth - 280) / 2,
    })

    this.createQrCode();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  //获取页面二维码
  createQrCode: function () {
    var that = this;
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: that.data.text
    })
  },
  //分享页面
  onShareAppMessage: function (e) {
    var text = '/pages/login/login?familyId=' + this.data.familyId;
    console.log(text);

    return {
      title: '小精灵',
      desc: '添加家庭成员',
      path: text,
      success: function (res) {// 转发成功
        wx.showToast({ title: '分享成功', icon: 'info', duration: 1500})
      },
      fail: function (res) {// 转发失败
        wx.showToast({ title: '分享失败', icon: 'info', duration: 1500})
      }
    }
  }
})