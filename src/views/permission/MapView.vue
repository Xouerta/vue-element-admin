<template>
  <div class="dashboard">
    <div class="header">
      <h1>全球攻击态势大屏</h1>
      <el-date-picker
        v-model="dateRange"
        type="datetimerange"
        :shortcuts="shortcuts"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      />
    </div>

    <el-row :gutter="20">
      <!-- 左侧统计图表 -->
      <el-col :span="6">
        <div class="chart-container">
          <h3>攻击地区排名</h3>
          <canvas ref="regionChart"></canvas>
        </div>
        <div class="chart-container">
          <h3>被攻击资产排名</h3>
          <canvas ref="assetChart"></canvas>
        </div>
      </el-col>

      <!-- 中间地图 -->
      <el-col :span="12">
        <div class="map-container">
          <canvas ref="worldMap"></canvas>
        </div>
      </el-col>

      <!-- 右侧实时流水 -->
      <el-col :span="6">
        <div class="realtime-log">
          <h3>实时处置流水</h3>
          <div class="log-list">
            <div v-for="(log, index) in logList" :key="index" class="log-item">
              <div class="log-time">{{ log.time }}</div>
              <div class="log-ip">{{ log.ip }}</div>
              <div class="log-detail">{{ log.detail }}</div>
              <div class="log-status">{{ log.status }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 底部趋势图 -->
    <div class="trend-chart">
      <h3>近24小时封禁情况</h3>
      <canvas ref="trendChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const dateRange = ref([new Date('2025-02-24 20:02:48'), new Date('2025-02-25 20:02:48')])
const regionChart = ref(null)
const assetChart = ref(null)
const trendChart = ref(null)

const logList = ref([
  {
    time: '2025-02-25 17:50:14',
    ip: '211.196.31.2(韩国)',
    detail: 'SSH暴力',
    status: '已封禁'
  },
  {
    time: '2025-02-25 17:51:28',
    ip: '202.4.196.160(香港)',
    detail: 'SSH暴力',
    status: '已封禁'
  }
])

onMounted(() => {
  // 初始化攻击地区排名图表
  new Chart(regionChart.value, {
    type: 'bar',
    data: {
      labels: ['新加坡/新加坡', '中国', '韩国', '伊拉克/巴格达', '中国/深圳', '俄罗斯/莫斯科', '韩国/水原市', '泰古尔', '圣基茨和尼维斯', '香港'],
      datasets: [{
        data: [2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
        backgroundColor: '#409EFF'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })

  // 初始化24小时趋势图
  new Chart(trendChart.value, {
    type: 'line',
    data: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [{
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 14, 4, 1, 0],
        fill: true,
        backgroundColor: 'rgba(64, 158, 255, 0.2)',
        borderColor: '#409EFF'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  color: #333;
}

.chart-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.map-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  height: 600px;
}

.realtime-log {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  height: 600px;
  overflow-y: auto;
}

.log-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.log-time {
  color: #666;
  font-size: 12px;
}

.log-ip {
  color: #333;
  margin: 5px 0;
}

.log-detail {
  color: #409EFF;
}

.log-status {
  color: #67C23A;
}

.trend-chart {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
}

h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 16px;
}
</style>
