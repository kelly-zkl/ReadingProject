
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUpdate:true,
    showPopu:false,
    upNum:0
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

  // 版本升级
  updateVersion:function(){
    if (this.data.isUpdate){
      this.togglePopu();
    }
    this.setData({
      isUpdate: !this.data.isUpdate
    })
  },
  // 升级弹框
  togglePopu:function(){
    this.setData({
      showPopu: !this.data.showPopu
    })
  },
  // 开始升级
  startUpdate:function(){
    var that = this;
    that.setData({
      showPopu: false
    });
    wx.showLoading({
      title: this.data.upNum+'%',
      mask:true
    })
    var num = this.data.upNum;
    var i = setInterval(function () {
      if (num < 100){
        num = num + 10;
        that.setData({
          upNum: num
        });
        wx.hideLoading();
        wx.showLoading({
          title: that.data.upNum + '%',
          mask: true
        })
      }else{
        clearInterval(i);
        wx.hideLoading();
        wx.showToast({
          title: '升级成功',
          icon: 'success',
          duration: 2000
        })
      }
    }, 1000)
  },
})