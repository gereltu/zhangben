// pages/login/login.js

import{userlogin}from "../../api/apis"
Page({

  /**
   * 页面的初始数据
   */
 /**
     * 页面的初始数据
     */
    data: {
      account:'',
      password:''
  },


  denglu(){
    userlogin({
      userAccount:this.data.account,
      userPassword:this.data.password,
      userPermissions:"普通用户"
    }).then(res=>{
      console.log(res)
      if(res.length!==0){
        wx.setStorageSync('userinfo', res[0])
        wx.showModal({
          title:"提示",
          content:"登录成功！即将跳转主页",
          showCancel:false,
          success(res){
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
          })
      }else{
        wx.showModal({
          title:"提示",
          content:"账号或密码输入错误",
          showCancel:false,
          success(res){
        
          }
          })
      }
    
    })
  },

  accountInput:function (e) {
      this.data.account = e.detail.value
  },


  passwordInput:function (e) {
      this.data.password = e.detail.value
  },


  regist:function (e) {
      wx.navigateTo({
        url: '/pages/register/register',
      })
  },


  signin:function (e) {
     
      if(this.data.account==''){
          wx.showModal({
            title:"提示",
            content:"请输入账号",
            showCancel:false,
            success(res){}
            })
      }else if(this.data.password==''){
          wx.showModal({
              title:"提示",
              content:"请输入密码",
              showCancel:false,
              success(res){}
              })
      }else{
        this.denglu()
     
      }
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