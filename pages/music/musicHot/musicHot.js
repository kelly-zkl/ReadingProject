// 图灵 apiKey: "a0eb0c3dded04e638047f6fe00b71fa7", secert: "v64B25a98x2FH417"
var sliderWidth = 64; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

var aes = require('../../../utils/aes.js')
var md5 = require('../../../utils/md5.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiKey:'a0eb0c3dded04e638047f6fe00b71fa7',
    secert:'v64B25a98x2FH417',
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getMusics();
    var timStap = new Date().getTime();
    var md5Key = this.data.secert + timStap + this.data.apiKey;
    var aeskey = md5.hexMD5(md5Key);

    var key = aes.enc.Utf8.parse(aeskey);
    var iv = aes.enc.Utf8.parse([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

    var param = {uniqueId: app.globalData.userInfo.deviceId};
    var data = aes.encrypt(param, key, iv)

    console.log("md5Key", md5Key);
    console.log("aeskey", aeskey);
    console.log("key", key);
    console.log("iv", iv);
    console.log("data", data);

    http.postRequest({
      baseType: 3,
      url: "getuserid.do",
      params: {data: data, key: this.data.apiKey, timestamp: timStap},
      msg: "操作中...",
      success: res => {
        // wx.showToast({ title: '成功加入家庭组', icon: 'info', duration: 1500 })
      }
    }, false);
    var url = 'http://iot-ai.tuling123.com/jump/app/source?apiKey=a0eb0c3dded04e638047f6fe00b71fa7&uid=216412113&client='
      + app.globalData.device.platform;
    console.log(url);
    this.setData({
      musicUrl: url
    })
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