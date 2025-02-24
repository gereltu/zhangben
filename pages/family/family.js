// pages/family/family.js
import {
  listBills
} from "../../api/bills"
import {
  getUsersByIds,
  familyList
} from "../../api/apis"
Page({
  data: {
    filteredList: [],
    userinfo: '',
    familyUsers: [],
    currentFamily: null, // 当前所属家庭对象
    currentFamilyId: null,
    familyList: [],
    incomeList: [],
    expenseList: [],
    currentList: [],
    expenseListType: '', //消费类型统计
    incomeListType: '', //收入类型统计
    isExpense: true, // 默认显示支出
  },
  
  getCurrentFamily(familyId) {
    if (familyId) {
      return familyList().then(list => {
        const family = list.find(item => item.id == familyId)
        this.setData({ currentFamily: family })
        return family
      })
    }
    const userId = this.data.userinfo?.id;
    if (!userId) return Promise.reject('用户未登录');
     
    return familyList().then(list => {
      const family = list.find(item => {
        const memberIds = item.memberIds?.split('-').map(Number) || [];
        return memberIds.includes(userId);
      });
      this.setData({ currentFamily: family });
      return family;
    });
  },
  

  getFamilyUsers() {
    const family = this.data.currentFamily;
    if (!family || !family.memberIds) {
      this.setData({ familyUsers: [] });
      return Promise.resolve([]);
    }
  
    const memberIds = family.memberIds.split('-').map(Number);
    return getUsersByIds(memberIds).then(users => {
      this.setData({ familyUsers: users });
      return users;
    });
  },

  getList() {
    const familyId = this.data.currentFamilyId;
    this.getCurrentFamily(familyId).then(family => {
      return this.getFamilyUsers().then(familyUsers => {
        const familyUserIds = familyUsers.map(u => u.id);
        
        const userMap = familyUsers.reduce((acc, user) => {
          acc[user.id] = user.userNickname; 
          return acc;
        }, {});
  
        listBills().then(res => {
          const filteredList = res.filter(item => 
            familyUserIds.includes(item.userId)
          ).map(item => ({
            ...item,
            userName: userMap[item.userId]
          }));
          const { expenseList, incomeList } = this.processStats(filteredList);
          
          this.setData({
            filteredList,
            incomeList,
            expenseList,
            currentList: this.data.isExpense ? expenseList : incomeList,
            ...this.calculateTypeStats(expenseList, incomeList)
          });
        });
      });
    });
  },
  
  processStats(list) {
    const expenseList = list.filter(i => i.tradeType === '支出');
    const incomeList = list.filter(i => i.tradeType === '收入');
    return { expenseList, incomeList };
  },
  
  calculateTypeStats(expenseList, incomeList) {
    const calc = list => {
      const typeMap = {};
      list.forEach(item => {
        const amount = parseFloat(item.amount);
        typeMap[item.type] = (typeMap[item.type] || 0) + amount;
      });
      return Object.keys(typeMap).map(type => ({
        type,
        total: typeMap[type]
      }));
    };
  
    return {
      expenseListType: calc(expenseList),
      incomeListType: calc(incomeList)
    };
  },
  

  toggleType() {
    const isExpense = !this.data.isExpense;
    this.setData({
      isExpense: isExpense,
      currentList: isExpense ? this.data.expenseList : this.data.incomeList,
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

  onShow() {
    this.setData({
      userinfo: wx.getStorageSync('userinfo')
    }, () => {
      this.getCurrentFamily(this.data.currentFamilyId).then(family => {
        this.getFamilyUsers().then(() => {
          this.getList()
        })
      })
    });
  },

  onLoad(options) {
    this.setData({
      currentFamilyId: options.familyId
    })
  },
})