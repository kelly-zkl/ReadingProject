
var sliderWidth = 64; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部", "最新", "精选", "热销"],
    activeIndex: 0,
    sliderOffset: 36,
    sliderLeft: 0,
    menuHeight:0,
    showRightPopup:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: ((res.windowWidth-72 )/ that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: (res.windowWidth - 72) / that.data.tabs.length * that.data.activeIndex+36,
          menuHeight: (res.windowHeight - 60)
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
  /***/
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
  // 跳转搜索页面
  gotoSearch: function () {
    wx.navigateTo({
      url: '/pages/common/search/search?type=book'
    })
  },
  // 右侧弹框
  toggleRightPopup: function () {
    this.setData({
      showRightPopup: !this.data.showRightPopup
    });
  },
  // 选择分类标签
  changeTag: function (e) {
    var idx = e.currentTarget.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      typeIdx: idx,
      tagIdx: index
    })
  }
})