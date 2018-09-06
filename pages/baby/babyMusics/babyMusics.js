
var sliderWidth = 64; // 需要设置slider的宽度，用于计算中间位置
var http = require("../../../http.js");
const app = getApp();

const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["音乐", "故事"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    down: 0,
    play: 0,
    refresh: false,
    page: 1,
    size: 10,
    startX: 0, //开始坐标
    startY: 0,
    idx: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sliderLeft: (app.globalData.device.windowWidth / this.data.tabs.length - sliderWidth) / 2,
      sliderOffset: app.globalData.device.windowWidth / this.data.tabs.length * this.data.activeIndex,
      isBind: app.globalData.userInfo.isBind
    });

    innerAudioContext.onEnded((res) => {
      this.setData({
        pause: 0
      })
    });
    innerAudioContext.onWaiting((res) => {
      console.log("onWaiting", res);
    });
    innerAudioContext.onCanplay((res) => {
      console.log("onCanplay", res);
      wx.hideLoading();
    });
    innerAudioContext.onPlay((res) => {
      console.log("onPlay", res);
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
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.getMusics();
  },
  //暂停/播放音乐
  pauseStop: function (e) {
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
  playMusic: function (e) {
    this.setData({
      play: 1
    })
    innerAudioContext.src = this.data.musics[this.data.idx].musicUrl;
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
  preNextMusic: function (e) {
    var pre = e.currentTarget.id;
    var total = this.data.musics.length;
    var idx = this.data.idx;
    console.log(pre);
    console.log(total);
    if (pre=='true') {//上一首
      if (idx > 0) {
        idx = idx - 1;
      }
    } else {//下一首
      if (idx < total - 1) {
        idx = idx + 1;
      }
    }
    this.setData({
      idx: idx
    })
    console.log(idx);
    this.playMusic();
  },
  //播放下一首
  musicPlay: function (e) {
    var idx = e.currentTarget.id;
    this.setData({
      idx: idx
    })
    console.log(idx);
    this.playMusic();
  },
  //宝宝歌单
  getMusics: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "childMusicFavo/query",
      params: { page: that.data.page, size: that.data.size, childId: app.globalData.userInfo.childId },//type: (parseInt(that.data.activeIndex))+1
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

  pushDevice: function (e) {
    this.pushToDevice(e.currentTarget.id);
  },
  pushAll: function () {
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
    //   params: { musicId: id, userId: app.globalData.userInfo.userId, childId: app.globalData.userInfo.childId },
    //   msg: "操作中...",
    //   success: res => {
    //     wx.showToast({ title: '推送成功', icon: 'info', duration: 1500 });
    //   }
    // }, true);
  },

  /**
   * 下载音乐
   */
  downloadMusic: function () {
    if (this.data.down == 0) {
      this.setData({
        down: 1
      })
    } else if (this.data.down == 1) {
      this.setData({
        down: 2
      })
    } else {
      this.setData({
        down: 0
      })
    }
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.musics.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      musics: this.data.musics
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
    that.data.musics.forEach(function (v, i) {
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
      musics: that.data.musics
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
      content: '确认从宝宝歌单移除该音乐？',
      confirmText: '确认移除',
      confirmColor: '#00d2ff',
      success: function (res) {
        if (res.confirm) {
          http.postRequest({
            baseType: 2,
            url: "childMusicFavo/delete",
            params: [e.currentTarget.id],
            msg: "操作中...",
            success: res => {
              wx.showToast({ title: '移除成功', icon: 'none', duration: 1500 })
              that.setData({
                page: 1
              });
              that.getMusics();
            }
          }, true);
        }
      }
    })
  },

  onUnload: function () {
    innerAudioContext.destroy();
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