
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
const app = getApp();

const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh: false,
    page: 1,
    size: 10,
    content:'',
    video:'',
    baby:{},
    userId:'',
    friendHeadUrl: '',
    textMessage: '',
    chatItems: [],
    scrollTopTimeStamp: 0,
    keyBoard:true,
    j: 1,//帧动画初始图片
    isSpeaking: false,//是否正在说话
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: app.globalData.userInfo.userId
    })
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      page: 1,
      baby: app.globalData.baby
    });
    this.getFamilyMembers();
    this.getChatList();
  },
  //切换语音/键盘
  changeVoice:function(){
    this.setData({
      keyBoard: !this.data.keyBoard
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
      j:1
    })
    this.stopRecord();
  },

  //开始录音
  startRecord:function(){
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
  },
  //结束录音
  stopRecord: function () {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      this.setData({
        tempFilePath: res
      });
      this.uploadVideo();
    })
  },
  //播放声音
  play: function (e) {
    var url = e.currentTarget.id;
    if (url != 1){
      innerAudioContext.autoplay = true
      innerAudioContext.src = url,
        innerAudioContext.onPlay(() => {
          console.log('开始播放')
        })
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
    }
  },

  bindKeyInput: function (e) {
    this.setData({
      content: e.detail.value
    });
  },
  /***/
  uploadVideo:function(){
    var that = this;
    http.uploadFile(that.data.tempFilePath.tempFilePath, {
      success: function (res) {
        that.setData({
          video: res.data
        });
        that.sendMsg();
      }
    })
  },
  /**跳转到成员管理页面*/
  gotoUserManager: function () {
    wx.navigateTo({
      url: '/pages/user/userManager/userManager?familyId=' + app.globalData.userInfo.familyId
    })
  },
  /**跳转到成员身份页面*/
  gotoUserId: function (e) {
    var userId = e.currentTarget.id;
    var admin = this.data.admin;
    if (admin || userId == app.globalData.userInfo.userId) {
      wx.navigateTo({
        url: '/pages/user/setUserId/setUserId?id=' + userId + "&familyId=" + app.globalData.userInfo.familyId
      })
    }
  },
  /**获取当前家庭组的成员*/
  getFamilyMembers: function () {
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "family/members",
      params: { uid: app.globalData.userInfo.uid, familyId: app.globalData.userInfo.familyId },
      msg: "加载中...",
      success: res => {
        var admin = false;
        (res.data || []).map(function (item) {
          if (item.user.userId == app.globalData.userInfo.userId){
            admin = item.admin
          }
        })
        that.setData({
          members: res.data,
          admin: admin
        })
      }
    }, false);
  },
  /**获取聊天记录*/
  getChatList: function () {
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "message/query",
      params: {
        uid: app.globalData.userInfo.uid, groupId: app.globalData.userInfo.familyId, receiveId: app.globalData.userInfo.childId,
        page: that.data.page, size: that.data.size
      },
      msg: "加载中...",
      success: res => {
        if (that.data.refresh) {
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }

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
  /**发送消息到设备端 附件类型:iamge;video*/
  sendMsg: function () {
    var that = this;

    var param = {};
    if (that.data.content.length > 0) {
      param = {
        uid: app.globalData.userInfo.uid, groupId: app.globalData.userInfo.familyId, receiveId: app.globalData.userInfo.childId,
        receiveType: "child", content: that.data.content };
    } else if (that.data.video.length > 0){
      param = {
        uid: app.globalData.userInfo.uid, groupId: app.globalData.userInfo.familyId, receiveId: app.globalData.userInfo.childId,
        receiveType: "child", attachType: "video", attachUrl: that.data.video };
    }else{
      wx.showToast({ title: '发送内容不能为空', icon: 'none', duration: 1500 });
      return;
    }

    http.postRequest({
      baseType: 0,
      url: "message/send",
      params: param,
      msg: "加载中...",
      success: res => {
        this.setData({
          page: 1,
          content:'',
          video:''
        });
        this.getChatList();
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

    this.getFamilyMembers();
    this.getChatList();
  },
  /** 
   * 页面上拉触底事件的处理函数 
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    });
    this.getChatList();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    innerAudioContext.destroy();
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