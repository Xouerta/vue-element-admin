<template>
  <div class="alert-list">
    <!-- 搜索过滤区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.timeRange"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="IP">
          <el-input v-model="filterForm.ip" placeholder="请输入IP" />
        </el-form-item>
        <el-form-item label="地理位置">
          <el-input v-model="filterForm.location" placeholder="请输入地理位置" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 告警列表表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column prop="alertTime" label="告警时间" width="180" />
      <el-table-column prop="ip" label="IP" width="150" />
      <el-table-column prop="location" label="地理位置" width="150" />
      <el-table-column prop="alertDevice" label="告警设备" width="120" />
      <el-table-column prop="alertType" label="告警详情" width="120">
        <template #default="scope">
          <el-tag size="small">{{ scope.row.alertType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="targetAsset" label="被攻击资产" width="120">
        <template #default="scope">
          <el-tag type="warning" size="small">{{ scope.row.targetAsset }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="blockStatus" label="封禁状态" width="120">
        <template #default="scope">
          <el-tag type="success" size="small">{{ scope.row.blockStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="判定原因" width="120">
        <template #default="scope">
          <el-tag type="info" size="small">{{ scope.row.reason }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 过滤表单数据
const filterForm = reactive({
  timeRange: [],
  ip: '',
  location: ''
})

// 表格数据
const tableData = ref([
  {
    alertTime: '2025-02-20 14:48:23',
    ip: '213.55.85.202',
    location: '埃塞俄比亚/哈尔格尔',
    alertDevice: 'hfish',
    alertType: 'SSH暴力',
    targetAsset: '蜜罐',
    blockStatus: '已封禁',
    reason: '已封禁'
  },
  {
    alertTime: '2025-02-20 14:48:23',
    ip: '61.15.25.138',
    location: '香港',
    alertDevice: 'hfish',
    alertType: 'SSH暴力',
    targetAsset: '蜜罐',
    blockStatus: '已封禁',
    reason: '已封禁'
  },
  // ... 更多数据
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 搜索方法
const handleSearch = () => {
  // 实现搜索逻辑
  console.log('搜索条件：', filterForm)
}

// 重置表单
const resetForm = () => {
  filterForm.timeRange = []
  filterForm.ip = ''
  filterForm.location = ''
}

// 分页方法
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`)
}

const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`)
}
</script>

<style scoped>
.alert-list {
  padding: 20px;
}

.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  margin-top: 20px;
}

:deep(.el-tag) {
  width: 100%;
  text-align: center;
}
</style>
