import {
  getUser
} from "../../api/apis"
// pages/my/my.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo: "",
    userList:[],
  },
  getList(){
    getUser({id:this.data.userinfo.id}).then(res=>{
      this.setData({
        userList:res
      })
    })
  },
  login(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },


  gotoFamily() {
    wx.navigateTo({
      url: '/pages/family/familyDetail/familyDetail',
    })
  },

  gotoFinance(){
    wx.navigateTo({
      url: '/pages/finance/finance',
    })
  },

  gotoNews() {
    wx.navigateTo({
      url: '/pages/news/news',
    })
  },


  gotoUsers(){
    wx.navigateTo({
      url: '/pages/user/userDetail/userDetail',
    })
  },

  logout() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync(); // 清除所有本地存储数据
          wx.reLaunch({
            url: '/pages/login/login' // 登录页面路径
          });
        }
      }
    });
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
    });
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