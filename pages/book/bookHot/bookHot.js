
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
    tags: [{name: "全部", url: "../../../images/icon_all.png"}, { name: "最新", url: "../../../images/icon_new.png"},
     {name: "精选", url: "../../../images/icon_jing.png"}, {name: "热销", url: "../../../images/icon_hot.png"}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sliderLeft: (app.globalData.device.windowWidth / this.data.tabs.length - sliderWidth) / 2,
      sliderOffset: app.globalData.device.windowWidth / this.data.tabs.length * this.data.activeIndex,
      rsliderLeft: (app.globalData.device.windowWidth / this.data.rtabs.length - sliderWidth) / 2,
      rsliderOffset: app.globalData.device.windowWidth / this.data.rtabs.length * this.data.ractiveIndex,
      imgWidth: (app.globalData.device.windowWidth - 40) / 3
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
    this.getTags();
    
    if (this.data.ractiveIndex == 0) {//今日榜单
      this.getBooksToday();
    } else if (this.data.ractiveIndex == 1) {//本周榜单
      this.getBooksWeek();
    } else if (this.data.ractiveIndex == 2) {//本月榜单
      this.getBooksMonth();
    }

    if (this.data.activeIndex == 0) {//0-2岁
      this.setData({
        itemId: "20"
      })
    } else if (this.data.activeIndex == 1) {//3-6岁
      this.setData({
        itemId: "21"
      })
    } else if (this.data.activeIndex == 2) {//7-10岁
      this.setData({
        itemId: "22"
      })
    } else if (this.data.activeIndex == 3) {//11-14岁
      this.setData({
        itemId: "23"
      })
    } else {//15岁以上
      this.setData({
        itemId: "24"
      })
    }
    this.getBooksYear();//年龄推荐
  },
  /**年龄推荐*/
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {//0-2岁
      this.setData({
        itemId: "20"
      })
    } else if (e.currentTarget.id == 1) {//3-6岁
      this.setData({
        itemId: "21"
      })
    } else if (e.currentTarget.id == 2) {//7-10岁
      this.setData({
        itemId: "22"
      })
    } else if (e.currentTarget.id == 3) {//11-14岁
      this.setData({
        itemId: "23"
      })
    } else {//15岁以上
      this.setData({
        itemId: "24"
      })
    }
    this.getBooksYear();//年龄推荐
  },
  /**热播榜*/
  rtabClick: function (e) {
    this.setData({
      rsliderOffset: e.currentTarget.offsetLeft,
      ractiveIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {//今日榜单
      this.getBooksToday();
    } else if (e.currentTarget.id == 1) {//本周榜单
      this.getBooksWeek();
    } else if (e.currentTarget.id == 2) {//本月榜单
      this.getBooksMonth();
    }
  },
/**跳转到绘本列表*/
  gotoList:function(e){
    this.setData({
      showLeftPopup:false
    })
    wx.navigateTo({
      url: '/pages/book/bookList/bookList?type=' + e.currentTarget.id
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
    wx.navigateTo({
      url: '/pages/book/bookList/bookList?itemId=' + this.data.tabTags[this.data.typeIdx].childItem[this.data.tagIdx].itemId
    })
  },
  //年龄接口
  getTags: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "item/all",
      params: {},
      msg: "加载中...",
      success: res => {

        this.setData({
          tabTags: res.data
        });
      }
    }, false);
  },
  //年龄推荐
  getBooksYear: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "book/query",
      params: {page: 1, size: 6,item:[this.data.itemId]},
      msg: "加载中...",
      success: res => {
        this.setData({
          recommendBooks: res.data.content
        });
      }
    }, false);
  },
  //热播榜单--今日榜单
  getBooksToday: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "book/stat/today",
      params: {page:1,size:6},
      msg: "加载中...",
      success: res => {
        this.setData({
          hotBooks: res.data.content
        });
      }
    }, false);
  },
  //热播榜单--本周榜单
  getBooksWeek: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "book/stat/week",
      params: { page: 1, size: 6 },
      msg: "加载中...",
      success: res => {
        this.setData({
          hotBooks: res.data.content
        });
      }
    }, false);
  },
  //热播榜单--本月榜单
  getBooksMonth: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "book/stat/month",
      params: { page: 1, size: 6 },
      msg: "加载中...",
      success: res => {
        this.setData({
          hotBooks: res.data.content
        });
      }
    }, false);
  }
})