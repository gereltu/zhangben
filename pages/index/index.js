import {
  listBills
} from "../../api/bills"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    banner: [{
        bannerPic: "/images/carousel/1.jpg"
      },
      {
        bannerPic: "/images/carousel/2.jpg"
      },
      {
        bannerPic: "/images/carousel/3.jpg"
      },
    ],
    userinfo: '', 
    incomeList: [], 
    expenseList: [], 
    currentList: [], 
    filteredList: [], 
    selectedDate: new Date().toISOString().slice(0, 10), 
  },

  getList() {
    listBills().then(res => {
      const userInfo = res.filter(item => item.userId === this.data.userinfo.id);
      const filteredList = userInfo.filter(item => {
        const recordDate = new Date(item.recordDate);
        const recordDates = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}-${String(recordDate.getDate()).padStart(2, '0')}`;
        return recordDates === this.data.selectedDate;
      });
      const incomeList = filteredList.filter(item => item.tradeType === '收入');
      const expenseList = filteredList.filter(item => item.tradeType === '支出');

      this.setData({
        incomeList: incomeList,
        expenseList: expenseList,
        currentList: expenseList 
      });
    }).catch(err => {
      console.error('获取列表数据失败:', err);
    });
  },

  // 显示收入列表
  showIncome() {
    this.setData({
      currentList: this.data.incomeList
    });
  },

  // 显示支出列表
  showExpense() {
    this.setData({
      currentList: this.data.expenseList
    });
  },

  // 处理日期选择
  handleDateChange(e) {
    const selectedDate = e.detail.value;
    this.setData({
      selectedDate: selectedDate,
    });
    this.getList(); // 重新获取列表数据
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
    // 页面渲染完成
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