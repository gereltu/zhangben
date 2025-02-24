// pages/family/addFamily/addFamily.js
import {addFamily} from "../../../api/apis"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    familyName: '',
    loading: false,
    userinfo: null
  },

  onLoad() {
    this.setData({
      userinfo: wx.getStorageSync('userinfo') || {}
    });
  },

  // 输入框变化事件
  onNameChange(e) {
    this.setData({
      familyName: e.detail
    });
  },

  // 创建家庭组
  createFamily() {
    const { familyName, userinfo } = this.data;
    
    if (!familyName.trim()) {
      wx.showToast({ title: '请填写家庭组名称', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    // 构造参数
    const params = {
      familyName: familyName,
      memberIds: String(userinfo.id),
      creatorId: userinfo.id
    };

    // 使用 Promise 链式调用
    addFamily(params)
      .then(res => {
        if (res) {
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            complete: () => {
              setTimeout(() => wx.navigateBack(), 500);
            }
          });
        } else {
          throw new Error(res.msg || '创建失败');
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