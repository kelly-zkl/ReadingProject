
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceW: 0,
    admin:false,
    members:[],
    apiKey: 'a0eb0c3dded04e638047f6fe00b71fa7'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.setData({
      deviceW: app.globalData.homeWidth.bindW,
      admin: app.globalData.userInfo.admin,
      flxWidth: (app.globalData.device.windowWidth - 30) / 4
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBabyDetail();
    this.getDeviceStatus();
    this.getFamilyMembers();
  },

  /**跳转到宝宝档案页面*/
  gotoBaby:function(){
    wx.navigateTo({
      url: '/pages/baby/babyFile/babyFile?id=' + app.globalData.userInfo.childId
    })
  },
  /**跳转到成员管理页面*/
  gotoUserManager: function () {
    wx.navigateTo({
      url: '/pages/user/userManager/userManager?familyId=' + app.globalData.userInfo.familyId
    })
  },
  /**跳转到成员身份页面*/
  gotoUserId: function (e) {
    var userId = e.currentTarget.id;
    var admin = this.data.admin;
    if (admin || userId == app.globalData.userInfo.userId) {
      wx.navigateTo({
        url: '/pages/user/setUserId/setUserId?id=' + userId + "&familyId=" + app.globalData.userInfo.familyId
      })
    }
  },
  // 设备解绑
  unBindDevice:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '解绑后，当前用户将无法管理设备',
      confirmText:'确认解绑',
      confirmColor:'#00d2ff',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            baseType: 0,
            url: "child/unbindDevice",
            params: { uid: app.globalData.userInfo.uid, childId: app.globalData.userInfo.childId },
            msg: "操作中...",
            success: res => {
              wx.showToast({ title: '解绑成功', icon: 'none', duration: 1500 });
              setTimeout(function () {
                wx.navigateBack()
              }, 1500)
            }
          }, true);
          //图灵设备解绑
          that.unbindApp();
        }
      }
    })
  },
  //绑定图灵设备
  unbindApp() {
    var that = this;
    http.postRequest({
      baseType: 3,
      url: "app-author/unbind",
      params: {apiKey: that.data.apiKey, uid: app.globalData.userInfo.userId, deviceId: app.globalData.userInfo.deviceId},
      success: res => {
      }
    }, false);
  },
  // 获取宝宝详情
  getBabyDetail: function () {
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "child/detail",
      params: { childId: app.globalData.userInfo.childId, uid: app.globalData.userInfo.uid },
      msg: "加载中...",
      success: res => {
        this.setData({
          baby: res.data
        });
      }
    }, false);
  },
  //获取设备状态
  getDeviceStatus: function () {
    var that = this;
    http.postRequest({
      baseType: 1,
      url: "device/status",
      params: { uid: app.globalData.userInfo.uid, deviceId: app.globalData.userInfo.deviceId },
      msg: "加载中...",
      success: res => {

        this.setData({
          device: res.data
        });
      }
    }, false);
  },
  /**获取当前家庭组的成员*/
  getFamilyMembers: function () {
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "family/members",
      params: { uid: app.globalData.userInfo.uid, familyId: app.globalData.userInfo.familyId },
      msg: "加载中...",
      success: res => {
        var admin = false;
        (res.data || []).map(function (item) {
          if (item.user.userId == app.globalData.userInfo.userId) {
            admin = item.admin
          }
        })
        that.setData({
          members: res.data,
          admin: admin
        })
      }
    }, false);
  },
})