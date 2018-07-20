
var sliderWidth = 64; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: [{name: "全部", url: "../../../images/icon_all.png"}, {name: "学英语", url: "../../../images/icon_english.png"},
      {name: "听音乐", url: "../../../images/icon_music_tab.png"}, {name: "讲故事", url: "../../../images/icon_story.png"},
      {name: "诗词文学", url: "../../../images/icon_shici.png"}, {name: "百科", url: "../../../images/icon_baike.png"}]
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

})