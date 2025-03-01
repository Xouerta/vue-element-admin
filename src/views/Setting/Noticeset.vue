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
          this.getNoticeList()
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
              this.getNoticeList()
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
          this.getNoticeList()
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
              this.getNoticeList()
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
