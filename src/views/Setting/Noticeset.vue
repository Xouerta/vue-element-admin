<template>
  <div class="notice-management">
    <!-- 顶部操作栏 -->
    <div class="operation-bar">
      <div class="left-operations">
        <el-button type="primary" @click="handleAdd">
          <i class="el-icon-plus"></i>
          添加通知
        </el-button>
        <!-- 新增机器人状态显示 -->
        <el-tag class="ml-3" type="success" v-if="robotStatus">机器人已启用</el-tag>
        <el-tag class="ml-3" type="info" v-else>机器人未启用</el-tag>
      </div>

      <div class="right-operations">
        <el-button type="primary" @click="toggleBatchMode">
          {{ isBatchMode ? '退出批量管理' : '批量管理' }}
        </el-button>
        <template v-if="isBatchMode">
          <el-button type="primary" @click="handleBatchAdd">批量添加</el-button>
          <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
        </template>
        <!-- 新增获取日报按钮 -->
        <el-button type="primary" @click="handleGetReport">获取日报总结</el-button>
      </div>
    </div>

    <!-- 通知列表 -->
    <el-table
      :data="noticeList" style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        v-if="isBatchMode"
      />
      <el-table-column prop="type" label="通知类型" width="120">
        <template #default="scope">
          <el-tag>{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="target" label="通知目标" width="180"/>
      <el-table-column prop="createTime" label="创建时间" width="180"/>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === '启用' ? 'success' : 'info'">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template #default="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination"
      @size-change="handlePageChange"
      :page-sizes="[10, 20, 50]"
      layout="total, prev, pager, next"
    />
    <!-- 添加/编辑通知弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'add' ? '添加通知' : '编辑通知'"
      width="500px"
    >
      <el-form
        :model="noticeForm"
        :rules="noticeRules"
        ref="noticeFormRef"
        label-width="100px"
      >
        <el-form-item label="通知类型" prop="type">
          <el-select v-model="noticeForm.type" placeholder="请选择通知类型">
            <el-option label="邮件" value="email"/>
            <el-option label="钉钉" value="dingtalk"/>
            <el-option label="企业微信" value="wecom"/>
          </el-select>
        </el-form-item>
        <el-form-item label="通知目标" prop="target">
          <el-input v-model="noticeForm.target" placeholder="请输入通知目标"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="noticeForm.status"
            active-value="启用"
            inactive-value="禁用"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 批量添加弹窗 -->
    <el-dialog
      :visible.sync="batchDialogVisible"
      title="批量添加通知"
      width="500px"
    >
      <el-form
        :model="batchForm"
        :rules="batchRules"
        ref="batchFormRef"
        label-width="100px"
      >
        <el-form-item label="通知类型" prop="type">
          <el-select v-model="batchForm.type" placeholder="请选择通知类型">
            <el-option label="邮件" value="email"/>
            <el-option label="钉钉" value="dingtalk"/>
            <el-option label="企业微信" value="wecom"/>
          </el-select>
        </el-form-item>
        <el-form-item label="通知目标" prop="targets">
          <el-input
            type="textarea"
            v-model="batchForm.targets"
            placeholder="请输入通知目标，每行一个"
            :rows="5"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBatchSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import { noticeSettingApi } from '@/api/NoticeSetting'

export default {
  data() {
    return {
      noticeList: [],
      loading: false,
      selectedItems: [],
      isBatchMode: false,
      dialogVisible: false,
      dialogType: 'add',
      noticeForm: {
        id: '',
        type: '',
        target: '',
        status: '启用' // 状态字段保持字符串格式（前端显示用）
      },
      noticeRules: {
        type: [{ required: true, message: '请选择通知类型', trigger: 'change' }],
        target: [{ required: true, message: '请输入通知目标', trigger: 'blur' }]
      },
      batchDialogVisible: false,
      batchForm: {
        type: '',
        targets: ''
      },
      batchRules: {
        type: [{ required: true, message: '请选择通知类型', trigger: 'change' }],
        targets: [{ required: true, message: '请输入通知目标', trigger: 'blur' }]
      },
      robotStatus: false, // 新增机器人状态字段
      currentPage: 1, // 新增分页参数
      pageSize: 10 // 新增分页参数
    }
  },
  methods: {
    // 新增获取日报方法
    async handleGetReport() {
      try {
        const response = await noticeSettingApi.getReport()
        const url = window.URL.createObjectURL(new Blob([response]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', '日报总结.pdf')
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (error) {
        Message.error('获取日报失败')
      }
    },

    // 新增获取机器人状态方法
    async getRobotStatus() {
      try {
        const response = await noticeSettingApi.getRobotStatus()
        this.robotStatus = response.data.status // 假设返回 { status: true }
      } catch (error) {
        Message.error('获取机器人状态失败')
      }
    },

    // 修改删除通知参数
    async handleDelete(row) {
      try {
        await MessageBox.confirm('确定要删除该通知吗？', '提示', {
          type: 'warning'
        })
        const response = await noticeSettingApi.deleteNotice({ ids: [row.id] })
        if (response.data.success) {
          Message.success('删除成功')
          await this.getNoticeList()
        }
      } catch (error) {
        if (error !== 'cancel') {
          Message.error('删除失败')
        }
      }
    },

    // 修改 handleSubmit 使用 editNotice 并处理状态转换
    async handleSubmit() {
      this.$refs.noticeFormRef.validate(async(valid) => {
        if (valid) {
          const formParams = {
            id: this.noticeForm.id,
            type: this.noticeForm.type,
            target: this.noticeForm.target,
            status: this.noticeForm.status === '启用' ? 1 : 0 // 转换为后端需要的数字
          }

          try {
            if (this.dialogType === 'add') {
              await noticeSettingApi.addNotice(formParams)
            } else {
              await noticeSettingApi.editNotice(formParams)
            }
            Message.success(this.dialogType === 'add' ? '添加成功' : '更新成功')
            this.dialogVisible = false
            await this.getNoticeList()
          } catch (error) {
            Message.error(this.dialogType === 'add' ? '添加失败' : '更新失败')
          }
        }
      })
    },

    // 修正分页参数处理
    handlePageChange(val) {
      if (typeof val === 'number') {
        this.currentPage = val // 处理页码变化
      } else {
        this.pageSize = val // 处理每页数量变化
      }
      this.getNoticeList()
    },

    // 获取通知列表（修正分页参数）
    async getNoticeList() {
      this.loading = true
      try {
        const params = {
          type: '',
          status: '',
          page: this.currentPage,
          pageSize: this.pageSize
        }
        const response = await noticeSettingApi.getNotices(params)
        if (response.data.success) {
          this.noticeList = response.data.list
          this.total = response.data.total
        }
      } catch (error) {
        Message.error('获取通知列表失败')
      }
      this.loading = false
    },

    // 其他原有方法保持不变
    handleAdd() {
      this.dialogType = 'add'
      this.noticeForm.id = ''
      this.noticeForm.type = ''
      this.noticeForm.target = ''
      this.noticeForm.status = '启用'
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogType = 'edit'
      Object.assign(this.noticeForm, row)
      this.dialogVisible = true
    },
    toggleBatchMode() {
      this.isBatchMode = !this.isBatchMode
      if (!this.isBatchMode) {
        this.selectedItems = []
      }
    },
    handleSelectionChange(selection) {
      this.selectedItems = selection
    },
    handleBatchAdd() {
      this.batchForm.type = ''
      this.batchForm.targets = ''
      this.batchDialogVisible = true
    },
    async handleBatchDelete() {
      if (this.selectedItems.length === 0) {
        Message.warning('请选择要删除的通知')
        return
      }
      try {
        await MessageBox.confirm(`确定要删除选中的 ${this.selectedItems.length} 条通知吗？`, '提示', {
          type: 'warning'
        })
        const ids = this.selectedItems.map(item => item.id)
        const response = await noticeSettingApi.deleteNotice({ ids })
        if (response.data.success) {
          Message.success('批量删除成功')
          await this.getNoticeList()
        }
      } catch (error) {
        if (error !== 'cancel') {
          Message.error('批量删除失败')
        }
      }
    },
    handleBatchSubmit() {
      this.$refs.batchFormRef.validate(async(valid) => {
        if (valid) {
          const targets = this.batchForm.targets.split('\n').filter(t => t.trim())
          const promises = targets.map(target => {
            return noticeSettingApi.setNotice({
              name: target,
              type: this.batchForm.type,
              interval: '1' // 默认启用状态
            })
          })
          try {
            await Promise.all(promises)
            Message.success('批量添加成功')
            this.batchDialogVisible = false
            await this.getNoticeList()
          } catch (error) {
            Message.error('批量添加失败')
          }
        }
      })
    }
  },
  mounted() {
    this.getNoticeList()
    this.getRobotStatus() // 初始化机器人状态
  }
}
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

.left-operations, .right-operations {
  display: flex;
  gap: 10px;
}

.right-operations {
  align-items: center;
}

/* 操作按钮 */
::v-deep .el-button {
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

::v-deep .el-button:hover {
  background-color: #ecf5ff;
}

/* 表格样式 */
.el-table {
  width: 100%;
  margin-top: 20px;
  border-radius: 4px;
}

.el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 500;
}

.el-table__row:hover {
  background-color: #f5f7fa !important;
}

/* 分页器 */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
}

/* 弹窗样式 */
.el-dialog {
  border-radius: 8px;
}

.el-dialog__header {
  border-bottom: 1px solid #ebeef5;
  padding: 15px 20px;
}

.el-dialog__title {
  font-size: 18px;
  font-weight: bold;
}

.el-dialog__body {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input__inner {
  border-radius: 4px;
}

.el-select .el-input__inner {
  width: 100%;
}

.el-switch {
  margin-right: 10px;
}

.dialog-footer {
  text-align: right;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
}

/* 批量管理选择框 */
.el-table-column--selection .cell {
  padding-left: 0;
}

/* 标签样式 */
.el-tag {
  border-radius: 4px;
}

/* 提示信息 */
.el-message-box {
  border-radius: 8px;
}

.el-message-box__message p {
  color: #606266;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .operation-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .left-operations, .right-operations {
    width: 100%;
    margin-bottom: 10px;
  }

  .el-table {
    font-size: 14px;
  }
}
</style>
