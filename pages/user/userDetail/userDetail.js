// pages/user/userDetail/userDetail.js
import {
  getUser,
  updateUser
} from "../../../api/apis"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    userList: {}, // Change this to an object
  },

  // 获取用户信息
  getList() {
    getUser({
      id: this.data.userInfo.id
    }).then(res => {
      console.log("ss",res);
      this.setData({
        userList: res
      });
    });
  },

  // 更新输入框内容
  onInputChange(e) {
    const {
      key
    } = e.currentTarget.dataset; // 获取输入框的字段名
    const value = e.detail.value; // 获取输入的值
    this.setData({
      [`userList.${key}`]: value // 更新相应的字段
    });
  },

  // 保存修改
  saveChanges() {
    const {
      userNickname,
      userPhone,
      userEmail,
      userPic
    } = this.data.userList;
    const updatedData = {
      userNickname,
      userPhone,
      userEmail,
      userPic
    };
    // 发送更新请求
    updateUser({
      id: this.data.userInfo.id,
      ...updatedData
    }).then(res => {
      if (res) {
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        });
        setTimeout(()=>{
          wx.navigateBack();
        },100)
        
        this.getList();
      } else {
        wx.showToast({
          title: '修改失败',
          icon: 'none'
        });
      }
    });
  },

  chooseAvatar() {
    wx.chooseMedia({
      count: 1, // 选择一张图片或一段视频
      mediaType: ['image'], // 只选择图片
      sourceType: ['album', 'camera'], // 可以选择从相册或相机获取
      success: (res) => {
        const tempFilePaths = res.tempFiles[0].tempFilePath; // 获取临时文件路径
        // 调用上传头像方法
        this.uploadAvatar(tempFilePaths);

      }
    });
  },

  // 上传头像
  uploadAvatar(filePath) {
    wx.uploadFile({
      url: 'http://localhost:9999/common/upload',
      filePath: filePath,
      name: 'file',
      success: (uploadFileRes) => {
        const avatarUrl = JSON.parse(uploadFileRes.data).url;
        setTimeout(() => {
          
          this.setData({
            'userList.userPic': avatarUrl
          });
  
          wx.showToast({
            title: '头像更新成功',
            icon: 'success'
          });
        }, 50);
      }
    });
  },
  // 页面显示时获取用户信息
  onShow() {
    this.setData({
      userInfo: wx.getStorageSync('userinfo')
    }, () => {
      this.getList();
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