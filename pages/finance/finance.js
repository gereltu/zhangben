import * as echarts from '../../components/ec-canvas/echarts';
import {
  listBills
} from '../../api/bills';

Page({
  /**
   * 页面的初始数据（仅包含可序列化数据）
   */
  data: {
    ec: {
      lazyLoad: true
    },
    isExpense: true,
    currentList: [],
    incomeList: [],
    expenseList: [],
    dates: [],
    amounts: [],
    userinfo: '',
  },
  chartInstance: null,
  /**
   * 图表初始化
   */
  initChart() {
    this.selectComponent('#mychart').init((canvas, width, height) => {
      this.chartInstance = echarts.init(canvas, null, {
        width,
        height,
        devicePixelRatio: wx.getSystemInfoSync().pixelRatio
      });
      this.updateChartData();
      return this.chartInstance;
    });
  },

  /**
   * 处理图表数据
   */
  processChartData(list) {
    const dateMap = new Map();
    list.forEach(item => {
      const date = item.recordDate.split(' ')[0];
      const amount = parseFloat(item.amount) || 0;
      dateMap.set(date, (dateMap.get(date) || 0) + amount);
    });

    const sortedDates = Array.from(dateMap.keys()).sort((a, b) =>
      new Date(a) - new Date(b) // 转换为日期对象后比较
    );

    return {
      dates: sortedDates,
      amounts: sortedDates.map(date => dateMap.get(date))
    };
  },

  /**
   * 线性回归预测
   */
  linearRegression(dates, amounts) {
    const n = amounts.length;
    const sumX = dates.reduce((sum, date, index) => sum + index, 0);
    const sumY = amounts.reduce((sum, amount) => sum + amount, 0);
    const sumXY = dates.reduce((sum, date, index) => sum + index * amounts[index], 0);
    const sumXX = dates.reduce((sum, date, index) => sum + index * index, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // 生成预测数据
    const predictedAmounts = dates.map((_, index) => slope * index + intercept);

    // 生成未来七天的预测
    const futurePredictedAmounts = [];
    const lastDateIndex = dates.length;

    for (let i = 1; i <= 7; i++) {
      const futureAmount = slope * (lastDateIndex + i) + intercept;
      futurePredictedAmounts.push(futureAmount);
      // 生成未来日期
      const futureDate = new Date(new Date(dates[lastDateIndex - 1]).getTime() + i * 24 * 60 * 60 * 1000);
      dates.push(futureDate.toISOString().split('T')[0]); // 格式化为 YYYY-MM-DD
    }

    return [...predictedAmounts, ...futurePredictedAmounts];
  },

  updateChartData() {
    if (!this.chartInstance) return;

    const {
      dates,
      amounts
    } = this.processChartData(this.data.currentList);
    
    // 进行线性回归预测
    const predictedAmounts = this.linearRegression(dates, amounts);

    const option = {
      title: {
        text: `${this.data.isExpense ? '支出' : '收入'}趋势图`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          return `${params[0].axisValue}---${params[0].data}￥`;
        }
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [{
        data: amounts,
        type: 'line',
        smooth: true,
        itemStyle: {
          color: this.data.isExpense ? '#ee6666' : '#91cc75'
        },
        areaStyle: {
          color: this.data.isExpense ?
            'rgba(238,102,102,0.2)' : 'rgba(145,204,117,0.2)'
        }
      },
      {
        data: predictedAmounts,
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#ffcc00' // 预测线的颜色
        },
        lineStyle: {
          type: 'dashed' // 预测线为虚线
        }
      }]
    };
    this.chartInstance.setOption(option);
  },

  /**
   * 切换收支类型
   */
  toggleType() {
    const isExpense = !this.data.isExpense;
    this.setData({
      isExpense,
      currentList: isExpense ? this.data.expenseList : this.data.incomeList
    }, () => {
      this.updateChartData();
    });
  },

  /**
   * 获取账单数据
   */
  getList() {
    return new Promise((resolve, reject) => {
      listBills().then(res => {
        const rawData = res.filter(item => item.userId === this.data.userinfo.id);
        const {
          expenseList,
          incomeList
        } = this.processListData(rawData);
        this.setData({
          expenseList,
          incomeList,
          currentList: this.data.isExpense ? expenseList : incomeList
        }, () => resolve());
      });
    });
  },

  /**
   * 处理账单数据
   */
  processListData(list) {
    return {
      expenseList: list.filter(i => i.tradeType === '支出'),
      incomeList: list.filter(i => i.tradeType === '收入')
    };
  },
  onShow() {
    let userinfo = wx.getStorageSync('userinfo');
    this.setData({
      userinfo
    }, () => {
      this.getList().then(() => {
        this.initChart();
      });
    });
  }
});