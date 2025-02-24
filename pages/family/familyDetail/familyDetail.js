// pages/family/familyDetail/familyDetail.js
import {
  familyList,
  getUsersByIds,
  joinFamily,
  leaveFamily
} from "../../../api/apis"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: '',
    inviteCode: '',
    list: [],
  },

  getList() {
    const {
      userinfo
    } = this.data;
    if (!userinfo || !userinfo.id) {
      console.error("用户未登录");
      return;
    }
    const currentUserId = userinfo.id;

    familyList().then(res => {
      const processedPromises = res.map(item => {
        if (!item.memberIds) {
          return Promise.resolve(item);
        }
        const memberIds = item.memberIds.split('-').map(Number);
        return getUsersByIds(memberIds).then(usersRes => {
          if (usersRes) {
            item.users = usersRes;
          }
          return item;
        })
      });
      return Promise.all(processedPromises);
    }).then(processedList => {
      const filteredList = processedList.filter(item => {
        const ids = item.memberIds?.split('-').map(Number) || [];
        return ids.includes(currentUserId);
      });
      this.setData({
        list: filteredList
      });
    })
  },

  // 加入家庭处理
  handleJoinFamily() {
    const {
      inviteCode,
      userinfo
    } = this.data;

    // 基础校验
    if (!inviteCode) {
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none'
      });
      return;
    }
    if (!userinfo?.id) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    // 加入家庭并更新用户信息
    joinFamily(inviteCode, userinfo.id)
      .then(res => {
        wx.showToast({
          title: res.code === 200 ? '加入成功' : res.message,
          icon: res.code === 200 ? 'success' : 'none'
        });

        if (res.code === 200) {
            this.getList();
        }
      })
      .then(() => {
        this.setData({
          inviteCode: ''
        }); // 清空输入框
      })
  },


  //退出家庭
  handleLeaveFamily(e) {
    const {
      familyid
    } = e.currentTarget.dataset;
    const {
      userinfo
    } = this.data;

    if (!userinfo?.id) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认退出',
      content: '确定要退出该家庭吗？',
      success: (res) => {
        if (res.confirm) {
          leaveFamily(familyid, userinfo.id)
            .then(res => {
              wx.showToast({
                title: res.code === 200 ? '退出成功' : res.message,
                icon: res.code === 200 ? 'success' : 'none'
              });

              if (res.code === 200) {
                // 更新用户家庭信息
                const newUserinfo = {
                  ...userinfo,
                  family: null
                };
                wx.setStorageSync('userinfo', newUserinfo);
                this.setData({
                  userinfo: newUserinfo
                });

                // 刷新家庭列表
                this.getList();
              }
            })
        }
      }
    });
  },

  onInputInviteCode(e) {
    this.setData({
      inviteCode: e.detail.value.trim()
    })
  },
  gotoAnnual(e) {
    const familyId = e.currentTarget.dataset.familyid
    wx.navigateTo({
      url: `/pages/family/family?familyId=${familyId}`,
    })
  },
  gotoAddFamily() {
    wx.navigateTo({
      url: '/pages/family/addFamily/addFamily',
    })
  },

  gotoFinance(e){
    const familyId = e.currentTarget.dataset.familyid
    const url = `/pages/family/finance/finance?familyId=${familyId}` // 完整路径
    
    wx.navigateTo({
      url: url,
    })
  },


  onShow() {
    let userinfo = wx.getStorageSync('userinfo');
    this.setData({
      userinfo
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