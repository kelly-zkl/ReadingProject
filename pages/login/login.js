
var base64 = require("../../images/base64");
var http = require("../../http.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),//
    url: '/pages/home/homePage/homePage'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.setData({
      welbg: base64.welbg,
      iconWel: base64.iconWel
    });

    var familyId = '';
    if (options.familyId){//添加家庭成员
      this.setData({
        url: '/pages/home/homePage/homePage?familyId=' + options.familyId
      })
    }
    if (options.albumId) {//分享专辑
      this.setData({
        url: '/pages/home/homePage/homePage?albumId=' + options.albumId
      })
    }
    if (options.bookId) {//分享绘本
      this.setData({
        url: '/pages/home/homePage/homePage?bookId=' + options.bookId
      })
    }
    //获取用户信息
    wx.getStorage({
      key: 'user',
      success: function (res) {
        app.globalData.userInfo = JSON.parse(res.data);

        wx.reLaunch({
          url: that.data.url
        })
      },
      fail: function (res) {//登录
        // that.login();
      }
    })
  },
  //授权登录弹框
  login: function (e) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              console.log(res);
              if (res.code) {
                //发起网络请求
                var code = res.code;
                wx.getUserInfo({
                  success: res => {
                    // console.log(res);
                    var encryptedData = res.encryptedData;
                    var iv = res.iv;
                    this.setData({
                      code: code,
                      encryptedData: encryptedData,
                      iv:iv
                    })
                    // 调用登录接口
                    this.loginRequst();
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        } else {
          //用户按了拒绝按钮
          wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
            showCancel: false,
            confirmText: '返回授权',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击了“返回授权”')
              }
            }
          })
        }
      }
    })
  },
  // 登录请求
  loginRequst:function(){
    // 微信验证
    http.postRequest({
      baseType:0,
      url: "user/wxAppletSession",
      params: { wxLoginCode: this.data.code },
      success: res => {
        // 登录
        http.postRequest({
          baseType: 0,
          url: "user/wxAppletLogin",
          msg: "登录中....",
          params: { encryptedData: this.data.encryptedData, iv: this.data.iv, sessionId: res.data },
          success: res => {
            app.globalData.userInfo = res.data;

            wx.setStorageSync('user', JSON.stringify(res.data))

            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }

            wx.reLaunch({
              url: this.data.url
            })
          }
        }, true);
      }
    }, false);
  }
})