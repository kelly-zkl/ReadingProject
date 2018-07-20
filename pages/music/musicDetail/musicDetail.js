
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    down:0,
    play:0
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
  
  },

  // 播放音乐
  playMusic:function(){
    if (this.data.play == 0) {
      this.setData({
        play: 1
      })
    }  else {
      this.setData({
        play: 0
      })
    }
  },

  /**
   * 下载音乐
   */
  downloadMusic:function(){
    if (this.data.down == 0){
      this.setData({
        down:1
      })
    } else if (this.data.down == 1) {
      this.setData({
        down: 2
      })
    }else{
      this.setData({
        down: 0
      })
    }
  }
})