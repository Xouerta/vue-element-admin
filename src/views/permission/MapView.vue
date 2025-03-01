<template>
  <div class="attack-dashboard">
    <!-- 顶部时间选择器 -->
    <div class="header">
      <div class="title">全球攻击态势大屏</div>
      <div class="time-picker">
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-time="defaultTime"
          @change="handleTimeChange"
        />
        <el-button-group>
          <el-button icon="Refresh" circle @click="refreshData"/>
          <el-button icon="FullScreen" circle @click="toggleFullScreen"/>
        </el-button-group>
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧图表 -->
      <div class="left-charts">
        <div class="chart-box">
          <h3>攻击地区排名</h3>
          <div ref="regionChart" class="chart"></div>
        </div>
        <div class="chart-box">
          <h3>被攻击资产排名</h3>
          <div ref="assetChart" class="chart"></div>
        </div>
        <div class="chart-box">
          <h3>近24小时封禁情况</h3>
          <div ref="hourlyChart" class="chart"></div>
        </div>
      </div>

      <!-- 中间地图 -->
      <div class="center-map">
        <div ref="worldMap" class="world-map"></div>
      </div>

      <!-- 右侧实时流水 -->
      <div class="right-panel">
        <h3>实时处置流水</h3>
        <div class="log-list">
          <div v-for="(log, index) in realtimeLogs" :key="index" class="log-item">
            <div class="log-row">
              <span class="label">告警详情</span>
              <span class="value">{{ log.alertType }}</span>
            </div>
            <div class="log-row">
              <span class="label">封禁状态</span>
              <span class="value">{{ log.status }}</span>
            </div>
            <div class="log-row">
              <span class="label">时间</span>
              <span class="value">{{ log.time }}</span>
            </div>
            <div class="log-row">
              <span class="label">IP</span>
              <span class="value">{{ log.ip }}</span>
            </div>
            <div class="log-row">
              <span class="label">告警详情</span>
              <span class="value">{{ log.alertDetail }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/map/js/world'

export default {
  data() {
    return {
      timeRange: [
        new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
        new Date()
      ],
      defaultTime: [
        new Date(2000, 1, 1, 0, 0, 0),
        new Date(2000, 1, 1, 23, 59, 59)
      ],
      regionChart: null,
      assetChart: null,
      hourlyChart: null,
      worldMapChart: null,
      realtimeLogs: [
        {
          alertType: 'SSH暴破',
          status: '截过',
          time: '2025-02-26 21:29:00',
          ip: '103.245.26.5(印度尼西亚)',
          alertDetail: 'TCP端口监听'
        }
        // ... 更多日志数据
      ]
    }
  },
  methods: {
    initRegionChart() {
      this.regionChart = echarts.init(this.$refs.regionChart)
      const option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['中国', '美国', '印度', '俄罗斯']
        },
        series: [{
          type: 'bar',
          data: [320, 302, 301, 334],
          itemStyle: {
            color: '#409EFF'
          }
        }]
      }
      this.regionChart.setOption(option)
    },
    initAssetChart() {
      this.assetChart = echarts.init(this.$refs.assetChart)
      const option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['蜜罐', '防火墙', 'Web服务器', '数据库']
        },
        series: [{
          type: 'bar',
          data: [120, 200, 150, 80],
          itemStyle: {
            color: '#67C23A'
          }
        }]
      }
      this.assetChart.setOption(option)
    },
    initHourlyChart() {
      this.hourlyChart = echarts.init(this.$refs.hourlyChart)
      const option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: Array.from({ length: 24 }, (_, i) => `${i}:00`)
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: Array(24).fill(0).map(() => Math.round(Math.random() * 10)),
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.3
          },
          itemStyle: {
            color: '#E6A23C'
          }
        }]
      }
      this.hourlyChart.setOption(option)
    },
    initWorldMap() {
      this.worldMapChart = echarts.init(this.$refs.worldMap)
      const option = {
        backgroundColor: 'transparent',
        geo: {
          map: 'world',
          roam: true,
          itemStyle: {
            areaColor: '#323c48',
            borderColor: '#404a59'
          },
          emphasis: {
            itemStyle: {
              areaColor: '#2a333d'
            }
          }
        },
        series: [{
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [],
          symbolSize: 12,
          itemStyle: {
            color: '#F56C6C'
          },
          emphasis: {
            scale: true
          }
        }]
      }
      this.worldMapChart.setOption(option)
    },
    handleTimeChange() {
      // 实现时间变化后的数据更新逻辑
    },
    refreshData() {
      // 实现数据刷新逻辑
    },
    toggleFullScreen() {
      const element = document.documentElement
      if (!document.fullscreenElement) {
        element.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    },
    handleResize() {
      this.regionChart?.resize()
      this.assetChart?.resize()
      this.hourlyChart?.resize()
      this.worldMapChart?.resize()
    }
  },
  mounted() {
    this.initRegionChart()
    this.initAssetChart()
    this.initHourlyChart()
    this.initWorldMap()

    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    this.regionChart?.dispose()
    this.assetChart?.dispose()
    this.hourlyChart?.dispose()
    this.worldMapChart?.dispose()
  }
}
</script>

<style scoped>
.attack-dashboard {
  height: 100vh;
  background: #1b1b1b;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.time-picker {
  display: flex;
  gap: 10px;
}

.main-content {
  display: flex;
  height: calc(100% - 80px);
  gap: 20px;
}

.left-charts {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-box {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 4px;
}

.chart {
  height: calc(100% - 30px);
}

.center-map {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.world-map {
  height: 100%;
}

.right-panel {
  width: 300px;
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 4px;
  overflow-y: auto;
}

.log-list {
  margin-top: 10px;
}

.log-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.log-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.label {
  color: #909399;
}

.value {
  color: #E6A23C;
}

h3 {
  margin: 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #909399;
}

:deep(.el-date-editor) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.el-button) {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
}
</style>
