
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: app.globalData.userInfo.userId
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMyFamily();
  },
  /**跳转到成员管理页面*/
  gotoUserManager: function (e) {
    wx.navigateTo({
      url: '/pages/user/userManager/userManager?familyId=' + e.currentTarget.id
    })
  },
  /**跳转到成员身份页面*/
  gotoUserId: function (e) {
    wx.navigateTo({
      url: '/pages/user/setUserId/setUserId?id=' + app.globalData.userInfo.userId + "&familyId=" + e.currentTarget.id
    })
  },
  /**跳转到添加成员页面*/
  gotoAddMember:function(e){
    wx.navigateTo({
      url: '/pages/user/addMember/addMember?familyId=' + e.currentTarget.id
    })
  },
  /**退出家庭组*/
  exitFamily:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要退出该家庭成员？',
      confirmText: '确认退出',
      confirmColor: '#00d2ff',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            baseType: 0,
            url: "family/member/exit",
            params: { uid: app.globalData.userInfo.uid, familyId:e.currentTarget.id},
            msg: "加载中...",
            success: res => {
              wx.showToast({ title: '退出成功', icon: 'none', duration: 1500 })
              that.getMyFamily();
            }
          }, true);
        }
      }
    })
  },
  /**获取我的家庭组 */
  getMyFamily:function(){
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "family/mine",
      params: {uid: app.globalData.userInfo.uid },
      msg: "加载中...",
      success: res => {
        this.setData({
          family: res.data
        });
      }
    }, false);
  }
})