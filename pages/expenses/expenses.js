import {
  addBills,
  listType
} from "../../api/bills"

// pages/expenses/expenses.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: '',
    selectedType: '', // 选择的消费类型
    userId: '',
    recordType: '收入', // 记录类型（支出或收入）
    listType: [],
    listType2: ['工资收入', '投资收益', '其他收入'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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

  selectRecordType(e) {
    const index = e.detail.value;
    const recordType = ['支出', '收入'][index];
    this.setData({
      recordType: recordType,
      selectedType: '',
    });
  },

  selectType(e) {
    const index = e.detail.value;
    const selectedType = this.data.recordType === '支出' ?
      this.data.listType[index] : this.data.listType2[index];
    this.setData({
      selectedType: selectedType,
    });
  },

  // 输入金额
  inputAmount(e) {
    this.setData({
      amount: e.detail.value,
    });
  },

  // 添加记录
  addRecord() {
    const {
      amount,
      selectedType,
      userId,
      recordType
    } = this.data;

    if (!amount || !selectedType) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
      });
      return;
    }

    addBills({
      userId: userId,
      amount: amount,
      type: recordType === '支出' ? selectedType.type : selectedType, // 类型名称
      tradeType: recordType, // 记录类型（支出或收入）
      recordDate: new Date().toLocaleDateString(), // 当前日期
    }).then(res => {
      if (res) {
        wx.showModal({
          title: '提示',
          content: '添加成功',
          success: (res) => {
            if (res) {
              this.setData({
                amount: '',
                selectedType: '',
                recordType: '',
              });
              wx.switchTab({
                url: '/pages/index/index',
              });
            }
          }
        });
      }
    })
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