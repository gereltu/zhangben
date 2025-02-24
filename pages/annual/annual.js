// pages/annual/annual.js
import {
  listBills
} from "../../api/bills"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: '', 
    filteredList: [],
    totalExpenses: '',
    totalIncome: '',
    countBills: [], //总交易笔数
    maxBills: '', //最大交易笔数
    listType:'',
    selectedYear: new Date().getFullYear().toString(),
  },

  getList() {
    listBills().then(res => {
      const userInfo = res.filter(item => item.userId === this.data.userinfo.id);
      const filteredList = userInfo.filter(item => {
        const recordDate = new Date(item.recordDate);
        const recordYear = recordDate.getFullYear().toString();
        return recordYear === this.data.selectedYear;
      });

      const countBills = filteredList.length;
      let maxBill = null;
      filteredList.forEach(item => {
        const amount = parseFloat(item.amount); 
        if (!maxBill || amount > parseFloat(maxBill.amount)) {
          maxBill = item; 
        }
      });

      const expenses = filteredList.filter(item => {
        return item.tradeType === '支出'
      });
      const totalExpenses = expenses.reduce((sum, item) => {
        return sum + parseFloat(item.amount);
      }, 0);

      const expensesByType = {};
      expenses.forEach(item => {
        const type = item.type; 
        const amount = parseFloat(item.amount); 
        if (!expensesByType[type]) {
          expensesByType[type] = 0;
        }
        expensesByType[type] += amount;
      });

      const listType = Object.keys(expensesByType).map(type => {
        return {
          type: type,
          total: expensesByType[type],
        };
      });

      const income = filteredList.filter(item => {
        return item.tradeType === '收入'
      });
      const totalIncome = income.reduce((sum, item) => {
        return sum + parseFloat(item.amount);
      }, 0);

      this.setData({
        filteredList: filteredList,
        totalExpenses: totalExpenses,
        totalIncome: totalIncome,
        countBills: countBills,
        maxBills: maxBill,
        listType:listType,
      });
    });
  },

  handleYearChange(e) {
    const selectedYear = e.detail.value;
    this.setData({
      selectedYear: selectedYear,
    });
    this.getList();
  },


  /**
   * 生命周期函数--监听页面加载
   */
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