<template>
  <div class="chart-container">
    <!-- 支出/收入切换按钮 -->
    <div class="filter-controls">
      <button
          v-for="type in tradeTypes"
          :key="type"
          :class="{ active: selectedTradeType === type }"
          @click="selectedTradeType = type"
      >
        {{ type }}
      </button>
    </div>

    <!-- 时间选择器 -->
    <div class="date-picker">
      <label for="startDate">开始时间：</label>
      <input
          type="date"
          id="startDate"
          v-model="startDate"
      />
      <label for="endDate">结束时间：</label>
      <input
          type="date"
          id="endDate"
          v-model="endDate"
      />
    </div>

    <!-- ECharts 图表 -->
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {listBills} from "@/api/project/bills"; // 导入 API 方法

export default {
  data() {
    return {
      chartData: [], // 初始化为空数组，用于存储从 API 获取的数据
      tradeTypes: ['支出', '收入'], // 支出/收入类型
      selectedTradeType: '支出', // 默认选中支出
      startDate: '2025-01-01', // 默认开始时间
      endDate: '2025-12-31', // 默认结束时间
      filteredData: [] // 过滤后的数据
    };
  },
  mounted() {
    this.getList(); // 初始化时获取数据
  },
  watch: {
    // 监听 selectedTradeType 变化
    selectedTradeType() {
      this.filterData();
      this.renderChart();
    },
    // 监听 startDate 变化
    startDate() {
      this.filterData();
      this.renderChart();
    },
    // 监听 endDate 变化
    endDate() {
      this.filterData();
      this.renderChart();
    }
  },
  methods: {
    // 获取数据
    getList() {
      listBills().then(res => {
        let data =
        this.chartData = res.data; // 将 API 返回的数据赋值给 chartData
        this.filterData(); // 数据加载后过滤数据
        this.renderChart(); // 数据加载后渲染图表
      });
    },
    // 过滤数据
    filterData() {
      this.filteredData = this.chartData
          .filter(item => {
            const recordDate = new Date(item.recordDate);
            const startDate = new Date(this.startDate);
            const endDate = new Date(this.endDate);

            recordDate.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            return (
                recordDate >= startDate &&
                recordDate <= endDate &&
                item.tradeType === this.selectedTradeType
            );
          })
          .sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate));



    },
    // 渲染图表
    renderChart() {
      const chartDom = this.$refs.chart;


      // 如果已经初始化了图表，先销毁它
      if (chartDom && echarts.getInstanceByDom(chartDom)) {
        echarts.dispose(chartDom); // 清空图表实例
      }
      const myChart = echarts.init(chartDom);

      // 处理数据
      const types = [...new Set(this.filteredData.map(item => item.type))];
      const dates = [...new Set(this.filteredData.map(item => item.recordDate))]
          .sort((a, b) => new Date(a) - new Date(b)); // 按日期升序排序

      const series = types.map(type => {
        const data = dates.map(date => {
          const item = this.filteredData.find(d => d.type === type && d.recordDate === date);
          return item ? parseFloat(item.amount) : 0;
        });
        return {
          name: type,
          type: 'line',
          data: data
        };
      });

      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: types
        },
        xAxis: {
          type: 'category',
          data: dates
        },
        yAxis: {
          type: 'value'
        },
        series: series
      };

      myChart.setOption(option);
    }
  }
};
</script>

<style scoped>
/* 容器样式 */
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 50px auto;
}

/* 过滤控件样式 */
.filter-controls {
  margin-bottom: 20px;
}

.filter-controls button {
  padding: 8px 16px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  background-color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.filter-controls button.active {
  background-color: #42b983;
  color: white;
}

.filter-controls button:hover {
  background-color: #d0d0d0;
}

/* 时间选择器样式 */
.date-picker {
  margin-bottom: 20px;
}

.date-picker label {
  margin-right: 10px;
  font-size: 14px;
}

.date-picker input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

/* 图表样式 */
.chart {
  width: 100%;
  height: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>