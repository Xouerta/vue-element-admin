<template>
  <div class="device-container">
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
        添加封禁设备
      </el-button>
      <div class="search-area">
        <el-input
          v-model="searchQuery"
          placeholder="设备名称"
          size="small"
          style="width: 200px; background-color: #f5f7fa;"
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
      <div class="right-buttons" v-if="false">
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
        border
        :data="tableData"
        height="70vh"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align': 'center'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="设备名称" prop="name"></el-table-column>
        <el-table-column label="设备ip" prop="ip"></el-table-column>
        <el-table-column label="Key" prop="key"></el-table-column>
        <el-table-column label="连接" prop="connect">
          <template slot-scope="scope">
            <el-tag :type="scope.row.connect ? 'danger' : 'success'">
              {{ scope.row.connect ? '空闲' : '连接中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              :type="scope.row.status ? 'success' : 'danger'"
              @click="handleStatusChange(scope.row)"
            >
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="note"></el-table-column>
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
      <el-input v-model="gotoPage" size="small" style="width: 4rem"></el-input>
      <el-button size="small" plain @click="handleGoTo">前往</el-button>
    </div>

    <!-- 分开定义两个对话框 -->
    <edit-device-dialog
      v-if="editDialogVisible"
      :visible.sync="editDialogVisible"
      :device-data="currentDevice"
      :mode="false"
      @submit="handleEditSubmit"
      @close="handleEditClose"
    />
    <add-device-dialog
      v-if="addDialogVisible"
      :visible.sync="addDialogVisible"
      :mode="false"
      @submit="handleAddSubmit"
      @close="handleAddClose"
    />
  </div>
</template>

/*
* 设备管理页面
* 启用 0 禁用 1
*/
<script>
import {mapActions, mapState} from 'vuex'
import EditDeviceDialog from '@/views/devices-management/components/EditDeviceDialog.vue'
import AddDeviceDialog from "@/views/devices-management/components/AddDeviceDialog.vue";

export default {
  name: 'DeviceManagement',
  components: {
    AddDeviceDialog,
    EditDeviceDialog
  },
  computed: {
    ...mapState({
      tableData: state => state.bannedDevices.tableData,
      storeTotal: state => state.bannedDevices.total
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
      searchQuery: '',
      editDialogVisible: false,  // 编辑对话框
      addDialogVisible: false,   // 添加对话框
      currentDevice: {},
      selectedRows: [],
      currentPage: 1,
      pageSize: 50,
      total: 0,
      gotoPage: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    ...mapActions({
      fetchTableData: 'bannedDevices/fetchTableData',
      updateDevice: 'bannedDevices/updateDevice',
      deleteDevice: 'bannedDevices/deleteDevice',
      addDevice: 'bannedDevices/addDevice',
      deviceInfo: 'bannedDevices/deviceInfo'
    }),

    handleGoTo() {
      if (this.gotoPage > 0 && this.gotoPage <= this.total / this.pageSize) {
        this.currentPage = parseInt(this.gotoPage)
        this.fetchData()
      }
    },

    async fetchData() {
      try {
        await this.fetchTableData({
          page: this.currentPage,
          pageSize: this.pageSize,
          query: this.searchQuery
        })
        if (this.tableData.length === 0 && this.currentPage > 1) {
          this.currentPage--
          await this.fetchData()
        }
        this.$store.state.bannedDevices.tableData
          .map(row => {
            this.deviceInfo(row.name)
          })
      } catch (error) {
        console.error('获取数据失败:', error)
        this.$message.error('获取数据失败')
      }
    },

    // 处理添加按钮点击
    handleAddClick() {
      this.currentDevice = {}
      this.addDialogVisible = true
    },

    // 处理编辑按钮点击
    handleEdit(row) {
      this.currentDevice = {...row}
      this.editDialogVisible = true
    },

    // 处理添加对话框提交
    handleAddSubmit(formData) {
      this.addDevice(formData).then(() => {
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.fetchData() // 刷新数据
      }).catch(() => {
        this.$message.error('添加失败')
      })
    },

    // 处理编辑对话框提交
    handleEditSubmit(formData) {
      this.updateDevice(formData).then(() => {
        this.$message.success('编辑成功')
        this.editDialogVisible = false
        this.fetchData() // 刷新数据
      })
    },

    // 处理添加对话框关闭
    handleAddClose() {
      this.addDialogVisible = false
      this.currentDevice = {}
    },

    // 处理编辑对话框关闭
    handleEditClose() {
      this.editDialogVisible = false
      this.currentDevice = {}
    },

    // 处理删除
    handleDelete(row) {
      this.$confirm('确认删除该设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDevice(row.name).then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => {
      })
    },

    // 处理批量删除
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的设备')
        return
      }
      this.$confirm(`确认删除选中的 ${this.selectedRows.length} 个设备?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Promise.all(
          this.selectedRows.map(row => this.deleteDevice(row.deviceName))
        ).then(() => {
          this.$message.success('批量删除成功')
        }).catch(() => {})
      })
    },

    // 处理表格选择
    handleSelectionChange(val) {
      this.selectedRows = val
    },

    // 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.fetchData()
    },

    // 处理页码改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },

    // 处理每页条数改变
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.fetchData()
    },

    // 修改状态切换处理方法
    handleStatusChange(row) {
      // 切换状态值
      const newStatus = !row.status
      const updatedRow = { ...row, status: newStatus }

      this.updateDevice(updatedRow).then(() => {
        row.status = newStatus // 更新成功后修改状态
        this.$message.success('状态更新成功')
      }).catch(() => {
        this.$message.error('状态更新失败')
      })
    },

    // 处理批量启用
    handleBatchEnable() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要启用的设备')
        return
      }
      this.$confirm(`确认启用选中的 ${this.selectedRows.length} 个设备?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Promise.all(
          this.selectedRows.map(row => {
            const updatedRow = { ...row, status: 0 }
            return this.updateDevice(updatedRow)
          })
        ).then(() => {
          this.$message.success('批量启用成功')
          this.fetchData() // 刷新数据
        }).catch(() => {
          this.$message.error('批量启用失败')
        })
      }).catch(() => {})
    },

    // 处理批量禁用
    handleBatchDisable() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要禁用的设备')
        return
      }
      this.$confirm(`确认禁用选中的 ${this.selectedRows.length} 个设备?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Promise.all(
          this.selectedRows.map(row => {
            const updatedRow = { ...row, status: 1 }
            return this.updateDevice(updatedRow)
          })
        ).then(() => {
          this.$message.success('批量禁用成功')
          this.fetchData() // 刷新数据
        }).catch(() => {
          this.$message.error('批量禁用失败')
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.device-container {
  height: max-content;
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

.pagination-container span {
  color: #606266;
  font-size: 13px;
}

.delete-btn {
  color: #F56C6C;
}

:deep(.el-pagination) {
  .el-pager li {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
  }

  .btn-prev, .btn-next {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
  }
}

:deep(.el-select) {
  .el-input__inner {
    height: 28px;
    line-height: 28px;
  }
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
