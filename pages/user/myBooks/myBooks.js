
var sliderWidth = 64; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgWidth: (app.globalData.device.windowWidth - 48) / 2
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
    this.getBooks();
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