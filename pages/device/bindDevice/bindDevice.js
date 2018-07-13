
const app = getApp();
var http = require("../../../http.js");
var drawQrcode = require('../../../utils/qrcode.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopu:false,
    showList:false,
    wifiInfo: {ssid:'',pwd:'',optId:''},
    connectWifi:{},
    wifi:{},
    wifiName:'',
    pwd:'',
    wifiList:[],
    interval:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var device = wx.getSystemInfoSync();
    var isAndroid = (device.platform == 'android'?true:false);
    this.setData({
      isAndroid: isAndroid
    })
    if (device.platform == 'android'){
      wx.startWifi({
        success: res => {
          this.getConnectedWifi();
          this.getWifiList();
        }
      })
    }else{
      wx.startWifi({
        success: res => {
          this.getConnectedWifi();
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
      var timeStamp = app.globalData.userInfo.uid + '.' + new Date().getTime();
      var info = { ssid: this.data.wifiName, pwd: this.data.pwd, optId: timeStamp}
        this.setData({
          wifiInfo: info,
          timeStamp: timeStamp
        })
        this.createQrCode();
      }else{
        wx.showToast({ title: '请输入wifi密码', icon: 'none', duration: 1500 });
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
        wx.showToast({ title: res.errMsg, icon: 'none', duration: 1500 });
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
        wx.showToast({ title: 'wifi连接成功', icon: 'none', duration: 1500 });
      },
      complete: res => {
        console.log(res);
      },
      fail:res => {
        wx.showToast({ title: res.errMsg, icon: 'none', duration: 1500 });
      }
    })
  },
  // 监听连接上 Wi-Fi 的事件。
  connectStatus:function(){
    wx.onWifiConnected(function(res){
      console.log('监听连接上 Wi-Fi 的事件。');
      console.log(res);
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
        that.setData({
          showPopu: false
        })
        clearInterval(that.data.interval);
        wx.showToast({ title: '联网成功', icon: 'none', duration: 1500 });
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/baby/babyFile/babyFile?id=1'
          })
        }, 2000)
      }
    }, false);
  }
})