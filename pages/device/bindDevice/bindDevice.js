
const app = getApp();
var http = require("../../../http.js");
var drawQrcode = require('../../../utils/qrcode.js');

const innerAudioContext = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiKey: 'a50878851bee4fb1acb3aa3bb1d80a78',
    charpKey:'e2eB7afcdf640d356f049c525',
    charpSecret:'5EA766feB0DEC0D1feFAEcF4355b3A9DaE2B51F6ACc4ad0Fd3',
    showPopu:false,
    showList:false,
    wifiInfo: {ssid:'',pwd:'',optId:''},
    wifi:{},
    wifiName:'',
    pwd:'',
    audioUrls:[],
    audioIndex:0,
    wifiList:[],
    interval:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      childId: options.id ? options.id : 1
    });

    innerAudioContext.onEnded((res) => {
      let indx = this.data.audioIndex;
      indx=indx+1;
      let url = this.data.audioUrls[indx % this.data.audioUrls.length];
      innerAudioContext.src = url;
      innerAudioContext.obeyMuteSwitch = false;//是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音
      innerAudioContext.play();
      this.setData({
        audioIndex: indx
      })
    });

    innerAudioContext.onError((res) => {
      console.log('播放 onError', res)
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var device = app.globalData.device;
    var isAndroid = (device.platform == 'android'?true:false);
    this.setData({
      isAndroid: isAndroid
    })
    if (device.platform == 'android'){
      wx.startWifi({
        success: res => {
          this.getConnectedWifi();
          this.getWifiList();
          this.connectStatus();
        }
      })
    }else{
      wx.startWifi({
        success: res => {
          this.getConnectedWifi();
          this.connectStatus();
        }
      })
    }
  },
  // 输入wifi名称
  inputWifi:function(e){
    this.setData({
      wifiName: e.detail.value
    })
  },
  // 输入wifi密码
  inputPwd: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  // wifi的二维码
  togglePopu:function(){
    this.setData({
      showPopu: !this.data.showPopu
    })
  },
  //获取页面二维码
  createQrCode: function () {
    var that = this;
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: JSON.stringify(this.data.wifiInfo)
    })
    this.setData({
      showPopu: true
    })

    var interval = setInterval(function () {
      that.getDeviceStatus();
    }, 5000)

    this.setData({
      interval: interval
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.interval);
    wx.stopWifi();
  },
  // 生成二维码
  startCreate:function(){

    // if (this.data.wifi.secure){
    if (this.data.wifiName.length > 0 && this.data.pwd.length > 0){
      var timeStamp = new Date().getTime();
      var info = { ssid: this.data.wifiName, pwd: this.data.pwd, optId: app.globalData.userInfo.uid + '.' + timeStamp}
        this.setData({
          wifiInfo: info,
          timeStamp: app.globalData.userInfo.uid + '.' + timeStamp
        })
      console.log(info);
        this.createQrCode();
      // let urls=[];
      // let baseUrl = 'https://' + this.data.charpKey + ':' + this.data.charpSecret + '@m.baxueshe.com/audio/';
      // if (this.data.wifiName.length <= 8){
      //   let w1 = 'w1' + this.data.wifiName.substring(0, this.data.wifiName.length);
      //   urls.push(baseUrl + this.strTo16(w1)+'.mp3');
      // } else if (this.data.wifiName.length <= 16){
      //   let w1 = 'w1' + this.data.wifiName.substring(0, 8);
      //   let w2 = 'w2' + this.data.wifiName.substring(8, this.data.wifiName.length);
      //   urls.push(baseUrl + this.strTo16(w1) + '.mp3');
      //   urls.push(baseUrl + this.strTo16(w2) + '.mp3');
      // } else if (this.data.wifiName.length <= 24){
      //   let w1 = 'w1' + this.data.wifiName.substring(0, 8);
      //   let w2 = 'w2' + this.data.wifiName.substring(8, 16);
      //   let w3 = 'w3' + this.data.wifiName.substring(16, this.data.wifiName.length);
      //   urls.push(baseUrl + this.strTo16(w1) + '.mp3');
      //   urls.push(baseUrl + this.strTo16(w2) + '.mp3');
      //   urls.push(baseUrl + this.strTo16(w3) + '.mp3');
      // } else if (this.data.wifiName.length <= 32){
      //   let w1 = 'w1' + this.data.wifiName.substring(0, 8);
      //   let w2 = 'w2' + this.data.wifiName.substring(8, 16);
      //   let w3 = 'w3' + this.data.wifiName.substring(16,24);
      //   let w4 = 'w4' + this.data.wifiName.substring(24, this.data.wifiName.length);
      //   urls.push(baseUrl + this.strTo16(w1) + '.mp3');
      //   urls.push(baseUrl + this.strTo16(w2) + '.mp3');
      //   urls.push(baseUrl + this.strTo16(w3) + '.mp3');
      //   urls.push(baseUrl + this.strTo16(w4) + '.mp3');
      // }
      // if (this.data.pwd.length <= 8) {
      //   let p1 = 'p1' + this.data.pwd.substring(0, this.data.pwd.length);
      //   urls.push(baseUrl + this.strTo16(p1) + '.mp3');
      // } else if (this.data.pwd.length <= 16) {
      //   let p1 = 'p1' + this.data.pwd.substring(0, 8);
      //   let p2 = 'p2' + this.data.pwd.substring(8, this.data.pwd.length);
      //   urls.push(baseUrl + this.strTo16(p1) + '.mp3');
      //   urls.push(baseUrl + this.strTo16(p2) + '.mp3');
      // }
      // let uid = app.globalData.userInfo.uid;
      // let u1 = 'u1' + uid.substring(0, 12);
      // let u2 = 'u2' + uid.substring(12, uid.length);
      // let t = 't' + timeStamp;
      // urls.push(baseUrl + this.strTo16(u1) + '.mp3');
      // urls.push(baseUrl + this.strTo16(u2) + '.mp3');
      // urls.push(baseUrl + this.strTo16(t) + '.mp3');

      // console.log(urls);
      // this.setData({
      //   audioUrls: urls
      // })
      
      // innerAudioContext.src = urls[this.data.audioIndex];
      // innerAudioContext.obeyMuteSwitch = false;//是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音
      // innerAudioContext.play();
      // console.log(innerAudioContext.src);
      }else{
        wx.showToast({ title: '请输入wifi/密码', icon: 'none', duration: 1500 });
      }
    // }else{
    //   var info = { ssid: this.data.wifiName, pwd: '', optId: '' + new Date().getTime() }
    //   this.setData({
    //     wifiInfo: info
    //   })
    //   this.createQrCode();
    // }
  },
  // 获取已连接的wifi
  getConnectedWifi:function(){
    wx.getConnectedWifi({
      success: res => {
        console.log(res);
        this.setData({
          wifiName: res.wifi.SSID,
          connectWifi: res.wifi,
          wifi: res.wifi
        })
      },
      fail: res => {
        console.log(res);
        wx.showToast({title: res.errMsg, icon: 'none', duration: 1500});
      }
    })
  },
  // 连接wifi
  connectWifi:function(){
    wx.connectWifi({
      SSID:'',
      BSSID:'',
      password:'',
      success: res => {
        console.log(res);
        wx.showToast({title: 'wifi连接成功', icon: 'none', duration: 1500});
      },
      complete: res => {
        console.log(res);
      },
      fail:res => {
        wx.showToast({title: res.errMsg, icon: 'none', duration: 1500});
      }
    })
  },
  // 监听连接上 Wi-Fi 的事件。
  connectStatus:function(){
    wx.onWifiConnected(res => {
      console.log('监听连接上 Wi-Fi 的事件。');
      console.log(res);
      this.setData({
        wifiName: res.wifi.SSID,
        connectWifi: res.wifi,
        wifi: res.wifi
      })
    })
  },
  // 获取wifi列表
  getWifiList:function(){
    var that = this;
    wx.getWifiList({
      success: res => {
        console.log(res);
        wx.onGetWifiList(function(res){
          console.log('监听在获取到 Wi-Fi 列表数据时的事件，在回调中将返回 wifiList。');
          console.log(res);
          that.setData({
            wifiList: res.wifiList
          })
        })
      },
      fail: res => {
        console.log(res);
        wx.showToast({ title: res.errMsg, icon: 'none', duration: 1500 });
      }
    })
  },
  // 弹出wifi列表界面
  toggleList:function(){
    this.setData({
      showList: !this.data.showList
    })
  },
  // 选择wifi
  popuChange:function(e){
    this.setData({
      wifiName: this.data.wifiList[e.currentTarget.id].SSID,
      wifi: this.data.wifiList[e.currentTarget.id],
      showList:false
    })
  },
  // 查询操作设备结果
  getDeviceStatus:function(){
    var that = this;
    http.postRequest({
      baseType: 1,
      url: "device/resultOperate",
      params: { messageId: that.data.timeStamp, uid: app.globalData.userInfo.uid },
      msg: "加载中...",
      success: res => {
        wx.setStorageSync('deviceId', res.data.deviceId)
        innerAudioContext.stop();
        that.setData({
          showPopu: false
        })
        clearInterval(that.data.interval);
        wx.showToast({ title: '联网成功', icon: 'none', duration: 1500 });
        
        if (that.data.childId==1){//新建设备
          if (app.globalData.userInfo.childId && !app.globalData.userInfo.isBind) {//绑定当前宝宝
            that.setData({
              childId: app.globalData.userInfo.childId
            })
            that.bindDevice();
          } else {//创建新的宝宝
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/baby/babyFile/babyFile?id=1'
              })
            }, 1500)
          }
        }else{//选定宝宝绑定设备
          if (!app.globalData.userInfo.isBind) {//当前宝宝没有绑定设备
            that.bindDevice();
          }
        }
      }
    }, false);
  },
  /**绑定宝宝档案*/
  bindDevice: function () {
    var that = this;
    var deviceId = wx.getStorageSync('deviceId');

    http.postRequest({
      baseType: 0,
      url: "child/bindDevice",
      msg: "绑定中....",
      params: {
        deviceId: deviceId, uid: app.globalData.userInfo.uid, childId: that.data.childId
      },
      success: res => {
        that.bindTuling();
      }
    }, true);
  },
  //图灵绑定设备
  bindTuling() {
    var that = this;
    var deviceId = wx.getStorageSync('deviceId');
    http.postRequest({
      baseType: 3,
      url: "app-author/bind",
      params: {
        apiKey: that.data.apiKey, uid: that.data.childId, deviceId: deviceId,
        name: app.globalData.baby.nickname + "的小叮当", imageUrl: app.globalData.baby.avatar
      },
      success: res => {
        if (res.code == 41009 && res.code == 0) {
          wx.showToast({ title: '绑定成功', icon: 'none', duration: 1500 })
          setTimeout(function () {
            wx.navigateBack({
              delta: 2
            })
          },2000);
        }else{
          wx.showToast({ title: res.desc, icon: 'none', duration: 1500 });
        }
      }
    }, false);
  },
  onUnload: function () {
    innerAudioContext.destroy();
  },
  //字符串转成16进制的字符串
  strTo16: function(value) {
    value = value.replace(/\s*/g, "");
    var hexCharCode = [];
    for (var i = 0; i < value.length; i++) {
      var ch = value.charCodeAt(i);
      hexCharCode.push(ch.toString(16));
    }
    return hexCharCode.join("");
  }
})