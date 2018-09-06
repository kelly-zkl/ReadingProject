
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags:["中文模式","英文模式","自定义模式"],
    lans:["中文","英文","自定义"],
    showPopu: false,
    upNum: 0,
    choose: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLanguage();
  },
  //选择语言
  bindChecked: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      choose: index
    })

    this.togglePopu();
  },
  // 设置弹框
  togglePopu: function () {
    this.setData({
      showPopu: !this.data.showPopu
    })

    if (!this.data.showPopu){
      this.getLanguage();
    }
  },
  // 开始设置
  startChange: function () {
    var that = this;
    that.setData({
      showPopu: false
    });

    var language = (that.data.choose == 0 ? 'AUDIO_ZH' : that.data.choose == 1 ? 'AUDIO_EN' : that.data.choose == 2 ? 'AUDIO_OTHER' :'AUDIO_ZH');

    http.postRequest({
      baseType: 0,
      url: "child/language/set",
      params: { childId: app.globalData.userInfo.childId, uid: app.globalData.userInfo.uid, language: language},
      msg: "加载中...",
      success: res => {
        wx.showToast({ title: '设置成功', icon: 'success', duration: 1500 });
        that.getLanguage();
      }
    }, true);
  },
  //查询设备的语言
  getLanguage(){
    http.postRequest({
      baseType: 0,
      url: "child/language",
      params: { childId: app.globalData.userInfo.childId, uid: app.globalData.userInfo.uid},
      msg: "加载中...",
      success: res => {
        var choose = (res.data == 'AUDIO_ZH' ? 0 : res.data == 'AUDIO_EN' ? 1 : res.data == 'AUDIO_OTHER'?2:0);

        this.setData({
          choose: choose
        });
      }
    }, false);
  }
})