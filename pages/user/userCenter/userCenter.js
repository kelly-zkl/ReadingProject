
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBabyList();
    this.getFavNum();
  },

  /**跳转我的身份页面*/
  gotoIdentity:function (){
    wx.navigateTo({
      url: '/pages/user/setUserId/setUserId'
    })
  },
  /**跳转已绑定设备页面*/
  gotoMyDevice:function (){
    wx.navigateTo({
      url: '/pages/device/deviceList/deviceList'
    })
  },
  /**跳转我的专辑页面*/
  gotoMyMusics: function () {
    wx.navigateTo({
      url: '/pages/user/myMusics/myMusics'
    })
  },
  /**跳转我的绘本页面*/
  gotoMyBooks: function () {
    wx.navigateTo({
      url: '/pages/user/myBooks/myBooks'
    })
  },
  //扫一扫
  scan: function (e) {
    wx.scanCode({
      scanType: ['qrCode'],
      success: (res) => {
        console.log(res);
        wx.showToast({ title: '扫描成功', icon: 'info', duration: 1500 })
        if (res.result && res.result.indexOf('/pages/') == 0 && res.result.indexOf('familyId') > 0) {
          var familyId = res.result.substring(res.result.indexOf("=") + 1, res.result.length)
          console.log(familyId);
          this.setData({
            familyId: familyId
          })
          this.addMembers();
        }
      },
      fail: (res) => {
        console.log(res);
        wx.showToast({ title: '扫描失败', icon: 'info', duration: 1500 });
      }
    })
  },
  // 加入家庭组
  addMembers: function () {
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "family/member/add",
      params: {
        familyId: that.data.familyId, uid: app.globalData.userInfo.uid,
        userId: app.globalData.userInfo.userId
      },
      msg: "操作中...",
      success: res => {
        wx.showToast({ title: '成功加入家庭组', icon: 'info', duration: 1500 })
      }
    }, true);
  },
  // 获取宝宝列表
  getBabyList: function () {
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "user/childs",
      params: {uid: app.globalData.userInfo.uid },
      msg: "加载中...",
      success: res => {
        var arry = res.data.length;
        this.setData({
          num: arry
        });
      }
    }, false);
  },
  // 获取用户收藏的绘本和专辑数
  getFavNum: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "favo/stat/" + app.globalData.userInfo.userId,
      params: {},
      msg: "加载中...",
      success: res => {
        this.setData({
          bookFavoCount: res.data.bookFavoCount,
          albumFavoCount: res.data.albumFavoCount
        });
      }
    }, false);
  },
})