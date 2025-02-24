// pages/budget/budget.js
import {
  listBudgets,
  addBudgets
} from "../../api/apis"
import {
  listType,
  listBills
} from "../../api/bills"

Page({
  data: {
    amount: '',
    budgetList: [],
    listType: [],
    userId: '',
    selectedType: '',
    totalExpenses: '',
    totalBudget: '',
    total: 0,
  },
  getList() {
    // 获取预算列表
    listBudgets().then(res => {
      const userInfo = res.filter(item => item.userId === this.data.userId);
      const totalBudget = userInfo.reduce((sum, item) => {
        return sum + parseFloat(item.amount);
      }, 0);

      // 更新总预算
      this.setData({
        budgetList: userInfo,
        totalBudget: totalBudget,
      });

      listBills().then(res => {
        const userInfo = res.filter(item => item.userId === this.data.userId);
        const expenses = userInfo.filter(item => item.tradeType === '支出');
        const totalExpenses = expenses.reduce((sum, item) => {
          return sum + parseFloat(item.amount);
        }, 0);

        this.setData({
          totalExpenses: totalExpenses,
        });
        const total = this.data.totalBudget - this.data.totalExpenses;
        this.setData({
          total: total,
        });
      });
    });
  },

  buttonClick(){
    wx.navigateTo({
      url: '/pages/budget/detail/detail',
    })
  },

  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },


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
    this.getList();
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