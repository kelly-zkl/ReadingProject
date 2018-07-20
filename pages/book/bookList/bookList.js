
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
    this.setData({
      sliderLeft: ((app.globalData.device.windowWidth - 72) / this.data.tabs.length - sliderWidth) / 2,
      sliderOffset: (app.globalData.device.windowWidth - 72) / this.data.tabs.length * this.data.activeIndex+36,
      menuHeight: (app.globalData.device.windowHeight - 60),
      imgWidth: (app.globalData.device.windowWidth - 48)/2
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
    // this.getTags();
    this.getBooks();
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
  },
  //分类标签
  getTags: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "item/all",
      params: {},
      msg: "加载中...",
      success: res => {

        this.setData({
          tags: res.data
        });
      }
    }, false);
  },
  //绘本列表
  getBooks: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "book/query",
      params: {},
      msg: "加载中...",
      success: res => {

        this.setData({
          books: res.data.content
        });
      }
    }, false);
  },
})