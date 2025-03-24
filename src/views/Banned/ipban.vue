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
          <!-- 新增批量设置按钮 -->
          <el-button type="primary" plain @click="handleBatchSet">
            <i class="el-icon-setting"></i>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      height="70vh"
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
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="IP地址" prop="ip">
          <el-input
            v-model="formData.ip"
            :disabled="dialogType === 'edit'"
          />
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
        <!-- 新增字段 -->
        <el-form-item label="状态">
          <el-switch
            v-model="formData.status"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="攻击方式" prop="Weapons">
          <el-input v-model="formData.Weapons"/>
        </el-form-item>
        <el-form-item label="被攻击资产" prop="UnderAttack">
          <el-input v-model="formData.UnderAttack"/>
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
      <el-form
        :model="batchForm"
        :rules="batchRules"
        ref="batchFormRef"
        label-width="100px"
      >
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

    <!-- 新增批量设置弹窗 -->
    <el-dialog
      :visible.sync="batchSetDialogVisible"
      title="批量设置封禁列表"
      width="500px"
    >
      <el-form
        :model="batchSetForm"
        :rules="batchSetRules"
        ref="batchSetFormRef"
        label-width="100px"
      >
        <el-form-item label="IP列表" prop="ips">
          <el-input
            type="textarea"
            v-model="batchSetForm.ips"
            placeholder="请输入IP，每行一个"
            :rows="5"
          />
        </el-form-item>
        <el-form-item label="过期时间" prop="expireTime">
          <el-date-picker
            v-model="batchSetForm.expireTime"
            type="datetime"
            placeholder="选择过期时间"
          />
        </el-form-item>
        <el-form-item label="被攻击资产" prop="UnderAttack">
          <el-input v-model="batchSetForm.UnderAttack"/>
        </el-form-item>
        <el-form-item label="攻击方式" prop="Weapons">
          <el-input v-model="batchSetForm.Weapons"/>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input type="textarea" v-model="batchSetForm.note"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchSetDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBatchSetSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { Message, MessageBox } from 'element-ui'
