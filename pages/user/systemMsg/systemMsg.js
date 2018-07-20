
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    refresh: false,
    page:1,
    size:10
  },
  onLoad: function (e) {

  },

  onShow:function(){
    this.setData({
      page: 1
    });
    this.getMsgs();
  },
  
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.msgs.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      msgs: this.data.msgs
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.msgs.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      msgs: that.data.msgs
    })
  },
  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var that = this;
    // this.data.msgs.splice(e.currentTarget.dataset.index, 1)
    // this.setData({
    //   msgs: this.data.msgs
    // })
    wx.showModal({
      title: '提示',
      content: '确认删除该消息？',
      confirmText: '删除',
      confirmColor: '#00d2ff',
      success: function (res) {
        if (res.confirm) {
          
          http.postRequest({
            baseType: 0,
            url: "user/child/master/select",
            params: {uid:app.globalData.userInfo.uid,messageId:e.currentTarget.id},
            msg: "操作中...",
            success: res => {
              wx.showToast({ title: '删除成功', icon: 'none', duration: 1500 })
              that.setData({
                page: 1
              });
              that.getMsgs();
            }
          }, true);
        }
      }
    })
  },

  /**获取通知列表 */
  getMsgs:function(){
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "message/query/notify",
      params: { uid: app.globalData.userInfo.uid, page: that.data.page,size:that.data.size},
      msg: "加载中...",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
        (res.data.content || []).map(function (item) {
          item.isTouchMove = false
        })
        if (that.data.page <= 1) {
          that.setData({
            msgs: res.data.content
          })
        } else {
          that.setData({
            msgs: that.data.msgs.concat(res.data.content)
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

    this.getMsgs();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getMsgs();
  }
})