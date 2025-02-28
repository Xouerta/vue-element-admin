<template>
  <div class="whitelist-container">
    <!-- 顶部操作区 -->
    <div class="operation-area">
      <el-button
        type="primary"
        size="small"
        plain
        @click="handleAddClick"
        style="padding: 8px 20px;"
      >
        <i class="el-icon-plus" style="margin-right: 4px;"></i>
        添加白名单
      </el-button>
      <div class="search-area">
        <el-input
          v-model="searchIP"
          placeholder="IP"
          size="small"
          style="width: 200px; background-color: #f5f7fa;"
        >
          <template slot="prepend">
            <i class="el-icon-search" style="color: #909399;"></i>
          </template>
        </el-input>
        <el-input
          v-model="searchType"
          placeholder="类别"
          size="small"
          style="width: 200px; margin-left: 10px; background-color: #f5f7fa;"
        >
          <template slot="prepend">
            <i class="el-icon-search" style="color: #909399;"></i>
          </template>
        </el-input>
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleSearch"
          style="margin-left: 8px;"
        >
          搜索
        </el-button>
      </div>
      <div class="right-buttons">
        <el-tooltip content="批量启用" placement="top" :enterable="false">
          <el-button
            icon="el-icon-check"
            circle
            size="small"
            @click="handleBatchEnable"
          ></el-button>
        </el-tooltip>
        <el-tooltip content="批量禁用" placement="top" :enterable="false">
          <el-button
            icon="el-icon-close"
            circle
            size="small"
            @click="handleBatchDisable"
          ></el-button>
        </el-tooltip>
        <el-tooltip content="批量删除" placement="top" :enterable="false">
          <el-button
            icon="el-icon-delete"
            circle
            size="small"
            @click="handleBatchDelete"
          ></el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-wrapper">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="IP / Cidr" prop="ip"></el-table-column>
        <el-table-column label="类别" prop="type"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="过期时间" prop="expireTime"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              :type="scope.row.status === 0 ? 'success' : 'danger'"
              @click="handleStatusChange(scope.row)"
            >
              {{ scope.row.status === 0 ? '启用' : '禁用' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" :enterable="false">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                class="delete-btn"
                @click="handleDelete(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
import { mapActions, mapState } from 'vuex'


export default {
  name: 'WhitelistManagement',
  computed: {
    ...mapState({
      tableData: state => state.whiteLists.tableData,
      storeTotal: state => state.whiteList.total
    })
  },
  watch: {
    storeTotal: {
      handler(newVal) {
        this.total = newVal
      },
      immediate: true
    }
  },
  data() {
    return {
      searchIP: '',
      searchType: '',
      editDialogVisible: false,
      addDialogVisible: false,
      currentWhitelist: {},
      selectedRows: [],
      currentPage: 1,
      pageSize: 50,
      total: 0
    }
  },
  created() {
    console.log('Store state:', this.$store.state)  // 查看整个 store 状态
    console.log('WhiteList module:', this.$store.state.whiteList)  // 查看 whiteList 模块状态
    this.fetchData()
  },
  methods: {
    ...mapActions({
      fetchTableData: 'whiteLists/fetchTableData',
      updateWhitelist: 'whiteLists/updateWhitelist',
      deleteWhitelist: 'whiteLists/deleteWhitelist',
      addWhitelist: 'whiteLists/addWhitelist',
      batchEnable: 'whiteLists/batchEnable',
      batchDisable: 'whiteLists/batchDisable',
      batchDelete: 'whiteLists/batchDelete'
    }),

    async fetchData() {
      try {
        await this.fetchTableData({
          page: this.currentPage,
          pageSize: this.pageSize,
          ip: this.searchIP,
          type: this.searchType
        })
      } catch (error) {
        console.error('获取数据失败:', error)
        this.$message.error('获取数据失败')
      }
    },

    handleStatusChange(row) {
      const newStatus = row.status === 0 ? 1 : 0
      const updatedRow = { ...row, status: newStatus }

      this.updateWhitelist(updatedRow).then(() => {
        row.status = newStatus
        this.$message.success('状态更新成功')
      }).catch(() => {
        this.$message.error('状态更新失败')
      })
    },

    handleDelete(row) {
      this.$confirm('确认删除该白名单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteWhitelist(row.ip).then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => {})
    },

    handleBatchEnable() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要启用的白名单')
        return
      }
      this.$confirm(`确认启用选中的 ${this.selectedRows.length} 个白名单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ips = this.selectedRows.map(row => row.ip)
        this.batchEnable(ips).then(() => {
          this.$message.success('批量启用成功')
        }).catch(() => {
          this.$message.error('批量启用失败')
        })
      }).catch(() => {})
    },

    handleBatchDisable() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要禁用的白名单')
        return
      }
      this.$confirm(`确认禁用选中的 ${this.selectedRows.length} 个白名单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ips = this.selectedRows.map(row => row.ip)
        this.batchDisable(ips).then(() => {
          this.$message.success('批量禁用成功')
        }).catch(() => {
          this.$message.error('批量禁用失败')
        })
      }).catch(() => {})
    },

    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的白名单')
        return
      }
      this.$confirm(`确认删除选中的 ${this.selectedRows.length} 个白名单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ips = this.selectedRows.map(row => row.ip)
        this.batchDelete(ips).then(() => {
          this.$message.success('批量删除成功')
        }).catch(() => {
          this.$message.error('批量删除失败')
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.whitelist-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
}

.operation-area {
  flex: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-area {
  position: absolute;
  left: 15%;
}

.right-buttons {
  display: flex;
  gap: 10px;
}

.table-wrapper {
  flex: 1;
  overflow: hidden;
}

.pagination-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  background-color: #fff;
  overflow: hidden;
}

.delete-btn {
  color: #F56C6C;
}

.search-area :deep(.el-input__inner) {
  background-color: #f5f7fa;
  border: none;
  padding-left: 30px;
}

.search-area :deep(.el-input__prefix) {
  left: 10px;
}

.search-area :deep(.el-input) {
  border-radius: 4px;
  overflow: hidden;
}
</style>
