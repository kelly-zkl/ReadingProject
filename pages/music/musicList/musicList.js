
var http = require("../../../http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: [{ name: "全部", url: "../../../images/icon_all.png" }, { name: "学英语", url: "../../../images/icon_english.png" },
    { name: "听音乐", url: "../../../images/icon_music_tab.png" }, { name: "讲故事", url: "../../../images/icon_story.png" },
    { name: "诗词文学", url: "../../../images/icon_shici.png" }, { name: "百科", url: "../../../images/icon_baike.png" }],
    tabs: ["综合", "热门", "最新"],
    activeIndex: 0,
    tabIdx:0,
    showRightPopup:false,
    menuHeight:0,
    refresh: false,
    page: 1,
    size: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      menuHeight: (app.globalData.device.windowHeight - 60)
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      page: 1
    })
    this.getMusics();
  },
  /***/
  tabClick: function (e) {
    this.setData({
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
      url: '/pages/common/search/search?type=album'
    })
  },
  // 最上方的标签变化
  tabChange:function(e){
    this.setData({
      tabIdx: e.currentTarget.id
    })
  },
  // 右侧弹框
  toggleRightPopup:function(){
    this.setData({
      showRightPopup: !this.data.showRightPopup
    });
  },
  // 选择分类标签
  changeTag:function(e){
    var idx = e.currentTarget.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      typeIdx: idx,
      tagIdx: index
    })
  },
  //专辑列表
  getMusics: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "album/query",
      params: {page:that.data.page,size:that.data.size},
      msg: "加载中...",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (that.data.page <= 1) {
          that.setData({
            musics: res.data.content
          })
        } else {
          that.setData({
            musics: that.data.musics.concat(res.data.content)
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

    this.getMusics();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getMusics();
  }
})