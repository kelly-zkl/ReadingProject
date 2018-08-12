
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    down:0,
    play:0,
    refresh: false,
    page: 1,
    size: 10,
    idx:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      albumId: options.id,
      isBind: app.globalData.userInfo.isBind
    })

    innerAudioContext.onEnded((res) => {
      this.setData({
        pause: 0
      })
    });
    innerAudioContext.onWaiting((res) => {
      console.log("onWaiting", res);
      wx.showLoading({ title: "加载中..." })
    });
    innerAudioContext.onCanplay((res) => {
      console.log("onCanplay", res);
      wx.hideLoading();
    });
    innerAudioContext.onPlay((res) => {
      console.log("onPlay",res);
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
    this.getAlbumDetail();
    this.getCollect();
  },
  //专辑详情
  getAlbumDetail:function(){
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "album/detail/" + that.data.albumId,
      params: {},
      msg: "加载中...",
      success: res => {
        that.setData({
          album:res.data
        })
      }
    }, false);
  },
  //获取音乐列表
  getMusics:function(){
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "music/query",
      params: {albumList: [that.data.albumId], page: that.data.page,size:that.data.size},
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
  //暂停/播放音乐
  pauseStop:function(e){
    if (this.data.play == 0) {//播放（暂停状态）
      this.setData({
        play: 1,
        idx: e.currentTarget.id
      })
      this.playMusic();
    } else {//暂停（播放状态）
      innerAudioContext.pause();
      this.setData({
        play: 0
      })
    }
  },
  // 播放音乐
  playMusic:function(e){
    this.setData({
      play: 1
    })
    innerAudioContext.src = this.data.musics[this.data.idx].url;
    innerAudioContext.startTime = 0;

    innerAudioContext.play();

    console.log(innerAudioContext.src);
    console.log("时长：", innerAudioContext.duration);
    console.log("缓冲：", innerAudioContext.buffered);
    // innerAudioContext.onTimeUpdate((res) => {
    //   console.log("当前时间：", innerAudioContext.currentTime);
    // })
  },
  //播放上/下一首
  preNextMusic:function(e){
    var pre = e.currentTarget.id;
    var total = this.data.musics.length;
    var idx = this.data.idx;
    if (pre){//上一首
      if (idx > 0) {
        idx = idx - 1;
      }
    }else{//下一首
      if (idx < total - 1) {
        idx = idx + 1;
      }
    }
    this.setData({
      idx: idx
    })
    this.playMusic();
  },
  //播放下一首
  musicPlay:function(e){
    var idx = e.currentTarget.id;
    this.setData({
      idx: idx
    })
    this.playMusic();
  },
  
  //添加到宝宝歌单
  addToBaby: function (id) {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "childMusic/create",
      params: {musicId: id, userId: app.globalData.userInfo.userId, childId: app.globalData.userInfo.childId},
      msg: "操作中...",
      success: res => {
        wx.showToast({title: '已添加到宝宝歌单', icon: 'info', duration: 1500});
      }
    }, true);
  },
  addBaby: function (e) {
    this.addToBaby(e.currentTarget.id);
  },
  pushDevice: function (e) {
    this.pushToDevice(e.currentTarget.id);
  },
  addAll:function(){
    if (this.data.musics.length > 0){
      for (var i in this.data.musics) {
        this.addToBaby(this.data.musics[i].musicId);
      }
    }
  },
  pushAll:function(){
    if (this.data.musics.length > 0) {
      for (var i in this.data.musics) {
        this.pushToDevice(this.data.musics[i].musicId);
      }
    }
  },
  //推送到设备
  pushToDevice: function (id) {
    // var that = this;
    // http.postRequest({
    //   baseType: 2,
    //   url: "childBook/create",
    //   params: {musicId: id, userId: app.globalData.userInfo.userId, childId: app.globalData.userInfo.childId},
    //   msg: "操作中...",
    //   success: res => {
    //     wx.showToast({title: '推送成功', icon: 'info', duration: 1500});
    //   }
    // }, true);
  },
  // 收藏
  collect: function () {
    if (this.data.afId) {
      this.cancelCollect();
    } else {
      this.collectMusic();
    }
  },
  //收藏专辑
  collectMusic: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "favo/album/create",
      params: [{albumId: that.data.albumId, userId: app.globalData.userInfo.userId}],
      msg: "加载中...",
      success: res => {
        wx.showToast({ title: '收藏成功', icon: 'info', duration: 1500 });
        that.getCollect();
      }
    }, false);
  },
  //取消收藏专辑
  cancelCollect: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "favo/album/delete",
      params: [that.data.afId],
      msg: "加载中...",
      success: res => {
        wx.showToast({ title: '已取消收藏', icon: 'info', duration: 1500 });
        that.getCollect();
      }
    }, false);
  },
  //查询是否收藏
  getCollect: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "favo/album/detail",
      params: { albumId: that.data.albumId, userId: app.globalData.userInfo.userId },
      msg: "加载中...",
      success: res => {
        that.setData({
          afId: res.data
        })
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
  },
  onUnload: function () {
    innerAudioContext.destroy();
  },
  //分享页面
  onShareAppMessage: function (e) {
    var text = '/pages/login/login?albumId=' + this.data.albumId;
    console.log(text);

    return {
      title: '小精灵',
      desc: this.data.album.name,
      path: text,
      success: function (res) {// 转发成功
        wx.showToast({ title: '分享成功', icon: 'info', duration: 1500 })
      },
      fail: function (res) {// 转发失败
        wx.showToast({ title: '分享失败', icon: 'info', duration: 1500 })
      }
    }
  }
})