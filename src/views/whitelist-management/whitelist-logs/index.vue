<template>
  <div class="whitelist-logs-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchIP"
        placeholder="IP"
        size="small"
        style="width: 200px; margin-right: 10px;"
      >
        <template slot="prepend">
          <i class="el-icon-search"></i>
        </template>
      </el-input>
      <el-input
        v-model="searchType"
        placeholder="类别"
        size="small"
        style="width: 200px; margin-right: 10px;"
      >
        <template slot="prepend">
          <i class="el-icon-search"></i>
        </template>
      </el-input>
      <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 表格区域 -->
      <el-table
        border
        :data="tableData"
        style="width: 100%;"
        height="70vh"
        :loading="loading"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align': 'center'}"
      >
        <el-table-column label="IP / Cidr" prop="ip" min-width="150"></el-table-column>
        <el-table-column label="类别" prop="category" min-width="120"></el-table-column>
        <el-table-column label="备注" prop="note" min-width="200"></el-table-column>
        <el-table-column label="变更时间" prop="time" min-width="180">
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.time) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 'add' ? 'success' : 'danger'" size="small">
              {{ scope.row.status === 'add' ? '添加' : '删除' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <span>共 {{ total }} 条</span>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        small
      >
      </el-pagination>
      <el-select v-model="pageSize" size="small" style="width: 110px">
        <el-option
          v-for="size in [10, 20, 50]"
          :key="size"
          :label="`${size}条/页`"
          :value="size"
        >
        </el-option>
      </el-select>
      <el-button size="small" plain>前往</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: "WhitelistLogs",
  computed: {
    ...mapState({
      tableData: state => state.whiteListLogs.tableData,
      loading: state => state.whiteListLogs.loading,
      storeTotal: state => state.whiteListLogs.total
    })
  },
  watch: {
    storeTotal: {
      handler(newVal) {
        this.total = newVal
      },
      immediate: true
    },
    pageSize: {
      async handler(newVal) {
        await this.fetchData({
          page: newVal,
          size: this.pageSize
        })
      },
      immediate: true
    }
  },
  data() {
    return {
      searchIP: '',
      searchType: '',
      currentPage: 1,
      pageSize: 50,
      total: 0
    }
  },
  methods: {
    ...mapActions({
      fetchTableData: 'whiteListLogs/fetchTableData'
    }),

    formatTimestamp(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    handleSearch() {
      this.currentPage = 1
      this.fetchData()
    },

    handleCurrentChange(val) {
      console.log('当前页码：', val)
      this.currentPage = val
      this.fetchData()
    },

    async handleSizeChange(val) {
      this.pageSize = val
      // 重置为第一页
      this.currentPage = 1
      await this.fetchData()
    },

    async fetchData() {
      try {
        console.log(this.currentPage)
        await this.fetchTableData({
          page: this.currentPage,
          pageSize: this.pageSize,
          ip: this.searchIP,
          type: this.searchType
        })
        if (this.tableData.length === 0 && this.currentPage > 1) {
          this.currentPage--
          await this.fetchData()
        }
      } catch (error) {
        console.error('获取数据失败:', error)
        this.$message.error('获取数据失败')
      }
    }
  },
  created() {
    // this.fetchData()
  }
}
</script>

<style scoped>
.whitelist-logs-container {
  height: 100%;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
  position: relative;
}

.search-area {
  flex: none;
  margin-bottom: 15px;
}

.pagination-container {
  position: relative;
  justify-content: flex-end;
  display: flex;
  align-items: center;
  background-color: #fff;
  z-index: 1;
}

.pagination-container span {
  color: #606266;
  font-size: 13px;
}

</style>
