
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags:["妈妈","爸爸","奶奶","爷爷"],
    choose:0,
    showPopu: false,
    identity: "妈妈"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId:options.id,
      familyId: options.familyId
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  //选择身份
  bindChecked: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      choose: index,
      identity: this.data.tags[index]
    })
  },
  // 设置弹框
  togglePopu: function () {
    this.setData({
      identity: "",
      showPopu: !this.data.showPopu
    })
  },
  // 自定义身份
  inputIdentity: function (e) {
    this.setData({
      identity: e.detail.value
    })
  },
  saveIdentity: function () {
    if (!!this.data.identity) {
      this.setData({
        showPopu: false
      })
      this.saveChoose();
    } else {
      wx.showToast({ title: '请输入身份', icon: 'none', duration: 1500 })
    }
  },
  // 确认选择
  saveChoose:function(){
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "family/member/update",
      params: { uid: app.globalData.userInfo.uid, userId: that.data.userId, familyId: that.data.familyId, epithet: that.data.identity},
      msg: "设置中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'none', duration: 1500 })
        setTimeout(function () {
          wx.navigateBack()
        }, 1500)
      }
    }, false);
  }
})