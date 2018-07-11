
var sliderWidth = 64; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["音乐", "故事", "诗词", "百科","绘本"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    down: 0,
    play: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {//音乐
    } else if (e.currentTarget.id == 1) {//故事
    } else if (e.currentTarget.id == 2) {//诗词
    } else if (e.currentTarget.id == 3){//百科
    } else {//绘本

    }
  },
  // 播放音乐
  playMusic: function () {
    if (this.data.play == 0) {
      this.setData({
        play: 1
      })
    } else {
      this.setData({
        play: 0
      })
    }
  },

  /**
   * 下载音乐
   */
  downloadMusic: function () {
    if (this.data.down == 0) {
      this.setData({
        down: 1
      })
    } else if (this.data.down == 1) {
      this.setData({
        down: 2
      })
    } else {
      this.setData({
        down: 0
      })
    }
  }
})