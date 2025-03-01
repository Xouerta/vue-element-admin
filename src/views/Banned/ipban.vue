<template>
  <div class="ban-ip-management">
    <!-- 顶部操作区 -->
    <div class="operation-bar">
      <div class="left-operations">
        <el-button type="primary" @click="handleAddIP">
          <i class="el-icon-plus"></i>
          封禁IP
        </el-button>

        <div class="search-area">
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
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
      </div>

      <div class="right-operations">
        <el-button-group>
          <el-button type="primary" plain @click="handleBatchAdd">
            <i class="el-icon-upload2"></i>
          </el-button>
          <el-button type="primary" plain @click="handleRefresh">
            <i class="el-icon-refresh-right"></i>
          </el-button>
          <el-button
            type="primary"
            plain
            @click="handleBatchDelete"
            :disabled="!selectedRows.length"
          >
            <i class="el-icon-delete"></i>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="ip" label="攻击IP" width="150"/>
      <el-table-column prop="source" label="来源" width="100"/>
      <el-table-column prop="targetAsset" label="被攻击资产" width="120" />
      <el-table-column prop="attackType" label="攻击方式" width="120" />
      <el-table-column prop="location" label="地理位置" width="150" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="expireTime" label="过期时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag type="success" size="small">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="150"/>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" link @click="handleEdit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="pagination">
      <span>共 {{ total }} 条</span>
      <el-pagination
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="prev, pager, next, sizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <span>前往</span>
    </div>

    <!-- 添加/编辑IP弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'add' ? '添加封禁IP' : '编辑封禁IP'"
      width="500px"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="formData.ip" :disabled="dialogType === 'edit'"/>
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-select v-model="formData.source" style="width: 100%">
            <el-option label="hfish" value="hfish"/>
            <el-option label="手动添加" value="manual"/>
          </el-select>
        </el-form-item>
        <el-form-item label="过期时间" prop="expireTime">
          <el-radio-group v-model="formData.expireType">
            <el-radio label="never">永不过期</el-radio>
            <el-radio label="custom">自定义</el-radio>
          </el-radio-group>
          <el-date-picker
            v-if="formData.expireType === 'custom'"
            v-model="formData.expireTime"
            type="datetime"
            style="width: 100%; margin-top: 10px"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formData.remark"/>
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
      title="批量添加IP"
      width="500px"
    >
      <el-form :model="batchForm" :rules="batchRules" ref="batchFormRef" label-width="100px">
        <el-form-item label="IP列表" prop="ips">
          <el-input
            type="textarea"
            v-model="batchForm.ips"
            rows="10"
            placeholder="请输入IP地址，每行一个"
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
      searchForm: {
        ip: '',
        source: ''
      },
      tableData: [],
      loading: false,
      total: 0,
      currentPage: 1,
      pageSize: 50,
      selectedRows: [],
      dialogVisible: false,
      dialogType: 'add',
      formData: {
        ip: '',
        source: 'manual',
        expireType: 'never',
        expireTime: '',
        remark: ''
      },
      formRules: {
        ip: [
          { required: true, message: '请输入IP地址', trigger: 'blur' },
          { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: '请输入正确的IP格式', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请选择来源', trigger: 'change' }
        ]
      },
      batchDialogVisible: false,
      batchFormRef: null,
      batchForm: {
        ips: ''
      },
      batchRules: {
        ips: [
          { required: true, message: '请输入IP地址列表', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSelectionChange(rows) {
      this.selectedRows = rows
    },
    handleSearch() {
      this.loading = true
      axios.get('/bannip', {
        params: {
          ...this.searchForm,
          page: this.currentPage,
          pageSize: this.pageSize
        }
      })
        .then(response => {
          this.tableData = response.data.data
          this.total = response.data.total
        })
        .catch(() => {
          Message.error('查询失败')
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleAddIP() {
      this.dialogType = 'add'
      this.formData.ip = ''
      this.formData.source = 'manual'
      this.formData.expireType = 'never'
      this.formData.expireTime = ''
      this.formData.remark = ''
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogType = 'edit'
      Object.assign(this.formData, row)
      this.formData.expireType = row.expireTime ? 'custom' : 'never'
      this.dialogVisible = true
    },
    handleDelete(row) {
      MessageBox.confirm(`确定要删除IP ${row.ip} 吗？`, '提示')
        .then(() => {
          axios.delete(`/bannip/${row.ip}`)
            .then(() => {
              Message.success('删除成功')
              this.handleSearch()
            })
            .catch(() => {
              Message.error('删除失败')
            })
        })
        .catch(() => {
        })
    },
    handleBatchDelete() {
      if (!this.selectedRows.length) return

      MessageBox.confirm(`确定要删除选中的 ${this.selectedRows.length} 个IP吗？`, '提示')
        .then(() => {
          const ips = this.selectedRows.map(row => row.ip)
          axios.delete('/bannip/batch', { data: { ips } })
            .then(() => {
              Message.success('批量删除成功')
              this.handleSearch()
            })
            .catch(() => {
              Message.error('批量删除失败')
            })
        })
        .catch(() => {
        })
    },
    handleBatchAdd() {
      this.batchForm.ips = ''
      this.batchDialogVisible = true
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return

        const data = {
          ip: this.formData.ip,
          source: this.formData.source,
          expireTime: this.formData.expireType === 'custom' ? this.formData.expireTime : null,
          remark: this.formData.remark
        }

        if (this.dialogType === 'add') {
          axios.post('/bannip', data)
            .then(() => {
              Message.success('添加成功')
              this.dialogVisible = false
              this.handleSearch()
            })
            .catch(() => {
              Message.error('添加失败')
            })
        } else {
          axios.put(`/bannip/${data.ip}`, data)
            .then(() => {
              Message.success('修改成功')
              this.dialogVisible = false
              this.handleSearch()
            })
            .catch(() => {
              Message.error('修改失败')
            })
        }
      })
    },
    handleBatchSubmit() {
      this.$refs.batchFormRef.validate(valid => {
        if (!valid) return

        const ips = this.batchForm.ips.split('\n').map(ip => ip.trim()).filter(ip => ip)
        axios.post('/bannip/batch', { ips })
          .then(() => {
            Message.success('批量添加成功')
            this.batchDialogVisible = false
            this.handleSearch()
          })
          .catch(() => {
            Message.error('批量添加失败')
          })
      })
    },
    handleRefresh() {
      this.handleSearch()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.handleSearch()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.handleSearch()
    }
  },
  mounted() {
    this.handleSearch()
  }
}
</script>

<style scoped>
.ban-ip-management {
  padding: 20px;
}

.operation-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.left-operations {
  display: flex;
  gap: 20px;
}

.search-area {
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

:deep(.el-input__wrapper) {
  border-radius: 2px;
}

:deep(.el-button) {
  border-radius: 2px;
}
</style>
