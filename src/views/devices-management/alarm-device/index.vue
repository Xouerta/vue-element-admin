<template>
  <div class="device-container">
    <!-- 顶部操作区 -->
    <div class="operation-area">
      <el-button type="primary" size="small" @click="handleAddDevice">
        + 添加告警设备
      </el-button>
      <div class="search-area">
        <el-input
          v-model="searchQuery"
          placeholder="设备名称"
          size="small"
          style="width: 200px"
        />
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
      </div>
      <div class="right-buttons">
        <el-button icon="el-icon-refresh" circle size="small" />
        <el-button icon="el-icon-setting" circle size="small" />
        <el-button icon="el-icon-delete" circle size="small" />
      </div>
    </div>

    <AddDeviceDialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      @submit="handleAddSubmit"
      @close="handleDialogClose"
    />

    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="false" key="id" />
      <el-table-column label="设备名称" prop="deviceName" />
      <el-table-column label="Key" prop="key" />
      <el-table-column label="连接" prop="connection">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.connection === '空闲'" size="small" type="danger">
            {{ scope.row.connection }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '应用'" size="small" type="success">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="操作" width="150">
        <template>
          <el-button type="text" size="small" icon="el-icon-edit" />
          <el-button type="text" size="small" icon="el-icon-delete" class="delete-btn" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <span>共 {{ total }} 条</span>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[20, 50, 100]"
        :page-size="50"
        layout="prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import AddDeviceDialog from '@/views/devices-management/components/AddDeviceDialog.vue'

export default {
  name: 'DeviceManagement',
  components: { AddDeviceDialog },
  data() {
    return {
      dialogVisible: false,
      searchQuery: '',
      tableData: [
        {
          id: 1,
          deviceName: '长亭雷池',
          key: 'sk-*****rwS',
          connection: '空闲',
          status: '应用',
          remark: 'sk-TnBYAIOJj84ERrwS'
        },
        {
          id: 2,
          deviceName: 'hfish',
          key: 'sk-*****6Td',
          connection: '空闲',
          status: '应用',
          remark: 'sk-2iLE1VgoDMkl56Td'
        }
      ],
      currentPage: 1,
      total: 2,
      selectedRows: []
    }
  },
  methods: {
    handleSearch() {
      // 处理搜索逻辑
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    handleSizeChange(val) {
      // 处理每页显示数量变化
    },
    handleCurrentChange(val) {
      // 处理页码变化
    },
    handleAddDevice() {
      this.dialogVisible = true
    },

    // 处理设备添加提交
    handleAddSubmit(formData) {
      console.log('提交的数据：', formData)
      this.tableData.push({
        deviceName: formData.name,
        remark: formData.remark
      })

      this.$message.success('添加成功')
    },

    // 处理对话框关闭
    handleDialogClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.device-container {
  padding: 20px;
  background-color: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
}

.operation-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-area {
  left: 10%;
  position: absolute;
}

.right-buttons {
  display: flex;
  gap: 10px;
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
  margin-right: 10px;
  color: #606266;
}

.delete-btn {
  color: #F56C6C;
}
</style>
