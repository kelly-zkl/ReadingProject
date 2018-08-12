
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      familyId:options.familyId,
      myId: app.globalData.userInfo.userId
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMembers();
  },

  //设置身份
  togglePopup(e) {
    var userId = e.currentTarget.id;
    var admin = this.data.admin;
    if (userId == 1){
      this.setData({
        showPopup: false
      });
      return;
    }
    if (admin || userId == app.globalData.userInfo.userId){
      this.setData({
        showPopup: !this.data.showPopup,
        userId: e.currentTarget.id,
        admin: admin
      });
    }
  },
  popuChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1) {//设置身份
      wx.navigateTo({
        url: '/pages/user/setUserId/setUserId?id=' + that.data.userId + "&familyId=" + that.data.familyId
      })
    } else if (id == 2) {//删除
      that.deleteMember();
    }
    this.setData({
      showPopup: false
    });
  },
  // 家庭成员列表
  getMembers:function (){
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "family/members",
      params: { familyId: that.data.familyId, uid: app.globalData.userInfo.uid },
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
  // 设置家庭成员的身份
  setMemberId:function (e){
    var that = this;
    var name = e.currentTarget.id;
    http.postRequest({
      baseType: 0,
      url: "family/member/update",
      params: {
        familyId: that.data.familyId, uid: app.globalData.userInfo.uid, 
        userId: app.globalData.userInfo.userId, epithet: name },
      msg: "操作中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'none', duration: 1500 })
      }
    }, true);
  },
  /**删除成功--》仅限创建者 */
  deleteMember:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该家庭成员？',
      confirmText: '确认删除',
      confirmColor: '#00d2ff',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            baseType: 0,
            url: "family/member/delete",
            params: {
              familyId: that.data.familyId, uid: app.globalData.userInfo.uid,
              userId: that.data.userId
            },
            msg: "操作中...",
            success: res => {
              wx.showToast({ title: '删除成功', icon: 'none', duration: 1500 })
              this.getMembers();
            }
          }, true);
        }
      }
    })
  }
})