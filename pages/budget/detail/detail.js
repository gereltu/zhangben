// pages/budget/detail/detail.js
import {
  listBudgets,
  addBudgets
} from "../../../api/apis"
import {
  listType,
  listBills
} from "../../../api/bills"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listType: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  addBudget() {
    const {
      amount,
      selectedType,
      userId,
    } = this.data;

    // 校验输入是否完整
    if (!amount || !selectedType) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
      });
      return;
    }

    addBudgets({
      userId: userId,
      amount: amount,
      type: selectedType.type,
    }).then(res => {
      console.log("res", res);
      if (res == '添加成功！') {
        wx.showModal({
          title: '提示',
          content: '添加成功',
          success: (modalRes) => {
            if (modalRes.confirm) {
              this.setData({
                amount: '',
                selectedType: '',
              });
              wx.navigateBack({
                delta: 1,
              });
            }
          }
        });
      } else {
        wx.showToast({
          title: res,
          icon: 'none',
        });
      }
    })
  },

  inputAmount(e) {
    this.setData({
      amount: e.detail.value,
    });
  },

  selectType(e) {
    const index = e.detail.value;
    const selectedType = this.data.listType[index]
    this.setData({
      selectedType: selectedType,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const userinfo = wx.getStorageSync('userinfo');
    if (userinfo && userinfo.id) {
      this.setData({
        userId: userinfo.id,
      });
    } else {
      console.error("用户信息不存在或缺少 id 字段");
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      });
      wx.navigateTo({
        url: '/pages/login/login',
      });
    }
    listType().then(res => {
      this.setData({
        listType: res,
      });
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})