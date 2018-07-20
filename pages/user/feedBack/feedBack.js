
var sliderWidth = 64; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["投诉建议", "我的投诉"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    choose:0,
    refresh: false,
    showPopup: false,
    page: 1,
    size: 10,
    tags: ["小精灵联网失败", "设备损坏", "小精灵不能升级", "无法发送悄悄话",
      "无法绑定小精灵","语音指令", "无法阅读书本", "建议增加绘本","其它"],
    title:"小精灵联网失败",
    content:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sliderLeft: (app.globalData.device.windowWidth / this.data.tabs.length - sliderWidth) / 2,
      sliderOffset: app.globalData.device.windowWidth / this.data.tabs.length * this.data.activeIndex,
      tagWidth: (app.globalData.device.windowWidth - 42) / 3
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {//投诉建议
    } else if (e.currentTarget.id == 1) {//我的投诉
      this.setData({
        page: 1
      });
      this.getFeedbacks();
    }
  },
  /**选择分类 */
  chooseTag:function(e){
    this.setData({
      choose: e.currentTarget.id,
      title: this.data.tags[e.currentTarget.id]
    })
  },
  /**建议内容*/
  bindChange: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  previewImage: function (e) {
    var urls = [e.currentTarget.id]
    wx.previewImage({
      current: 0, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  //选择上传图片
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  popuChange: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    if (id == 1) {
      that.setData({
        picType: ["album", "camera"],
        showPopup: false
      });
      that.chooseImage();
    } else if (id == 2) {
      that.setData({
        picType: ["camera"],
        showPopup: false
      });
      that.chooseImage();
    } else {
      that.setData({
        showPopup: false
      });
    }
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: that.data.picType, // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;

        for (var i in tempFilePaths) {
          http.uploadFile(tempFilePaths[i], {
            success: function (res) {
              that.setData({
                thumbUrl: res.data
              });
            }
          })
        }
      }
    })
  },
  /**提交我的j建议*/
  sendFeedBack:function(){
    var that = this;
    if (that.data.content.length == 0 || that.data.title.length == 0) {
      wx.showToast({ title: '请选择问题分类和详细描述', icon: 'none', duration: 1500 });
      return;
    }
    var param = {uid:app.globalData.userInfo.uid,title:that.data.title,content:that.data.content};
    if (that.data.thumbUrl){
      param = {uid:app.globalData.userInfo.uid,title:that.data.title,content:that.data.content,attachType:"image",attachUrl:that.data.thumbUrl};
    }

    http.postRequest({
      baseType: 0,
      url: "message/complaint",
      params: param,
      msg: "操作中...",
      success: res => {
        wx.showToast({ title: '提交成功成功', icon: 'none', duration:1500})
      }
    }, true);
  },
  /**获取我的投诉列表*/
  getFeedbacks:function(){
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "message/complaint/mine",
      params: {uid:app.globalData.userInfo.uid,senderId: app.globalData.userInfo.uid,page: that.data.page,size: that.data.size},
      msg: "加载中...",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        if (that.data.page <= 1) {
          that.setData({
            feedBacks: res.data.content
          })
        } else {
          that.setData({
            feedBacks: that.data.feedBacks.concat(res.data.content)
          })
        }
      }
    }, false);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.activeIndex == 1){
      wx.showNavigationBarLoading();
      this.setData({
        refresh: true,
        page: 1
      });

      this.getFeedbacks();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.activeIndex == 1) {
      this.setData({
        page: this.data.page + 1
      });
      this.getFeedbacks();
    }
  }
})