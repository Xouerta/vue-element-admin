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
      :data="noticeList"
      style="width: 100%"
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
        <el-form-item label="状态" prop="status">
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
import axios from 'axios'

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
        const response = await axios.get('/noticeset')
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
        })

        const response = await axios.delete(`/noticeset/${row.id}`)
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
          try {
            const url = this.dialogType === 'add' ? '/noticeset' : `/noticeset/${this.noticeForm.id}`
            const method = this.dialogType === 'add' ? 'post' : 'put'

            const response = await axios[method](url, this.noticeForm)
            if (response.data.success) {
              Message.success(this.dialogType === 'add' ? '添加成功' : '更新成功')
              this.dialogVisible = false
              await this.getNoticeList()
            }
          } catch (error) {
            Message.error(this.dialogType === 'add' ? '添加失败' : '更新失败')
          }
        }
      })
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
        const response = await axios.post('/noticeset/batch-delete', { ids })
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
          try {
            const targets = this.batchForm.targets.split('\n').filter(t => t.trim())
            const response = await axios.post('/noticeset/batch-add', {
              type: this.batchForm.type,
              targets
            })

            if (response.data.success) {
              Message.success('批量添加成功')
              this.batchDialogVisible = false
              await this.getNoticeList()
            }
          } catch (error) {
            Message.error('批量添加失败')
          }
        }
      })
    }
  },
  mounted() {
    this.getNoticeList()
  }
}
</script>
