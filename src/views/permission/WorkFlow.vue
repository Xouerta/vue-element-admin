<template>
  <div class="dashboard">
    <!-- 欢迎信息 -->
    <div class="welcome">
      欢迎回来！funnet
    </div>

    <!-- 统计卡片 -->
    <div class="stat-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-title">今日封禁</div>
            <div class="stat-value warning">{{ dashboardData.DayBlock }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-title">总封禁</div>
            <div class="stat-value info">{{ dashboardData.TotalBlock }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-title">白名单</div>
            <div class="stat-value primary">{{ dashboardData.WhitelistCount }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-title">设备</div>
            <div class="stat-value success">{{ dashboardData.Devices }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 时间选择和导出按钮 -->
    <div class="time-filter">
      <el-date-picker
        v-model="timeRange"
        type="datetimerange"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      />
      <el-button type="primary">
        <i class="el-icon-download"></i>
        导出数据报告
      </el-button>
    </div>

    <!-- 图表区域 -->
    <el-row :gutter="20">
      <el-col :span="16">
        <!-- 被攻击地区排名 -->
        <div class="chart-container">
          <h3>被攻击地区排名</h3>
          <div ref="areaChartRef" style="height: 300px"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <!-- 实时处置流水 -->
        <div class="log-container">
          <h3>实时处置流水</h3>
          <div class="log-list">
            <div v-for="(log, index) in logList" :key="index" class="log-item">
              <div class="log-time">{{ log.time }}</div>
              <div class="log-ip">IP：{{ log.ip }}</div>
              <div class="log-type">{{ log.type }}</div>
              <div class="log-status">{{ log.status }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 趋势图 -->
    <div class="trend-charts">
      <div class="chart-container">
        <h3>近24小时封禁情况</h3>
        <div ref="hourlyChartRef" style="height: 200px"></div>
      </div>

      <div class="chart-container">
        <h3>近7日封禁情况</h3>
        <div ref="dailyChartRef" style="height: 200px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { dashboardApi, DashboardSocket } from '@/api/dashboard'

export default {
  data() {
    return {
      timeRange: [],
      areaChartRef: null,
      hourlyChartRef: null,
      dailyChartRef: null,
      logList: [],
      dashboardData: {
        DayBlock: 0,
        TotalBlock: 0,
        WhitelistCount: 0,
        Devices: 0,
        '24hBlock': 0,
        '7dayBlock': 0
      },
      socket: null
    }
  },
  methods: {
    initAreaChart() {
      this.areaChartRef = echarts.init(this.$refs.areaChartRef)
      const option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['北京', '上海', '广州', '深圳']
        },
        series: [
          {
            type: 'bar',
            data: [4, 3, 2, 1],
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      }
      this.areaChartRef.setOption(option)
    },
    initHourlyChart() {
      this.hourlyChartRef = echarts.init(this.$refs.hourlyChartRef)
      const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
      const option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: hours
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)),
            type: 'line',
            smooth: true,
            areaStyle: {
              opacity: 0.3
            },
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      }
      this.hourlyChartRef.setOption(option)
    },
    initDailyChart() {
      this.dailyChartRef = echarts.init(this.$refs.dailyChartRef)
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toLocaleDateString()
      }).reverse()

      const option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: days
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 20)),
            type: 'line',
            smooth: true,
            areaStyle: {
              opacity: 0.3
            },
            itemStyle: {
              color: '#67C23A'
            }
          }
        ]
      }
      this.dailyChartRef.setOption(option)
    },
    handleResize() {
      this.areaChartRef?.resize()
      this.hourlyChartRef?.resize()
      this.dailyChartRef?.resize()
    },
    async fetchDashboardData() {
      try {
        const dashboardData = await dashboardApi.getDashboardData()
        this.dashboardData = dashboardData
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    },
    async fetchWorkFlows() {
      try {
        const workFlows = await dashboardApi.getWorkFlows()
        this.logList = workFlows
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    },
    handleDataUpdate(data) {
      // 处理实时数据更新逻辑
      if (data.dashboardData) {
        this.dashboardData = data.dashboardData
      }
      if (data.workFlows) {
        this.logList = data.workFlows
      }
    }
  },
  async created() {
    await this.fetchDashboardData()
    await this.fetchWorkFlows()

    // 建立WebSocket连接
    this.socket = new DashboardSocket()
    await this.socket.connect()

    // 监听实时数据更新
    this.socket.on('data_update', (data) => {
      this.handleDataUpdate(data)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    this.areaChartRef?.dispose()
    this.hourlyChartRef?.dispose()
    this.dailyChartRef?.dispose()

    // 组件销毁时断开WebSocket连接
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}
</script>

<style scoped>
/* 保持原有样式 */
</style>
