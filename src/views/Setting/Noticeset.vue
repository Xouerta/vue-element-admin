<template>
  <div class="notice-management">
    <!-- 顶部操作栏 -->
    <div class="operation-bar">
      <div class="left-operations">
        <el-button type="primary" @click="handleAdd">
          <i class="el-icon-plus"></i>
          添加通知
        </el-button>
      </div>

      <div class="right-operations">
        <el-button type="primary" @click="toggleBatchMode">
          {{ isBatchMode ? '退出批量管理' : '批量管理' }}
        </el-button>
        <template v-if="isBatchMode">
          <el-button type="primary" @click="handleBatchAdd">
            批量添加
          </el-button>
          <el-button type="danger" @click="handleBatchDelete">
            批量删除
          </el-button>
        </template>
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

<script>import { Message, MessageBox } from 'element-ui'
import { settingApi } from '@/api/NoticeSetting'

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
        status: '启用'
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
      }
    }
  },
  methods: {
    async getNoticeList() {
      this.loading = true
      try {
        // 传递默认参数（根据实际需求调整）
        const response = await settingApi.getNotice({
          type: '',
          status: ''
        })
        if (response.data.success) {
          this.noticeList = response.data.list
        }
      } catch (error) {
        Message.error('获取通知列表失败')
      }
      this.loading = false
    },
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
    async handleDelete(row) {
      try {
        await MessageBox.confirm('确定要删除该通知吗？', '提示', {
          type: 'warning'
        });

        // 修复 deleteNotice 参数传递（需确保 API 支持 id 参数）
        const response = await settingApi.deleteNotice({ id: row.id })
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
    handleSubmit() {
      this.$refs.noticeFormRef.validate(async(valid) => {
        if (valid) {
          // 映射表单字段到 API 需要的参数格式
          const formParams = {
            name: this.noticeForm.target,
            interval: this.noticeForm.status === '启用' ? '1' : '0',
            type: this.noticeForm.type,
            id: this.noticeForm.id // 保留 id 用于更新操作
          }

          try {
            const response = await settingApi.setNotice(formParams)
            if (response.data.success) {
              Message.success(this.dialogType === 'add' ? '添加成功' : '更新成功')
              this.dialogVisible = false
              await this.getNoticeList()
            }
          } catch (error) {
            Message.error(this.dialogType === 'add' ? '添加失败' : '更新失败')
          }
        }
      });
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
        });

        const ids = this.selectedItems.map(item => item.id)
        const response = await settingApi.deleteNotice({ ids })
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
            return settingApi.setNotice({
              name: target,
              type: this.batchForm.type,
              interval: '1' // 默认启用状态
            });
          });

          try {
            await Promise.all(promises)
            Message.success('批量添加成功')
            this.batchDialogVisible = false
            await this.getNoticeList()
          } catch (error) {
            Message.error('批量添加失败')
          }
        }
      });
    }
  },
  mounted() {
    this.getNoticeList()
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
.el-button {
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.el-button:hover {
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
