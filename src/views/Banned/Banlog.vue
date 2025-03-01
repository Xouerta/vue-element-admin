<template>
  <div class="blocked-ip-list">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-button type="primary" @click="handleAddIP">
        <el-icon><Plus /></el-icon>
        封禁IP
      </el-button>

      <div class="search-inputs">
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
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
      </div>

      <div class="operation-buttons">
        <el-button type="primary" plain>
          <el-icon><Download /></el-icon>
        </el-button>
        <el-button type="primary" plain>
          <el-icon><RefreshRight /></el-icon>
        </el-button>
        <el-button type="primary" plain>
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="ip" label="攻击IP" width="180" />
      <el-table-column prop="source" label="来源" width="120" />
      <el-table-column prop="targetAsset" label="被攻击资产" width="120" />
      <el-table-column prop="attackType" label="攻击方式" width="120" />
      <el-table-column prop="location" label="地理位置" width="150" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="expireTime" label="过期时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === '生效中' ? 'success' : 'info'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="150" />
      <el-table-column label="操作" fixed="right" width="150">
        <template #default="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination">
      <div class="total-info">共 {{ total }} 条</div>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div class="refresh-text">刷新</div>
    </div>

    <!-- 添加/编辑IP弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加封禁IP' : '编辑封禁IP'"
      width="500px"
    >
      <el-form :model="formData" label-width="100px">
        <el-form-item label="IP地址">
          <el-input v-model="formData.ip" />
        </el-form-item>
        <el-form-item label="来源">
          <el-input v-model="formData.source" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus, Search, Download, RefreshRight, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  ip: '',
  source: ''
})

// 表格数据
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(50)

// 弹窗相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formData = reactive({
  ip: '',
  source: '',
  remark: ''
})

// 搜索方法
const handleSearch = () => {
  loading.value = true
  // 实现搜索逻辑
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

// 添加IP
const handleAddIP = () => {
  dialogType.value = 'add'
  formData.ip = ''
  formData.source = ''
  formData.remark = ''
  dialogVisible.value = true
}

// 编辑IP
const handleEdit = (row) => {
  dialogType.value = 'edit'
  formData.ip = row.ip
  formData.source = row.source
  formData.remark = row.remark
  dialogVisible.value = true
}

// 删除IP
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除IP ${row.ip} 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
  })
}

// 提交表单
const handleSubmit = () => {
  dialogVisible.value = false
  ElMessage({
    type: 'success',
    message: dialogType.value === 'add' ? '添加成功' : '修改成功',
  })
}

// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}
</script>

<style scoped>
.blocked-ip-list {
  padding: 20px;
}

.search-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-inputs {
  display: flex;
  gap: 10px;
}

.operation-buttons {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-info {
  color: #606266;
  font-size: 14px;
}

.refresh-text {
  color: #409EFF;
  cursor: pointer;
}

:deep(.el-table) {
  margin-top: 20px;
}

:deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
