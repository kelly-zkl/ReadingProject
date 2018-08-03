
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
    showRightPopup:false,
    refresh: false,
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activeIndex: options.type ? options.type : 0,
      itemId: options.itemId ? options.itemId:0
    })
    this.setData({
      sliderLeft: ((app.globalData.device.windowWidth - 72) / this.data.tabs.length - sliderWidth) / 2,
      sliderOffset: (app.globalData.device.windowWidth - 72) / this.data.tabs.length * this.data.activeIndex+36,
      menuHeight: (app.globalData.device.windowHeight - 60),
      imgWidth: (app.globalData.device.windowWidth - 48)/2
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      page: 1
    })
    if (this.data.activeIndex == 0) {//全部
      this.setData({
        param: {
          page: this.data.page, size: this.data.size, sortProps:["playCount"]}
      })
    } else if (this.data.activeIndex == 1) {//最新
      this.setData({
        param: { page: this.data.page, size: this.data.size}
      })
    } else if (this.data.activeIndex == 2) {//精选
      this.setData({
        param: { page: this.data.page, size: this.data.size, featured:1}
      })
    } else if (this.data.activeIndex == 3) {//热销
      this.setData({
        param: { page: this.data.page, size: this.data.size,hotSell:1}
      })
    }
    this.getTags();
    this.getBooks();
  },
  /***/
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      page: 1
    });
    if (e.currentTarget.id == 0) {//全部
      this.setData({
        param: { page: this.data.page, size: this.data.size, sortProps: ["playCount"]}
      })
    } else if (e.currentTarget.id == 1) {//最新
      this.setData({
        param: { page: this.data.page, size: this.data.size}
      })
    } else if (e.currentTarget.id == 2) {//精选
      this.setData({
        param: { page: this.data.page, size: this.data.size, featured: 1}
      })
    } else if (e.currentTarget.id == 3) {//热销
      this.setData({
        param: { page: this.data.page, size: this.data.size, hotSell: 1}
      })
    }
    this.getBooks();
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
    var selected = this.data.tags[idx].childItem[index].selected;
    var tags = this.data.tags;
    tags[idx].childItem[index].selected = !selected;

    this.setData({
      tags: tags
    })
    this.getBooks();
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
        (res.data || []).map(function (item) {
          (item.childItem || []).map(function (tag) {
            if (that.data.itemId != 0 && that.data.itemId == tag.itemId) {
              tag.selected = true
            }else{
              tag.selected = false
            }
          })
        });
        that.setData({
          tags: res.data
        });
        that.getBooks();
      }
    }, false);
  },
  //标签重置
  resetTag:function(){
    var tags = this.data.tags;
    (tags || []).map(function (item) {
      (item.childItem || []).map(function (tag) {
        tag.selected = false
      })
    });
    this.setData({
      tags: tags,
      showRightPopup:false,
    })
    this.getBooks();
  },
  //确认筛选
  confirmTag:function(){
    this.setData({
      showRightPopup: false
    })
    this.getBooks();
  },
  //绘本列表
  getBooks: function () {
    var that = this;
    var tags = [];
    (this.data.tags || []).map(function (item) {
      (item.childItem || []).map(function (tag) {
        if (tag.selected){
          tags.push(tag.itemId)
        }
      })
    });
    if (tags.length>0){
      that.data.param['item'] = tags
    }else{
      delete that.data.param['item'];
    }
    http.postRequest({
      baseType: 2,
      url: "book/query",
      params: that.data.param,
      msg: "加载中...",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (that.data.page <= 1) {
          that.setData({
            books: res.data.content
          })
        } else {
          that.setData({
            books: that.data.books.concat(res.data.content)
          })
        }
      }
    }, false);
  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.setData({
      refresh: true,
      page: 1
    });
    if (this.data.activeIndex == 0) {//全部
      this.setData({
        param: { page: this.data.page, size: this.data.size, sortProps: ["playCount"]}
      })
    } else if (this.data.activeIndex == 1) {//最新
      this.setData({
        param: { page: this.data.page, size: this.data.size}
      })
    } else if (this.data.activeIndex == 2) {//精选
      this.setData({
        param: { page: this.data.page, size: this.data.size, featured: 1}
      })
    } else if (this.data.activeIndex == 3) {//热销
      this.setData({
        param: { page: this.data.page, size: this.data.size, hotSell: 1}
      })
    }
    this.getBooks();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    if (this.data.activeIndex == 0) {//全部
      this.setData({
        param: { page: this.data.page, size: this.data.size,sortProps: ["playCount"]}
      })
    } else if (this.data.activeIndex == 1) {//最新
      this.setData({
        param: { page: this.data.page, size: this.data.size}
      })
    } else if (this.data.activeIndex == 2) {//精选
      this.setData({
        param: { page: this.data.page, size: this.data.size, featured: 1}
      })
    } else if (this.data.activeIndex == 3) {//热销
      this.setData({
        param: { page: this.data.page, size: this.data.size, hotSell: 1}
      })
    }
    this.getBooks();
  }
})