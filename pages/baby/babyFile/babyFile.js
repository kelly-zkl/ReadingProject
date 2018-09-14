
var model = require('../../../template/model/model.js')
var http = require("../../../http.js");
var util = require('../../../utils/util.js');
var app = getApp();

var show = false;
var item = {};

Page({ 
  /**
   * 页面的初始数据
   */
  data: {
    item: {
      show: show
    },
    date: "1970-01-01",
    sex:2,
    childId:'',
    babyName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      date: util.getNowDate(),
      childId: options.id ? options.id : 1
    });

    if (this.data.childId != 1) {
      this.getBabyDetail();
    }
  },

  // 获取宝宝详情
  getBabyDetail:function(){
    var that = this;
    http.postRequest({
      baseType: 0,
      url: "child/detail",
      params: { childId: that.data.childId, uid: app.globalData.userInfo.uid },
      msg: "加载中...",
      success: res => {
        this.setData({
          babyName: res.data.nickname,
          sex: res.data.gender,
          thumbUrl: res.data.avatar,
          date: res.data.birthdate,
          province: res.data.province,
          city: res.data.city,
          county: res.data.district
        });
      }
    }, false);
  },
  /**选择宝宝性别*/
  sexChange:function(e){
    this.setData({
      sex: e.currentTarget.id
    });
  },

  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  showArea: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false, 400);
  },
  //确定选择
  chooseCity: function (e) {
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function (e) {
    // console.log(e)
    model.updateAreaData(this, 1, e);
    item = this.data.item;
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
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
  //输入宝宝昵称
  inputName: function (e) {
    this.setData({
      babyName: e.detail.value
    });
  },
  //日期选择
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  /**保存宝宝档案*/
  saveData:function(){
    var that = this;
    var deviceId = wx.getStorageSync('deviceId');
    
    if (!that.data.babyName || !that.data.date || !that.data.province || !that.data.city || 
      !that.data.thumbUrl || !that.data.county) {
      wx.showToast({ title: '请完善宝宝档案', icon: 'none', duration: 1500 });
      return;
    }

    if (that.data.childId == 1) {
      http.postRequest({
        baseType: 0,
        url: "child/bindDevice",
        msg: "保存中....",
        params: {
          deviceId: deviceId, uid: app.globalData.userInfo.uid, nickname: that.data.babyName,
          birthdate: that.data.date, gender: that.data.sex, district: that.data.county,
          avatar: that.data.thumbUrl, province: that.data.province, city: that.data.city
        },
        success: res => {
          wx.showToast({ title: '保存成功', icon: 'none', duration: 1500 })
          wx.navigateBack({
            delta: 3
          })
        }
      }, true);
    }else{
      http.postRequest({
        baseType: 0,
        url: "child/update",
        params: {
          childId: that.data.childId, nickname: that.data.babyName, birthdate: that.data.date, gender: that.data.sex,
          district: that.data.county, avatar: that.data.thumbUrl, province: that.data.province, city: that.data.city,
          uid: app.globalData.userInfo.uid
        },
        msg: '修改中...',
        success: res => {
          wx.showToast({ title: '修改成功', icon: 'none', duration: 1500 })
          wx.navigateBack({
            delta: 2
          })
        }
      }, true);
    }
  }
})