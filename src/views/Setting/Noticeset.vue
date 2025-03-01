<template>
  <div class="notice-management">
    <!-- 顶部操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加通知
      </el-button>

      <div class="batch-operations">
        <el-button
          type="primary"
          plain
          :disabled="!selectedItems.length"
          @click="handleBatchEnable"
        >
          <el-icon><Select /></el-icon>
        </el-button>
        <el-button
          type="primary"
          plain
          :disabled="!selectedItems.length"
          @click="handleBatchRefresh"
        >
          <el-icon><RefreshRight /></el-icon>
        </el-button>
        <el-button
          type="danger"
          plain
          :disabled="!selectedItems.length"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 通知列表 -->
    <el-table
      :data="noticeList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="通知名称" min-width="180" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="status" label="状态" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.status === '启用' ? 'success' : 'info'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="interval" label="间隔" width="120" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination">
      <span>共 {{ total }} 条</span>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <span>前往</span>
    </div>

    <!-- 添加/编辑通知弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加通知' : '编辑通知'"
      width="500px"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="通知名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入通知名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="邮件" value="email" />
            <el-option label="钉钉" value="dingtalk" />
            <el-option label="企业微信" value="wecom" />
          </el-select>
        </el-form-item>
        <el-form-item label="通知间隔" prop="interval">
          <el-input-number v-model="formData.interval" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            active-value="启用"
            inactive-value="禁用"
          />
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
import { Plus, Select, RefreshRight, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

// 表格数据
const noticeList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(50)
const selectedItems = ref([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const formData = reactive({
  name: '',
  type: '',
  interval: 0,
  status: '启用'
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入通知名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择通知类型', trigger: 'change' }
  ]
}

// 获取通知列表
const getNoticeList = async () => {
  try {
    const response = await axios.get('/noticeset', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })
    if (response.data.success) {
      noticeList.value = response.data.list
      total.value = response.data.total
    }
  } catch (error) {
    ElMessage.error('获取通知列表失败')
  }
}

// 添加通知
const handleAdd = () => {
  dialogType.value = 'add'
  formData.name = ''
  formData.type = ''
  formData.interval = 0
  formData.status = '启用'
  dialogVisible.value = true
}

// 编辑通知
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除通知
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除通知 ${row.name} 吗？`, '提示')
    const response = await axios.delete(`/noticeset/${row.id}`)
    if (response.data.success) {
      ElMessage.success('删除成功')
      getNoticeList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const url = dialogType.value === 'add' ? '/noticeset' : `/noticeset/${formData.id}`
        const method = dialogType.value === 'add' ? 'post' : 'put'
        const response = await axios[method](url, formData)

        if (response.data.success) {
          ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
          dialogVisible.value = false
          getNoticeList()
        }
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '添加失败' : '更新失败')
      }
    }
  })
}

// 批量操作相关
const handleSelectionChange = (selection) => {
  selectedItems.value = selection
}

const handleBatchEnable = async () => {
  try {
    await axios.post('/noticeset/batch/enable', {
      ids: selectedItems.value.map(item => item.id)
    })
    ElMessage.success('批量启用成功')
    getNoticeList()
  } catch (error) {
    ElMessage.error('批量启用失败')
  }
}

const handleBatchRefresh = async () => {
  try {
    await axios.post('/noticeset/batch/refresh', {
      ids: selectedItems.value.map(item => item.id)
    })
    ElMessage.success('批量刷新成功')
    getNoticeList()
  } catch (error) {
    ElMessage.error('批量刷新失败')
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedItems.value.length} 条通知吗？`, '提示')
    await axios.post('/noticeset/batch/delete', {
      ids: selectedItems.value.map(item => item.id)
    })
    ElMessage.success('批量删除成功')
    getNoticeList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val
  getNoticeList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getNoticeList()
}

// 初始加载
getNoticeList()
</script>

<style scoped>
.notice-management {
  padding: 20px;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.batch-operations {
  display: flex;
  gap: 10px;
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
</style>
