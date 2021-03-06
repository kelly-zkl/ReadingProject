
var base64 = require("../../../images/base64");
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgWidth:'0px',
    isBind:true,
    bindW:0,
    unbindW:0,
    neverBind:true,
    bg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      imgWidth: app.globalData.homeWidth.imgWidth,
      bg: base64.bg,
      welbg: base64.welbg,
      iconWel: base64.iconWel
    });

    // 加入家庭组
    if (options.familyId) {
      this.setData({
        familyId: options.familyId
      })
      this.addMembers();
    }
    // 分享绘本
    if (options.bookId) {
      wx.navigateTo({
        url: '/pages/book/bookDetail/bookDetail?id=' + options.bookId
      })
    }
    // 分享专辑
    if (options.albumId) {
      wx.navigateTo({
        url: '/pages/music/musicDetail/musicDetail?id=' + options.albumId
      })
    }
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
        that.getSelectBaby();
      }
    }, true);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.familyId){
      this.getSelectBaby();
    }
  },
  /**跳转到设备设置页面*/
  gotoSet:function(){
    wx.navigateTo({
      url: '/pages/device/deviceSet/deviceSet',
    })
  },
  /**跳转到添加/绑定设备*/
  bindDevice:function(){
    var url = '/pages/device/bindDevice/bindDevice';
    if (app.globalData.userInfo.childId){
      url = '/pages/device/bindDevice/bindDevice?id=' + app.globalData.userInfo.childId
    }
    wx.navigateTo({
      url: url
    })
  },
  /**跳转到已绑定的设备列表页面*/
  gotoDevice:function(){
    wx.navigateTo({
      url: '/pages/device/deviceList/deviceList',
    })
  },
  /**扫码添加家庭成员*/
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
  //获取当前选择的设备--》baby
  getSelectBaby:function(){
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "user/child/master",
      params: {uid: app.globalData.userInfo.uid },
      msg: "加载中...",
      success: res => {
        var neverBind = true;
        var isBind = false;
        var baby = {};

        if(res.data){//已经绑定过
          neverBind = false;
          baby = res.data;

          app.globalData.baby = res.data;

          app.globalData.userInfo["admin"] = (res.data.creator == app.globalData.userInfo.userId);
          app.globalData.userInfo["childId"] = res.data.childId;
          app.globalData.userInfo["familyId"] = res.data.familyId
          
          isBind = (res.data.bindState?res.data.bindState == "binding" ? true : res.data.bindState == "unbind" ? false : false:false);

          if (res.data.deviceId){//绑定设备
            app.globalData.userInfo["deviceId"] = res.data.deviceId;

            that.getDeviceStatus();
            that.getBabyBooks();
          }
          that.getMusics();
        }else{//从未绑定过
          neverBind = true;
          isBind = false;
        }

        app.globalData.userInfo["isBind"] = isBind;
        
        this.setData({
          neverBind: neverBind,
          isBind: isBind,
          baby: baby
        });
      }
    }, false);
  },
  //获取设备状态
  getDeviceStatus:function(){
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
  //宝宝书架
  getBabyBooks: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "childBook/query",
      params: {childId: app.globalData.userInfo.childId,page:1,size:3},
      msg: "加载中...",
      success: res => {
        this.setData({
          books: res.data.content
        });
      }
    }, false);
  },
  //宝宝歌单
  getMusics: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "childMusicFavo/query",
      params: { page:1, size: 999999, childId: app.globalData.userInfo.childId },
      msg: "加载中...",
      success: res => {
        this.setData({
          music: res.data.content ? res.data.content.length:0
        });
      }
    }, false);
  }
})