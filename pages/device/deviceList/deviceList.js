
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    choose: 0,
  },
  onLoad: function (e) {
    
  },
  onShow:function (){
    this.getBabyList();
  },
  /**跳转到添加/绑定设备*/
  bindDevice: function () {
    wx.navigateTo({
      url: '/pages/device/bindDevice/bindDevice',
    })
  },
  //选择设备
  bindChecked: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var name = that.data.babys[index].nickname;
    var status = e.currentTarget.id;
    that.setData({
      choose: index,
      childId: that.data.babys[index].childId
    })
    if (status == "binding"){
      wx.showModal({
        title: '提示',
        content: '确认切换为' + name + "的小叮当？",
        confirmText: '确认切换',
        confirmColor: '#00d2ff',
        success: function (res) {
          if (res.confirm) {
            that.changeBaby();
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/device/bindDevice/bindDevice?id=' + that.data.childId,
      })
    }
  },
  // 获取宝宝列表
  getBabyList:function (){
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "user/childs",
      params: { familyId: app.globalData.userInfo.familyId, uid: app.globalData.userInfo.uid },
      msg: "加载中...",
      success: res => {
        var idx = 0;
        (res.data || []).map(function (item,index) {
          if (item.childId == app.globalData.userInfo.childId){
            idx = index;
          }
        });
        this.setData({
          babys: res.data,
          choose: idx
        });
      }
    }, false);
  },
  // 切换宝宝
  changeBaby:function (e){
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "user/child/master/select",
      params: { uid: app.globalData.userInfo.uid, childMaster: that.data.childId },
      msg: "切换宝宝...",
      success: res => {
        app.globalData.userInfo["childId"] = that.data.childId;
        wx.showToast({ title: '切换成功', icon: 'none', duration: 1500 })
      }
    }, true);
  }
})