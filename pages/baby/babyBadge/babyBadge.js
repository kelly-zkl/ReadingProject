
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'2018-8',
    start:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 选择月份
   */
  bindDateChange:function(e){
    this.setData({
      date:e.detail.value
    })
  },
  // 星星数量变化
  changeStart:function(){
    if (this.data.start == 0){
      this.setData({
        start:1
      })
    } else if (this.data.start == 1) {
      this.setData({
        start: 2
      })
    } else if (this.data.start == 2) {
      this.setData({
        start: 3
      })
    } else if (this.data.start == 3) {
      this.setData({
        start: 0
      })
    }
  }
})