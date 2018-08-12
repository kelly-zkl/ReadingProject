
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

const innerAudioContext = wx.createInnerAudioContext();
const recorderManager = wx.getRecorderManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img.zcool.cn/community/01d881579dc3620000018c1b430c4b.JPG@3000w_1l_2o_100sh.jpg',
      'http://img.zcool.cn/community/010f87596f13e6a8012193a363df45.jpg@1280w_1l_2o_100sh.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    showPopup: false,
    lanaugae:'中文原声',
    lanIdx:2,
    currentIdx:0,
    currentStr:'',
    pause:0,
    bookDetail: {pageList:[]},
    j: 1,//帧动画初始图片
    isSpeaking: false,//是否正在说话
    tempFilePath:'',
    isAudio:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scrowHeight: app.globalData.device.windowHeight - 145,
      currentStr: (this.data.currentIdx) + "/" + 0,
      bookId: options.id,
      isBind: app.globalData.userInfo.isBind,
      isRecords: options.type ? options.type:false
    });

    innerAudioContext.onTimeUpdate((res) => {
      console.log("缓冲",res)
      wx.showToast({ title: "缓冲中...", icon: 'info', duration: 1500 })
    })
    innerAudioContext.onEnded((res) => {
      this.setData({
        pause: 0
      })
    })

    // if (this.data.isRecords){
    //   this.setData({
    //     lanaugae: '家长录制',
    //     lanIdx: 3
    //   });
    // }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBookDetail();
    this.getBookPage();
    this.getCollect();
  },
  // 滑动图片
  changeImg:function(e){
    console.log(e);
    this.setData({
      currentIdx: e.detail.current,
      currentStr: (e.detail.current + 1) + "/" + this.data.bookDetail.pageList.length
    });
  },
  // 上一页
  preImg:function(){
    var index = this.data.currentIdx;
    if (index > 0){
      index = index-1;
    }
    this.setData({
      currentIdx: index,
      currentStr: (index + 1) + "/" + this.data.bookDetail.pageList.length
    });
  },
  // 下一页
  nextImg:function(){
    var index = this.data.currentIdx;
    if (index < this.data.bookDetail.pageList.length-1) {
      index = index + 1;
    }
    this.setData({
      currentIdx: index,
      currentStr: (index + 1) + "/" + this.data.bookDetail.pageList.length
    });
  },

  imageLoad: function (e) {
    var res = wx.getSystemInfoSync();
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;
    this.setData({
      bannerHeight: res.windowWidth / ratio
    })
  },
  //设置身份
  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  popuChange: function (e) {
    var that = this;
    var str = '英文原声';
    var id = e.currentTarget.id;
    if (id == 1) {//英文原声
      str = '英文原声';
      this.setData({
        lanaugae: str,
        lanIdx: id
      });
    } else if (id == 2) {//中文原声
      str = '中文原声';
      this.setData({
        lanaugae: str,
        lanIdx: id
      });
    } else if (id == 3) {//家长录制
      str = '家长录制';
      this.setData({
        lanaugae: str,
        lanIdx: id
      });
    }
    this.setData({
      showPopup: false
    });
  },
  // 收藏
  collect:function(){
    if (!!this.data.bfId){
      this.cancelCollect();
    }else{
      this.collectBook();
    }
  },
  // 读书暂停/开始
  readBook: function () {
    var url ="";
    if (this.data.lanIdx==1){//英文
      if (!this.data.bookDetail.pageList[this.data.currentIdx].audioEn) {
        wx.showToast({ title: "英文音频不存在", icon: 'none', duration: 1500});
        return;
      } else if (this.data.bookDetail.pageList[this.data.currentIdx].audioEn.length == 0) {
        wx.showToast({ title: "英文音频不存在", icon: 'none', duration: 1500 });
        return;
      }
      url = this.data.bookDetail.pageList[this.data.currentIdx].audioEn[0] 
    } else if (this.data.lanIdx == 2){//中文
      if (!this.data.bookDetail.pageList[this.data.currentIdx].audioZh) {
        wx.showToast({ title: "中文音频不存在", icon: 'none', duration: 1500});
        return;
      } else if (this.data.bookDetail.pageList[this.data.currentIdx].audioZh.length==0){
        wx.showToast({ title: "中文音频不存在", icon: 'none', duration: 1500 });
        return;
      }
      url = this.data.bookDetail.pageList[this.data.currentIdx].audioZh[0]
    } else if (this.data.lanIdx == 3){//家长录制
      let audo = "";
      (this.data.audios).map((item) => {
        if (item.bookPageId == this.data.bookDetail.pageList[this.data.currentIdx].bookPageId) {
          audo = item.audioUrlOther[0]
        }
      })
      if (audo.length == 0) {
        wx.showToast({ title: "家长录制音频不存在", icon: 'none', duration: 1500});
        return;
      }
      url = audo
    }
    
    innerAudioContext.src = url

    if (this.data.pause == 0) {//播放（暂停状态）
      innerAudioContext.play();
      this.setData({
        pause: 1
      })
    } else {//暂停（播放状态）
      innerAudioContext.pause();
      this.setData({
        pause: 0
      })
    }
    console.log(url);
    console.log("时长：", innerAudioContext.duration);
    console.log("当前时间：", innerAudioContext.currentTime);
    console.log("缓冲：", innerAudioContext.buffered);
  },
  //绘本详情
  getBookDetail: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "book/detail/" + that.data.bookId,
      params: {},
      msg: "加载中...",
      success: res => {
        wx.setNavigationBarTitle({title: res.data.bookName})
        this.setData({
          bookDetail: res.data,
          currentIdx: 0,
          currentStr: res.data.pageList?(1 + "/" + res.data.pageList.length):"0/0",
        });
      }
    }, false);
  },
  //获取自定义音频文件
  getBookPage: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "bookPage/query/customizeAudio",
      params: {bookId: that.data.bookId, userId: app.globalData.userInfo.userId,page:1,size:9999},
      msg: "加载中...",
      success: res => {
        this.setData({
          audios: res.data.content
        });
      }
    }, false);
  },
  //收藏绘本
  collectBook:function(){
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "favo/book/create",
      params: [{bookId: that.data.bookId,userId:app.globalData.userInfo.userId}],
      msg: "加载中...",
      success: res => {
        wx.showToast({title: '收藏成功', icon: 'info', duration: 1500});
        that.getCollect();
      }
    }, false);
  },
  //取消收藏绘本
  cancelCollect:function(){
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "favo/book/delete",
      params: [that.data.bfId],
      msg: "加载中...",
      success: res => {
        wx.showToast({title: '已取消收藏', icon: 'info', duration: 1500});
        that.getCollect();
      }
    }, false);
  },

  //查询是否收藏
  getCollect:function(){
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "favo/book/detail",
      params: {bookId: that.data.bookId, userId:app.globalData.userInfo.userId},
      msg: "加载中...",
      success: res => {
        that.setData({
          bfId: res.data
        })
      }
    }, false);
  },

  //添加到宝宝书单
  addToBaby:function(){
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "childBook/create",
      params: {bookId:that.data.bookId, userId:app.globalData.userInfo.userId,childId: app.globalData.userInfo.childId},
      msg: "操作中...",
      success: res => {
        wx.showToast({ title: '已添加到宝宝书单', icon: 'info', duration: 1500 });
      }
    }, true);
  },
  //推送到设备
  pushToDevice:function(){
    // var that = this;
    // http.postRequest({
    //   baseType: 2,
    //   url: "childBook/create",
    //   params: {bookId: that.data.bookId, userId: app.globalData.userInfo.userId, childId: app.globalData.userInfo.childId },
    //   msg: "操作中...",
    //   success: res => {
    //     wx.showToast({ title: '推送成功', icon: 'info', duration: 1500 });
    //   }
    // }, true);
  },

  //页面卸载是销毁播放器
  onUnload:function(){
    innerAudioContext.destroy();
  },
  //分享页面
  onShareAppMessage: function (e) {
    var text = '/pages/login/login?bookId=' + this.data.bookId;
    console.log(text);

    return {
      title: '小精灵',
      desc: this.data.bookDetail.bookName,
      path: text,
      success: function (res) {// 转发成功
        wx.showToast({title: '分享成功', icon: 'info', duration: 1500})
      },
      fail: function (res) {// 转发失败
        wx.showToast({title: '分享失败', icon: 'info', duration: 1500})
      }
    }
  },
  //开始录音
  startAudio:function(){
    this.setData({
      isAudio: true
    })
  },
  //手指按下
  touchdown: function () {
    console.log("手指按下了...")
    var _this = this;
    speaking.call(this);
    this.setData({
      isSpeaking: true
    })
    //开始录音
    this.startRecord();
  },
  //手指抬起
  touchup: function () {
    console.log("手指抬起了...")
    clearInterval(this.timer)
    this.setData({
      isSpeaking: false,
      j: 1
    })
    this.stopRecord();
  },

  //开始录音
  startRecord: function () {
    const option = {
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      // frameSize: 500,
      audioSource: 'auto'
    }
    recorderManager.start(option);

    recorderManager.onStart(() => {
      console.log('recorder start')
    })
    recorderManager.onError((res) => {
      console.log('recorder onError', res)
      wx.showToast({ title: '请按住录音，松开结束', icon: 'none', duration: 1500})
    })
  },
  //结束录音
  stopRecord: function () {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      this.setData({
        tempFilePath: res.tempFilePath
      });
    })
  },
  //重新录音
  resetVideo:function(){
    that.setData({
      tempFilePath: ''
    });
  },
  //试听录音
  testVideo: function () {
    if (this.data.tempFilePath.length == 0) {
      wx.showToast({ title: '请先录制音频', icon: 'none', duration: 1500 });
      return;
    }
    wx.showToast({ title: this.data.tempFilePath, icon: 'none', duration: 1500 });
    innerAudioContext.src = this.data.tempFilePath
    innerAudioContext.play();
  },
  /**上传录制mp3文件*/
  uploadVideo: function () {
    var that = this;
    if (this.data.tempFilePath.length==0){
      wx.showToast({ title: '请先录制音频', icon: 'none', duration: 1500 });
      return;
    }
    http.uploadFile(that.data.tempFilePath, {
      success: function (res) {
        that.setData({
          video: res.data
        });
        that.confirmRecord();
      }
    })
  },
  //上传音频文件地址到后台
  confirmRecord: function () {
    var that = this;
    http.postRequest({
      baseType: 2,
      url: "bookPage/create/customizeAudio",
      params: {
        bookId: that.data.bookId, userId: app.globalData.userInfo.userId, audioUrlOther: [that.data.video],
        bookPageId: that.data.bookDetail.pageList[that.data.currentIdx].bookPageId},
      msg: "操作中...",
      success: res => {
        wx.showToast({title: '上传成功', icon: 'info', duration: 1500});
        this.setData({
          isAudio: false
        })
        innerAudioContext.stop();
        this.getBookDetail();
        this.getBookPage();
        this.getCollect();
      }
    }, true);
  }
})

//麦克风帧动画
function speaking() {
  var _this = this;
  //话筒帧动画
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 5;
    console.log(i);
    _this.setData({
      j: i
    })
  }, 200);
}