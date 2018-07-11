
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
    menuHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          menuHeight: (res.windowHeight - 60)
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  }
})