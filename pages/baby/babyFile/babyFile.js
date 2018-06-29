
var area = require('../../../template/area/area.js');
var http = require("../../../http.js");
var util = require('../../../utils/util.js');

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
    showPopup: false,
    date: "1970-01-01",
    sex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      date: util.getNowDate()
    });  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  /**选择宝宝性别*/
  sexChange:function(e){
    this.setData({
      sex: e.currentTarget.id
    });
  },

  //点击选择城市按钮显示picker-view
  showArea: function (e) {
    area.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    area.animationEvents(this, 200, false, 400);
  },
  //确定选择
  chooseCity: function (e) {
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
    area.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function (e) {
    // console.log(e)
    area.updateAreaData(this, 1, e);
    item = this.data.item;
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
    }else{
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
              console.log(res.data);
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

  }
})