import { banlogApi } from '@/api/banlog'

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
        remark: '',
        UnderAttack: '', // 被攻击资产
        Weapons: '',     // 攻击方式
        status: false    // 封禁状态（布尔值）
      },
      formRules: {
        ip: [
          { required: true, message: '请输入IP地址', trigger: 'blur' },
          { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: '请输入正确的IP格式', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请选择来源', trigger: 'change' }
        ],
        Weapons: [
          { required: true, message: '请输入攻击方式', trigger: 'blur' }
        ],
        UnderAttack: [
          { required: true, message: '请输入被攻击资产', trigger: 'blur' }
        ]
      },
      batchDialogVisible: false,
      batchForm: {
        ips: ''
      },
      batchRules: {
        ips: [
          { required: true, message: '请输入IP地址列表', trigger: 'blur' }
        ]
      },
      batchSetDialogVisible: false,
      batchSetForm: {
        ips: '',
        expireTime: '',
        UnderAttack: '',
        Weapons: '',
        note: ''
      },
      batchSetRules: {
        ips: [{ required: true, message: '请输入IP列表', trigger: 'blur' }],
        expireTime: [{ required: true, message: '请选择过期时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleSelectionChange(rows) {
      this.selectedRows = rows
    },
    async handleSearch() {
      this.loading = true
      try {
        const params = {
          ip: this.searchForm.ip,
          source: this.searchForm.source,
          page: this.currentPage,
          pageSize: this.pageSize
        }
        const response = await banlogApi.getAlerts(params)
        if (response.data.success) {
          this.tableData = response.data.data
          this.total = response.data.total
        } else {
          Message.error(response.data.message || '查询失败')
        }
      } catch (error) {
        Message.error('服务器错误，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    handleAddIP() {
      this.dialogType = 'add'
      this.formData = {
        ip: '',
        source: 'manual',
        expireType: 'never',
        expireTime: '',
        remark: '',
        UnderAttack: '',
        Weapons: '',
        status: false
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogType = 'edit'
      Object.assign(this.formData, {
        ip: row.ip,
        source: row.source,
        remark: row.remark || '',
        UnderAttack: row.targetAsset || row.UnderAttack || '',
        Weapons: row.attackType || row.Weapons || '',
        status: row.status === '启用' || row.status,
        expireType: row.expireTime ? 'custom' : 'never',
        expireTime: row.expireTime || ''
      })
      this.dialogVisible = true
    },
    async handleDelete(row) {
      try {
        await MessageBox.confirm(`确定要删除IP ${row.ip} 吗？`, '提示')
        const response = await banlogApi.deleteAlertIP({ IP: [row.ip] })
        if (response.data.success) {
          Message.success('删除成功')
          await this.handleSearch()
        } else {
          Message.error(response.data.message || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') Message.error('删除失败')
      }
    },
    async handleBatchDelete() {
      if (!this.selectedRows.length) return
      try {
        await MessageBox.confirm(`确定要删除选中的 ${this.selectedRows.length} 个IP吗？`, '提示')
        const ips = this.selectedRows.map(row => row.ip)
        const response = await banlogApi.deleteAlertIP({ IP: ips })
        if (response.data.success) {
          Message.success('批量删除成功')
          await this.handleSearch()
        } else {
          Message.error(response.data.message || '批量删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') Message.error('批量删除失败')
      }
    },
    handleBatchAdd() {
      this.batchForm.ips = ''
      this.batchDialogVisible = true
    },
    async handleSubmit() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        const data = {
          IP: [this.formData.ip],
          expireTime: this.formData.expireType === 'custom' ? this.formData.expireTime : null,
          UnderAttack: this.formData.UnderAttack,
          Weapons: this.formData.Weapons,
          note: this.formData.remark
        }
        try {
          if (this.dialogType === 'add') {
            const response = await banlogApi.addAlertIP(data)
            if (response.data.success) {
              Message.success('添加成功')
              this.dialogVisible = false
              await this.handleSearch()
            } else {
              Message.error(response.data.message || '添加失败')
            }
          } else {
            const editData = {
              attack_ip: this.formData.ip,
              status: this.formData.status,
              end_Time: data.expireTime || '',
              attacked_asset: data.UnderAttack,
              attack_method: data.Weapons,
              note: data.note
            }
            const response = await banlogApi.editAlert(editData)
            if (response.data.success) {
              Message.success('修改成功')
              this.dialogVisible = false
              await this.handleSearch()
            } else {
              Message.error(response.data.message || '修改失败')
            }
          }
        } catch (error) {
          Message.error('操作失败')
        }
      })
    },
    handleBatchSet() {
      this.batchSetForm = {
        ips: '',
        expireTime: '',
        UnderAttack: '',
        Weapons: '',
        note: ''
      }
      this.batchSetDialogVisible = true
    },
    async handleBatchSetSubmit() {
      this.$refs.batchSetFormRef.validate(async valid => {
        if (!valid) return
        const ips = this.batchSetForm.ips
          .split('\n')
          .map(ip => ip.trim())
          .filter(ip => ip)
        const data = {
          IP: ips,
          expireTime: this.batchSetForm.expireTime,
          UnderAttack: this.batchSetForm.UnderAttack,
          Weapons: this.batchSetForm.Weapons,
          note: this.batchSetForm.note
        }
        try {
          const response = await banlogApi.setBanList(data)
          if (response.data.success) {
            Message.success('批量设置成功')
            this.batchSetDialogVisible = false
            await this.handleSearch()
          } else {
            Message.error('批量设置失败')
          }
        } catch (error) {
          Message.error('操作失败，请重试')
        }
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
    },
    async handleBatchSubmit() {
      this.$refs.batchFormRef.validate(async valid => {
        if (!valid) return
        const ips = this.batchForm.ips
          .split('\n')
          .map(ip => ip.trim())
          .filter(ip => ip)
        const data = {
          IP: ips,
          expireTime: null,
          UnderAttack: '',
          Weapons: '',
          note: ''
        }
        try {
          const response = await banlogApi.addAlertIP(data)
          if (response.data.success) {
            Message.success('批量添加成功')
            this.batchDialogVisible = false
            await this.handleSearch()
          } else {
            Message.error(response.data.message || '批量添加失败')
          }
        } catch (error) {
          Message.error('批量操作失败')
        }
      })
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
