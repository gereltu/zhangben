<template>
  <div>
    <h1>智能财务预测</h1>
    <div ref="chart" style="width: 800px; height: 500px;"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import * as math from 'mathjs';
import { listBills } from "@/api/project/bills";

export default {
  data() {
    return {
      records: [],
      predictions: [] // 存储预测值
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      listBills().then(res => {
        this.records = res.data;
        console.log("res.data", res.data);
        this.predictLinearRegression();
        this.renderChart();
      });
    },
    // 线性回归预测
    predictLinearRegression() {
      // 将日期转换为时间戳，金额根据 tradeType 转换为正负值
      const data = this.records.map(record => ({
        x: new Date(record.recordDate).getTime(),
        y: record.tradeType === '支出' ? -parseFloat(record.amount) : parseFloat(record.amount)
      }));

      // 提取x和y的值
      const x = data.map(point => point.x);
      const y = data.map(point => point.y);

      // 计算线性回归参数
      const n = x.length;
      const sumX = math.sum(x);
      const sumY = math.sum(y);
      const sumXY = math.sum(math.dotMultiply(x, y));
      const sumX2 = math.sum(math.dotMultiply(x, x));

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX); // 斜率
      const intercept = (sumY - slope * sumX) / n; // 截距

      // 生成未来七天的日期
      const lastDate = new Date(Math.max(...x)); // 获取最后一个实际数据的日期
      const futureDates = [];
      for (let i = 1; i <= 7; i++) {
        const futureDate = new Date(lastDate);
        futureDate.setDate(lastDate.getDate() + i); // 增加天数
        futureDates.push(futureDate.getTime());
      }

      // 预测未来七天的值
      this.predictions = futureDates.map(date => ({
        date: new Date(date).toLocaleDateString(),
        amount: slope * date + intercept
      }));
    },

    renderChart() {
      const chartDom = this.$refs.chart;
      const myChart = echarts.init(chartDom);

      // 处理实际值数据
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      };

      const actualData = this.records.reduce((acc, record) => {
        const date = formatDate(record.recordDate);
        const amount = record.tradeType === '支出' ? -parseFloat(record.amount) : parseFloat(record.amount);
        if (acc[date]) {
          acc[date] += amount; // 对相同日期的金额求和
        } else {
          acc[date] = amount;
        }
        return acc;
      }, {});

      const actualDataArray = Object.keys(actualData).map(date => ({
        date,
        amount: actualData[date]
      }));

      // 处理预测值数据
      const predictedData = this.predictions.map(prediction => ({
        date: prediction.date,
        amount: prediction.amount
      }));

      console.log('实际值数据:', actualDataArray);
      console.log('预测值数据:', predictedData);

      // 合并实际值和预测值的日期
      const allDates = [
        ...new Set([
          ...actualDataArray.map(point => point.date),
          ...predictedData.map(point => point.date)
        ])
      ].sort((a, b) => new Date(a) - new Date(b));

      // 准备 ECharts 数据
      const actualSeries = allDates.map(date => {
        const point = actualDataArray.find(p => p.date === date);
        return point ? point.amount : 0; // 用 0 代替 null
      });

      const predictedSeries = allDates.map(date => {
        const point = predictedData.find(p => p.date === date);
        return point ? point.amount : 0; // 用 0 代替 null
      });

      // ECharts 配置
      const option = {
        xAxis: {
          type: 'category',
          data: allDates,
          name: '日期'
        },
        yAxis: {
          type: 'value',
          name: '金额'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let result = `${params[0].axisValue}<br>`;
            params.forEach(param => {
              result += `${param.seriesName}: ${param.value !== null && param.value !== undefined ? param.value.toFixed(2) : '无数据'}<br>`;
            });
            return result;
          }
        },
        legend: {
          data: ['实际值', '预测值']
        },
        series: [
          {
            name: '实际值',
            data: actualSeries,
            type: 'line',
            smooth: true,
            lineStyle: {
              color: 'blue'
            }
          },
          {
            name: '预测值',
            data: predictedSeries,
            type: 'line',
            smooth: true,
            lineStyle: {
              color: 'red'
            }
          }
        ]
      };

      myChart.setOption(option);
    }
  }
};
</script>

<style>
/* 样式可以根据需要自定义 */
</style>