import {
  listBills
} from "../../api/bills"

// pages/counts/counts.js
Page({

  data: {
    selectedMonth: new Date().toISOString().slice(0, 7),
    filteredList: [],
    totalExpenses: '',
    totalIncome: '',
    listType: [],
    userinfo: '', 
  },

  getList() {
    listBills().then(res => {
      const userInfo = res.filter(item => item.userId === this.data.userinfo.id);
      const filteredList = userInfo.filter(item => {
        const recordDate = new Date(item.recordDate);
        const recordMonth = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
        return recordMonth === this.data.selectedMonth;
      });

      const expenses = filteredList.filter(item => {
        return item.tradeType === '支出'
      });
      const totalExpenses = expenses.reduce((sum, item) => {
        return sum + parseFloat(item.amount); // 将 amount 转换为数字并累加
      }, 0);

      const expensesByType = {};

      expenses.forEach(item => {
        const type = item.type; // 获取当前条目的类型
        const amount = parseFloat(item.amount); // 将金额转换为数字
        if (!expensesByType[type]) {
          expensesByType[type] = 0;
        }
        expensesByType[type] += amount;
      });

      const listType = Object.keys(expensesByType).map(type => {
        return {
          type: type,
          total: expensesByType[type], // 该类型的消费总和
        };
      });

      const income = filteredList.filter(item => {
        return item.tradeType === '收入'
      });
      const totalIncome = income.reduce((sum, item) => {
        return sum + parseFloat(item.amount); // 将 amount 转换为数字并累加
      }, 0);

      this.setData({
        filteredList: filteredList,
        totalExpenses,
        totalIncome,
        listType,
      });
    });
  },

  handleMonthChange(e) {
    const selectedMonth = e.detail.value;
    this.setData({
      selectedMonth: selectedMonth,
    });
    this.getList();
  },

  gotoAnnual() {
    wx.navigateTo({
      url: '/pages/annual/annual',
    })
  },


  onLoad(options) {
    
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
    this.setData({
      userinfo: wx.getStorageSync('userinfo') 
    }, () => {
      this.getList();
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