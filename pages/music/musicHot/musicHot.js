
var sliderWidth = 64; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: [{name: "全部", url: "../../../images/icon_all.png"}, {name: "学英语", url: "../../../images/icon_english.png"},
      {name: "听音乐", url: "../../../images/icon_music_tab.png"}, {name: "讲故事", url: "../../../images/icon_story.png"}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgWidth: (app.globalData.device.windowWidth - 48) / 2
    });

    // http.postRequest({
    //   baseType: 3,
    //   url: "getuserid.do",
    //   params: {
    //     // apiKey: "146b1f5e3e544427886841123c274e6d", secert: "8fN99ym0W240sbQa"
    //     data: {uniqueId: app.globalData.userInfo.deviceId},
    //     key: "146b1f5e3e544427886841123c274e6d",
    //     timestamp: new Date().getTime()
    //   },
    //   msg: "操作中...",
    //   success: res => {
    //     // wx.showToast({ title: '成功加入家庭组', icon: 'info', duration: 1500 })
    //   }
    // }, false);
    // var url = 'http://iot-ai.tuling123.com/jump/app/source?apiKey=146b1f5e3e544427886841123c274e6d&uid=216412113&client='
    //   + app.globalData.device.platform;
    // console.log(url);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMusics();
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
})