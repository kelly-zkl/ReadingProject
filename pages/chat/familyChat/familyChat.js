
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh: false,
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onUnload:function(e){
   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      page: 1
    });
    this.getFamilyMembers();
    this.getChatList();
  },
  /**跳转到成员管理页面*/
  gotoUserManager: function () {
    wx.navigateTo({
      url: '/pages/user/userManager/userManager?familyId=' + app.globalData.userInfo.familyId
    })
  },
  /**跳转到成员身份页面*/
  gotoUserId: function () {
    var userId = e.currentTarget.id;
    var admin = e.currentTarget.dataset.admin;
    if (admin || userId == app.globalData.userInfo.userId) {
      wx.navigateTo({
        url: '/pages/user/setUserId/setUserId?id=' + userId + "&familyId=" + app.globalData.userInfo.familyId
      })
    }
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
        that.setData({
          members: res.data
        })
      }
    }, false);
  },
  /**获取聊天记录*/
  getChatList: function () {
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "message/query",
      params: {
        uid: app.globalData.userInfo.uid, groupId: app.globalData.userInfo.familyId, receiveId: app.globalData.userInfo.childId,
        page: that.data.page, size: that.data.size
      },
      msg: "加载中...",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }

        if (that.data.page <= 1) {
          that.setData({
            msgs: res.data.content
          })
        } else {
          that.setData({
            msgs: that.data.msgs.concat(res.data.content)
          })
        }
      }
    }, false);
  },
  /**发送消息到设备端 附件类型:iamge;video*/
  sendMsg: function () {
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "message/send",
      params: {
        uid: app.globalData.userInfo.uid, groupId: app.globalData.userInfo.familyId, receiveId: app.globalData.userInfo.childId,
        receiveType: "child", attachType: "video", attachUrl: that.data.video, content: that.data.content
      },
      msg: "加载中...",
      success: res => {
        this.setData({
          page: 1
        });
        this.getChatList();
      }
    }, false);
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh: true,
      page: 1
    });

    this.getFamilyMembers();
    this.getChatList();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getChatList();
  }
})