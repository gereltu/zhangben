// pages/news/news.js
import { listBills } from "../../api/bills"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:'',
    billsList:[],
  },
  getList(){
    listBills().then(res =>{
      const userInfo = res.filter(item => item.userId === this.data.userinfo.id);
      const data = userInfo.filter(item => item.tradeType === '支出')
      this.setData({
        billsList : data
      })
    })
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