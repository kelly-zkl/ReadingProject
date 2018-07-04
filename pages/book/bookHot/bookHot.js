
var sliderWidth = 64; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    inputShowed: false,
    inputVal: "",
    tabs: ["0-2岁", "3-6岁", "7-10岁", "11-14岁", "15岁以上"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    rtabs: ["今日榜单", "本周榜单", "本月榜单"],
    ractiveIndex: 0,
    rsliderOffset: 0,
    rsliderLeft: 0,
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
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          rsliderLeft: (res.windowWidth / that.data.rtabs.length - sliderWidth) / 2,
          rsliderOffset: res.windowWidth / that.data.rtabs.length * that.data.ractiveIndex
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  /**年龄推荐*/
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {//英语
    } else if (e.currentTarget.id == 1) {//音乐
    } else if (e.currentTarget.id == 2) {//故事
    } else if (e.currentTarget.id == 3) {//诗词文学
    } else {//百科全说

    }
  },
  /**热播榜*/
  rtabClick: function (e) {
    this.setData({
      rsliderOffset: e.currentTarget.offsetLeft,
      ractiveIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {//英语
    } else if (e.currentTarget.id == 1) {//音乐
    } else if (e.currentTarget.id == 2) {//故事
    } else if (e.currentTarget.id == 3) {//诗词文学
    } else {//百科全说

    }
  },
/**跳转到绘本列表*/
  gotoList:function(){
    wx.navigateTo({
      url: '/pages/book/bookList/bookList'
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      show: false
    });
    // this.getCourts();
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      show: false
    });
    // this.getCourts();
  },
  inputTyping: function (e) {
    console.log(e.detail.value);
    this.setData({
      inputVal: e.detail.value,
      show: false
    });
    if (e.detail.value.length > 0) {
       // this.getCourts();
    }
  }
})