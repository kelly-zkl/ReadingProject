
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
    tabs: ["0-2岁", "3-6岁", "7-10岁", "11-14岁", "15岁以上"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    rtabs: ["今日榜单", "本周榜单", "本月榜单"],
    ractiveIndex: 0,
    rsliderOffset: 0,
    rsliderLeft: 0,
    showLeftPopup:false,
    tags: [{ name: "全部", url: "../../../images/icon_all.png" }, { name: "精选", url: "../../../images/icon_jing.png" },
      { name: "热门", url: "../../../images/icon_hot.png" }, { name: "最新", url: "../../../images/icon_new.png" }]
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
  // 跳转搜索页面
  gotoSearch: function () {
    wx.navigateTo({
      url: '/pages/common/search/search?type=book'
    })
  },
  //扫一扫
  scan: function (e) {
    wx.scanCode({
      scanType: ['qrCode'],
      success: (res) => {
        console.log(res);
        wx.showToast({ title: '扫描成功', icon: 'info', duration: 1500 })
        if (res.result && res.result.indexOf('/pages/') == 0) {
          wx.navigateTo({ url: res.result })
        }
      },
      fail: (res) => {
        console.log(res);
        wx.showToast({ title: '扫描失败', icon: 'info', duration: 1500 })
      }
    })
  },
  // 左侧弹框
  toggleLeftPopup: function () {
    this.setData({
      showLeftPopup: !this.data.showLeftPopup
    });
  },
  // 选择分类标签
  changeTag: function (e) {
    var idx = e.currentTarget.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      typeIdx: idx,
      tagIdx: index,
      showLeftPopup:false
    })
    this.gotoList();
  }
})