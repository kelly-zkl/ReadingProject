
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'2018-8',
    star:0
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
    this.getStarNum();
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
  getStarNum:function(){
    http.postRequest({
      baseType:2,
      url: "childBook/finishToday",
      params: {childId: app.globalData.userInfo.childId},
      msg: "加载中...",
      success: res => {
        this.setData({
          star: res.data.finish
        });
      }
    }, false);
  }
})