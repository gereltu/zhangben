// pages/family/family.js
import * as echarts from '../../../components/ec-canvas/echarts';
import {
  listBills
} from "../../../api/bills";

import {
  familyList,
  getUsersByIds,
} from "../../../api/apis"

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    currentFamilyId: '',
    chartOption: {},
    isExpense: true
  },

  chartInstance: null,

  onLoad(options) {
    this.setData({
      currentFamilyId: options.familyId
    });
    this.initChart();
  },

  onShow() {
    this.loadData();
  },

  initChart() {
    this.selectComponent('#family-chart').init((canvas, width, height) => {
      this.chartInstance = echarts.init(canvas, null, {
        width,
        height,
        devicePixelRatio: wx.getSystemInfoSync().pixelRatio
      });
      return this.chartInstance;
    });
  },

  loadData() {
    this.getCurrentFamily(this.data.currentFamilyId)
      .then(family => this.getFamilyUsers(family))
      .then(familyUsers => {
        const memberIds = familyUsers.map(u => u.id);
        return listBills().then(res => {
          return res.filter(item => memberIds.includes(item.userId));
        });
      })
      .then(data => {
        this.processChartData(data);
      });
  },

  getCurrentFamily(familyId) {
    return familyList().then(list => {
      return familyId ?
        list.find(item => item.id == familyId) :
        list.find(item =>
          item.memberIds?.split('-').map(Number).includes(wx.getStorageSync('userinfo')?.id)
        );
    });
  },

  getFamilyUsers(family) {
    if (!family?.memberIds) return Promise.resolve([]);
    return getUsersByIds(family.memberIds.split('-').map(Number));
  },

  processChartData(list) {
    const filteredData = list.filter(item =>
      item.tradeType === (this.data.isExpense ? '支出' : '收入')
    );
  
    // 聚合每日金额
    const dateMap = filteredData.reduce((acc, item) => {
      const date = item.recordDate.split(' ')[0]; // 假设日期格式为 "YYYY-MM-DD" 或 "MM/DD"
      const amount = parseFloat(item.amount) || 0;
      acc[date] = (acc[date] || 0) + amount;
      return acc;
    }, {});
  
    // 按日期从小到大排序
    const sortedEntries = Object.entries(dateMap)
      .sort((a, b) => {
        // 将日期字符串转为时间戳进行比较
        const dateA = new Date(a[0]).getTime();
        const dateB = new Date(b[0]).getTime();
        return dateA - dateB; // 从小到大排序
      });
  
    // 提取排序后的日期和金额
    const dates = sortedEntries.map(entry => entry[0]);
    const amounts = sortedEntries.map(entry => entry[1]);
  
    // 更新图表配置
    this.setData({
      chartOption: {
        xAxis: { data: dates },
        series: [{ data: amounts }]
      }
    }, () => this.updateChart());
  },

  updateChart() {
    const baseOption = {
      title: {
        text: '家庭消费趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}--{c}￥'
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        type: 'bar',
        itemStyle: {
          color: this.data.isExpense ? '#ee6666' : '#91cc75'
        }
      }]
    };
  
    const mergedSeries = baseOption.series.map((baseSeries, index) => ({
      ...baseSeries,
      ...(this.data.chartOption.series && this.data.chartOption.series[index] || {})
    }));
  
    const mergedOption = {
      ...baseOption,
      ...this.data.chartOption,
      series: mergedSeries
    };
  
    this.chartInstance.setOption(mergedOption);
  },

  toggleType() {
    this.setData({
      isExpense: !this.data.isExpense
    }, () => {
      this.loadData();
    });
  }
});