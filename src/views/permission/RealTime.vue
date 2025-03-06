<template>
  <div class="alert-list">
    <!-- 列表区域 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
    >
      <!-- 告警时间 -->
      <el-table-column label="告警时间" width="180">
        <template slot-scope="scope">
          <div class="time-cell">
            <div class="label">告警时间</div>
            <div class="value">{{ scope.row.create_time }}</div>
          </div>
        </template>
      </el-table-column>

      <!-- IP -->
      <el-table-column label="IP" width="180">
        <template slot-scope="scope">
          <div class="ip-cell">
            <div class="label">IP</div>
            <div class="value">{{ scope.row.attack_ip }}</div>
          </div>
        </template>
      </el-table-column>

      <!-- 地理位置 -->
      <el-table-column label="地理位置" width="180">
        <template slot-scope="scope">
          <div class="location-cell">
            <div class="label">地理位置</div>
            <div class="value">{{ scope.row.location }}</div>
          </div>
        </template>
      </el-table-column>

      <!-- 告警设备 -->
      <el-table-column label="告警设备" width="120">
        <template slot-scope="scope">
          <div class="device-cell">
            <div class="label">告警设备</div>
            <div class="value">{{ scope.row.source }}</div>
          </div>
        </template>
      </el-table-column>

      <!-- 告警详情 -->
      <el-table-column label="告警详情" width="150">
        <template slot-scope="scope">
          <div class="detail-cell">
            <div class="label">告警详情</div>
            <div class="value">
              <el-tag size="small" type="warning">{{ scope.row.attack_method }}</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 被攻击资产 -->
      <el-table-column label="被攻击资产" width="150">
        <template slot-scope="scope">
          <div class="asset-cell">
            <div class="label">被攻击资产</div>
            <div class="value">{{ scope.row.attacked_asset }}</div>
          </div>
        </template>
      </el-table-column>

      <!-- 封禁状态 -->
      <el-table-column label="封禁状态" width="120">
        <template slot-scope="scope">
          <div class="status-cell">
            <div class="label">封禁状态</div>
            <div class="value">
              <el-tag size="small" type="success">已封禁</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 判定原因 -->
      <el-table-column label="判定原因" width="120">
        <template slot-scope="scope">
          <div class="reason-cell">
            <div class="label">判定原因</div>
            <div class="value">未知</div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { dashboardApi, DashboardSocket } from '@/api/dashboard'

export default {
  data() {
    return {
      tableData: [],
      loading: false,
      total: 0,
      currentPage: 1,
      pageSize: 20,
      socket: null
    }
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        const response = await dashboardApi.getWorkFlows({
          page: this.currentPage,
          pageSize: this.pageSize
        })
        this.tableData = response.data
        this.total = response.total
      } catch (error) {
        this.$message.error('获取数据失败')
      } finally {
        this.loading = false
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    handleDataUpdate(data) {
      // 处理实时数据更新逻辑
      if (data.workFlows) {
        this.tableData = data.workFlows
      }
    }
  },
  async created() {
    await this.getList()

    // 建立WebSocket连接
    this.socket = new DashboardSocket()
    await this.socket.connect()

    // 监听实时数据更新
    this.socket.on('data_update', (data) => {
      this.handleDataUpdate(data)
    })
  },
  beforeDestroy() {
    // 组件销毁时断开WebSocket连接
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}
</script>

<style scoped>
.alert-list {
  padding: 20px;
}

/* 单元格样式 */
.label {
  color: #909399;
  font-size: 12px;
  margin-bottom: 4px;
}

.value {
  color: #303133;
  font-size: 14px;
}

/* 分页器样式 */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 表格样式定制 */
.el-table {
  --el-table-border-color: #EBEEF5;
  --el-table-header-bg-color: #F5F7FA;
}

.el-table__row {
  background-color: transparent;
}

.el-table__row:hover {
  background-color: #F5F7FA;
}

.el-table td {
  padding: 12px 0;
}

/* 标签样式 */
.el-tag {
  border-radius: 2px;
}

/* 分页器样式 */
.el-pagination {
  --el-pagination-button-bg-color: transparent;
}

/* 加载状态样式 */
.el-loading-mask {
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
