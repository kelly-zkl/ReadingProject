
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
    star:0,
    bindW:0,
    unbindW:0,
    neverBind:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      imgWidth: app.globalData.homeWidth.imgWidth,
      bindW: app.globalData.homeWidth.bindW,
      unbindW: app.globalData.homeWidth.unbindW,
    });

    // 加入家庭组
    if (options.familyId) {
      this.setData({
        familyId: options.familyId
      })
      this.addMembers();
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
      }
    }, true);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getSelectBaby();
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
  scanCode:function(){
  
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
        app.globalData.baby = res.data;

        app.globalData.userInfo["admin"] = (res.data.creator == app.globalData.userInfo.userId);

        var neverBind = true;
        var isBind = res.data.bindState == "binding" ? true : res.data.bindState == "unbind"?false:false;
        var baby = {};
        app.globalData.userInfo["isBind"] = isBind;

        if(res.data){//已经绑定过
          neverBind = false;
          baby = res.data;
          app.globalData.userInfo["childId"] = res.data.childId;
          app.globalData.userInfo["familyId"] = "5b4ef0c6698a496b1dea0925"
          if (res.data.deviceId){//绑定设备
            app.globalData.userInfo["deviceId"] = res.data.deviceId;

            // that.getDeviceStatus();
            that.getBabyBooks();
          }
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
      params: { childId: app.globalData.userInfo.childId},
      msg: "加载中...",
      success: res => {

        this.setData({
          books: res.data.content
        });
      }
    }, false);
  }
})