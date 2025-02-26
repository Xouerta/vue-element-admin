<template>
  <div class="device-container">
    <!-- 顶部操作区 -->
    <div class="operation-area">
      <el-button type="primary" size="small" @click="handleAddClick">
        + 添加告警设备
      </el-button>
      <div class="search-area">
        <el-input
          v-model="searchQuery"
          placeholder="设备名称"
          size="small"
          style="width: 200px"
        >
        </el-input>
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
      </div>
      <div class="right-buttons">
        <el-tooltip content="刷新" placement="top" :enterable="false">
          <el-button
            icon="el-icon-refresh"
            circle
            size="small"
            @click="fetchTableData"
          ></el-button>
        </el-tooltip>
        <el-tooltip content="设置" placement="top" :enterable="false">
          <el-button icon="el-icon-setting" circle size="small"></el-button>
        </el-tooltip>
        <el-tooltip content="删除" placement="top" :enterable="false">
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
        <el-table-column label="设备名称" prop="deviceName"></el-table-column>
        <el-table-column label="Key" prop="key"></el-table-column>
        <el-table-column label="连接" prop="connection">
          <template slot-scope="scope">
            <el-tag size="small" type="danger" v-if="scope.row.connection === '空闲'">
              {{ scope.row.connection }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.status === '应用'">
              {{ scope.row.status }}
            </el-tag>
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
        :page-sizes="[50]"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        small
      >
      </el-pagination>
      <el-select v-model="pageSize" size="small" style="width: 110px">
        <el-option
          v-for="size in [50]"
          :key="size"
          :label="`${size}条/页`"
          :value="size"
        >
        </el-option>
      </el-select>
      <el-button size="small" plain>前往</el-button>
    </div>

    <!-- 添加/编辑设备对话框 -->
    <edit-device-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :device-data="currentDevice"
      @submit="handleDialogSubmit"
      @close="handleDialogClose"
    />
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import EditDeviceDialog from '@/views/devices-management/components/EditDeviceDialog.vue'

export default {
  name: 'DeviceManagement',
  components: {
    EditDeviceDialog
  },
  computed: {
    ...mapState({
      tableData: state => state.devices.tableData
    })
  },
  data() {
    return {
      searchQuery: '',
      dialogVisible: false,
      currentDevice: {},
      selectedRows: [],
      currentPage: 1,
      pageSize: 50,
      total: 0
    }
  },
  created() {
    this.fetchTableData()
  },
  methods: {
    ...mapActions({
      fetchTableData: 'devices/fetchTableData',
      updateDevice: 'devices/updateDevice',
      deleteDevice: 'devices/deleteDevice',
      addDevice: 'devices/addDevice'
    }),

    // 处理添加按钮点击
    handleAddClick() {
      this.currentDevice = {}
      this.dialogVisible = true
    },

    // 处理编辑按钮点击
    handleEdit(row) {
      this.currentDevice = {...row}
      this.dialogVisible = true
    },

    // 处理对话框提交
    handleDialogSubmit(formData) {
      if (this.currentDevice.deviceName) {
        // 编辑模式
        this.updateDevice(formData).then(() => {
          console.log(this.tableData)
          this.$message.success('编辑成功')
          this.dialogVisible = false
        })
      } else {
        // 添加模式
        this.addDevice(formData).then(() => {
          this.$message.success('添加成功')
          this.dialogVisible = false
        })
      }
    },

    // 处理对话框关闭
    handleDialogClose() {
      this.dialogVisible = false
      this.currentDevice = {}
    },

    // 处理删除
    handleDelete(row) {
      this.$confirm('确认删除该设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteDevice(row.deviceName).then(() => {
          this.$message.success('删除成功')
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
        })
      }).catch(() => {
      })
    },

    // 处理表格选择
    handleSelectionChange(val) {
      this.selectedRows = val
    },

    // 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.fetchTableData()
    },

    // 处理页码改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchTableData()
    },

    // 处理每页条数改变
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.fetchTableData()
    }
  }
}
</script>

<style scoped>
.device-container {
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
  flex: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
  border-top: 1px solid #EBEEF5;
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


</style>
