
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgWidth: (app.globalData.device.windowWidth - 40) / 3
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  goBack: function () {
    wx.navigateBack();
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    this.getBooks();
  },
  inputTyping: function (e) {
    console.log(e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
    if (e.detail.value.length > 0) {
      this.getBooks();
    }
  },
  //搜索绘本
  getBooks:function(){
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "book/query",
      params: { page: 1, size: 9999, bookName: this.data.inputVal},
      msg: "加载中...",
      success: res => {
        this.setData({
          books: res.data.content
        });
      }
    }, false);
  }
})