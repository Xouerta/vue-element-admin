<template>
  <div class="ban-list-log">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchForm.ip"
        placeholder="IP"
        style="width: 200px"
      />
      <el-input
        v-model="searchForm.source"
        placeholder="来源"
        style="width: 200px"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      height="70vh"
    >
      <el-table-column prop="ip" label="IP / Cidr" min-width="150"/>
      <el-table-column prop="source" label="来源" width="120" />
      <el-table-column prop="targetAsset" label="被攻击资产" width="120" />
      <el-table-column prop="attackType" label="攻击方式" width="150"/>
      <el-table-column prop="remark" label="备注" min-width="150"/>
      <el-table-column prop="updateTime" label="变更时间" width="180"/>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="getStatusType(scope.row.status)"
            size="small"
          >
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination">
      <span>共 {{ total }} 条</span>
      <el-pagination
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <span>前往</span>
    </div>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import axios from 'axios'

export default {
  data() {
    return {
      searchForm: {
        ip: '',
        source: ''
      },
      tableData: [],
      loading: false,
      total: 0,
      currentPage: 1,
      pageSize: 50
    }
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        '添加': 'success',
        '手动启用': 'primary',
        '删除': 'danger'
      }
      return statusMap[status] || 'info'
    },
    async handleSearch() {
      this.loading = true
      try {
        const response = await axios.get('/banlistlog', {
          params: {
            ...this.searchForm,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        })

        if (response.data.success) {
          this.tableData = response.data.data
          this.total = response.data.total
        } else {
          Message.error(response.data.message || '查询失败')
        }
      } catch (error) {
        Message.error('服务器错误，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.handleSearch()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.handleSearch()
    }
  },
  mounted() {
    this.handleSearch()
  }
}
</script>

<style scoped>
.ban-list-log {
  padding: 20px;
  height: 70vh;
}

.search-area {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
}

:deep(.el-table) {
  margin-top: 20px;
}

:deep(.el-input__wrapper) {
  border-radius: 2px;
}

:deep(.el-button) {
  border-radius: 2px;
}

/* 表格hover效果 */
:deep(.el-table__row:hover) {
  background-color: #f5f7fa !important;
}

/* 表格头部样式 */
:deep(.el-table__header) {
  background-color: #f5f7fa;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 500;
}

/* 分页器样式 */
:deep(.el-pagination) {
  justify-content: center;
}

/* 标签样式 */
:deep(.el-tag) {
  border-radius: 2px;
}
</style>
