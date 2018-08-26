// 图灵 apiKey: "a0eb0c3dded04e638047f6fe00b71fa7", secert: "v64B25a98x2FH417"
var sliderWidth = 64; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiKey:'2056caf029a640168f28bd1d04f4725a',
    secert:'6586ziuO23logm2F',
    tags: [{name: "全部", url: "../../../images/icon_all.png"}, {name: "学英语", url: "../../../images/icon_english.png"},
      {name: "听音乐", url: "../../../images/icon_music_tab.png"}, {name: "讲故事", url: "../../../images/icon_story.png"}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var url = 'https://iot-ai.tuling123.com/jump/app/source?apiKey=' + this.data.apiKey+'&uid=' + app.globalData.userInfo.userId + '&client=' + app.globalData.device.platform;

    this.setData({
      imgWidth: (app.globalData.device.windowWidth - 48) / 2,
      musicUrl: url
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getMusics();
    this.bindDevice();
  },

  onUnload(){
    // wx.reLaunch({
    //   url: '/pages/home/homePage/homePage'
    // })
  },

  /**跳转到音乐列表页*/
  gotoList:function(){
    wx.navigateTo({
      url: '/pages/music/musicList/musicList'
    })
  },

  // 跳转搜索页面
  gotoSearch:function(){
    wx.navigateTo({
      url: '/pages/common/search/search?type=album'
    })
  },
  //专辑列表
  getMusics: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "album/query",
      params: {},
      msg: "加载中...",
      success: res => {
        this.setData({
          musics: res.data.content
        });
      }
    }, false);
  },

  //绑定设备
  bindDevice(){
    var that = this;
    http.postRequest({
      baseType: 3,
      url: "app-author/bind",
      params: {
        apiKey: that.data.apiKey, uid: app.globalData.userInfo.userId, deviceId: app.globalData.userInfo.deviceId,
        name: app.globalData.userInfo.nickname, imageUrl: app.globalData.userInfo.avatar},
      success: res => {
        var url = 'https://iot-ai.tuling123.com/jump/app/source?apiKey=apiKey=' + this.data.apiKey +'&uid=' + app.globalData.userInfo.userId + '&client=' + app.globalData.device.platform;

        this.setData({
          musicUrl: url
        });
      }
    }, false);
  }
})