<template>
  <div class="whitelist-container">
    <!-- 顶部操作区 -->
    <div class="operation-area">
      <el-button
        type="primary"
        size="small"
        plain
        @click="handleAddClick"
        style="padding: 8px 20px;"
      >
        <i class="el-icon-plus" style="margin-right: 4px;"></i>
        添加白名单
      </el-button>
      <div class="search-area">
        <el-input
          v-model="searchIP"
          placeholder="IP"
          size="small"
          style="width: 200px; background-color: #f5f7fa;"
        >
          <template slot="prepend">
            <i class="el-icon-search" style="color: #909399;"></i>
          </template>
        </el-input>
        <el-input
          v-model="searchType"
          placeholder="类别"
          size="small"
          style="width: 200px; margin-left: 10px; background-color: #f5f7fa;"
        >
          <template slot="prepend">
            <i class="el-icon-search" style="color: #909399;"></i>
          </template>
        </el-input>
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleSearch"
          style="margin-left: 8px;"
        >
          搜索
        </el-button>
      </div>
      <div class="right-buttons">
        <el-tooltip content="批量启用" placement="top" :enterable="false">
          <el-button
            icon="el-icon-check"
            circle
            size="small"
            @click="handleBatchEnable"
          ></el-button>
        </el-tooltip>
        <el-tooltip content="批量禁用" placement="top" :enterable="false">
          <el-button
            icon="el-icon-close"
            circle
            size="small"
            @click="handleBatchDisable"
          ></el-button>
        </el-tooltip>
        <el-tooltip content="批量删除" placement="top" :enterable="false">
          <el-button
            icon="el-icon-delete"
            circle
            size="small"
            @click="handleBatchDelete"
          ></el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-wrapper">
      <el-table
        border
        :data="tableData"
        style="width: 100%"
        height="70vh"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="IP / Cidr" prop="ip"></el-table-column>
        <el-table-column label="类别" prop="type"></el-table-column>
        <el-table-column label="创建时间" prop="createTime">
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="过期时间" prop="expireTime">
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.expireTime) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              :type="scope.row.status === 0 ? 'success' : 'danger'"
              @click="handleStatusChange(scope.row)"
            >
              {{ scope.row.status === 0 ? '启用' : '禁用' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" :enterable="false">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                class="delete-btn"
                @click="handleDelete(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <span>共 {{ total }} 条</span>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        small
      >
      </el-pagination>
      <el-select v-model="pageSize" size="small" style="width: 110px">
        <el-option
          v-for="size in [10, 20, 50]"
          :key="size"
          :label="`${size}条/页`"
          :value="size"
        >
        </el-option>
      </el-select>
      <el-button size="small" plain>前往</el-button>
    </div>

    <!-- 添加白名单对话框 -->
    <el-dialog
      title="添加白名单"
      :visible.sync="addDialogVisible"
      width="500px"
      @close="resetAddForm"
    >
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
        <el-form-item label="IP列表" prop="ip">
          <el-input
            type="textarea"
            v-model="addForm.ip"
            :rows="4"
            placeholder="按行输入需要加白的IP，支持CIDR，eg.
123.123.123.123
123.123.123.0/24"
          ></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-input
            v-model="addForm.type"
            placeholder="请输入以上IP分类"
          ></el-input>
        </el-form-item>
        <el-form-item label="过期时间" prop="expireTime">
          <el-date-picker
            v-model="addForm.expireTime"
            type="datetime"
            placeholder="请选择过期时间"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="addForm.remark"
            :rows="3"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddForm">添加</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

// 将 IP 验证函数移到组件外部
const isValidIPs = (ip) => {
  const parts = ip.split('.')
  return parts.length === 4 && parts.every(part => {
    const num = parseInt(part)
    return num >= 0 && num <= 255 && part === num.toString()
  })
}

export default {
  name: 'WhitelistManagement',
  computed: {
    ...mapState({
      tableData: state => state.whiteLists.tableData,
      storeTotal: state => state.whiteLists.total,
      loading: state => state.whiteLists.loading
    })
  },
  watch: {
    storeTotal: {
      handler(newVal) {
        this.total = newVal
      },
      immediate: true
    }
  },
  data() {
    // IP格式验证函数
    const validateIPs = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入IP列表'))
        return
      }

      const ips = value.split('\n').filter(ip => ip.trim())
      if (ips.length === 0) {
        callback(new Error('请输入至少一个IP地址'))
        return
      }

      // IP地址正则表达式
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
      // CIDR格式正则表达式
      const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/

      for (const ip of ips) {
        const trimmedIP = ip.trim()
        if (cidrRegex.test(trimmedIP)) {
          // 检查CIDR格式
          const [ipPart, prefix] = trimmedIP.split('/')
          const prefixNum = parseInt(prefix)
          if (prefixNum < 0 || prefixNum > 32) {
            callback(new Error(`无效的CIDR前缀: ${trimmedIP}`))
            return
          }
          if (!isValidIPs(ipPart)) {
            callback(new Error(`无效的IP地址: ${ipPart}`))
            return
          }
        } else if (ipRegex.test(trimmedIP)) {
          // 检查普通IP格式
          if (!isValidIPs(trimmedIP)) {
            callback(new Error(`无效的IP地址: ${trimmedIP}`))
            return
          }
        } else {
          callback(new Error(`无效的IP格式: ${trimmedIP}`))
          return
        }
      }
      callback()
    }

    // 过期时间验证函数
    const validateExpireTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择过期时间'))
        return
      }

      const now = new Date()
      const expireTime = new Date(value)

      if (expireTime <= now) {
        callback(new Error('过期时间必须大于当前时间'))
        return
      }

      callback()
    }

    return {
      searchIP: '',
      searchType: '',
      editDialogVisible: false,
      addDialogVisible: false,
      currentWhitelist: {},
      selectedRows: [],
      currentPage: 1,
      pageSize: 50,
      addForm: {
        ip: '',
        type: '',
        expireTime: '',
        remark: ''
      },
      rules: {
        ip: [
          { required: true, message: '请输入IP列表', trigger: 'blur' },
          { validator: validateIPs, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入类别', trigger: 'blur' }
        ],
        expireTime: [
          { required: true, message: '请选择过期时间', trigger: 'change' },
          { validator: validateExpireTime, trigger: 'change' }
        ]
      },
      total: 0
    }
  },
  created() {
    console.log('Store state:', this.$store.state)  // 查看整个 store 状态
    console.log('WhiteList module:', this.$store.state.whiteLists)  // 查看 whitelist 模块状态
    this.fetchData()
  },
  methods: {
    ...mapActions({
      fetchTableData: 'whiteLists/fetchTableData',
      updateWhitelist: 'whiteLists/updateWhitelist',
      deleteWhitelist: 'whiteLists/deleteWhitelist',
      addWhitelist: 'whiteLists/addWhitelist',
      batchEnable: 'whiteLists/batchEnable',
      batchDisable: 'whiteLists/batchDisable',
      batchDelete: 'whiteLists/batchDelete'
    }),

    async fetchData() {
      try {
        await this.fetchTableData({
          page: this.currentPage,
          pageSize: this.pageSize,
          ip: this.searchIP,
          type: this.searchType
        })
        // 如果当前页没有数据且不是第一页，则自动跳转到上一页
        if (this.tableData.length === 0 && this.currentPage > 1) {
          this.currentPage--
          await this.fetchData()
        }
      } catch (error) {
        console.error('获取数据失败:', error)
        this.$message.error('获取数据失败')
      }
    },

    handleStatusChange(row) {
      const newStatus = row.status === 0 ? 1 : 0
      const updatedRow = { ...row, status: newStatus }

      this.updateWhitelist(updatedRow).then(() => {
        row.status = newStatus
        this.$message.success('状态更新成功')
      }).catch(() => {
        this.$message.error('状态更新失败')
      })
    },

    handleDelete(row) {
      this.$confirm('确认删除该白名单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.deleteWhitelist(row.ip)
          this.$message.success('删除成功')
          if (this.tableData.length === 0 && this.currentPage > 1) {
            this.currentPage--
          }
          await this.fetchData()
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => {})
    },

    handleBatchEnable() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要启用的白名单')
        return
      }
      this.$confirm(`确认启用选中的 ${this.selectedRows.length} 个白名单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ips = this.selectedRows.map(row => row.ip)
        this.batchEnable(ips).then(() => {
          this.$message.success('批量启用成功')
        }).catch(() => {
          this.$message.error('批量启用失败')
        })
      }).catch(() => {})
    },

    handleBatchDisable() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要禁用的白名单')
        return
      }
      this.$confirm(`确认禁用选中的 ${this.selectedRows.length} 个白名单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ips = this.selectedRows.map(row => row.ip)
        this.batchDisable(ips).then(() => {
          this.$message.success('批量禁用成功')
        }).catch(() => {
          this.$message.error('批量禁用失败')
        })
      }).catch(() => {})
    },

    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的白名单')
        return
      }
      this.$confirm(`确认删除选中的 ${this.selectedRows.length} 个白名单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const ips = this.selectedRows.map(row => row.ip)
          await this.batchDelete(ips)
          this.$message.success('批量删除成功')
          // 如果当前页没有数据了，则跳转到上一页
          if (this.tableData.length === 0 && this.currentPage > 1) {
            this.currentPage--
          }
          await this.fetchData()
        } catch (error) {
          this.$message.error('批量删除失败')
        }
      }).catch(() => {})
      console.log(this.$store.state.whiteLists)
    },

    // 处理添加按钮点击
    handleAddClick() {
      this.addDialogVisible = true
      // 设置日期选择器的默认时间范围
      this.$nextTick(() => {
        const datePicker = this.$refs.addForm.fields.find(field => field.prop === 'expireTime')
        if (datePicker) {
          datePicker.$el.querySelector('input').setAttribute('picker-options', JSON.stringify({
            disabledDate(time) {
              return time.getTime() < Date.now()
            }
          }))
        }
      })
    },

    // 重置添加表单
    resetAddForm() {
      this.$refs.addForm?.resetFields()
      this.addForm = {
        ip: '',
        type: '',
        expireTime: '',
        remark: ''
      }
    },

    // 格式化时间戳
    formatTimestamp(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },

    // 修改提交表单方法
    submitAddForm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          try {
            const formattedIPs = this.addForm.ip
              .split('\n')
              .map(ip => ip.trim())
              .filter(ip => ip)
              .join('\n')

            const formData = {
              ...this.addForm,
              ip: formattedIPs
            }

            await this.addWhitelist(formData)
            this.$message.success('添加成功')
            this.addDialogVisible = false
            this.fetchData()
          } catch (error) {
            this.$message.error('添加失败')
          }
        }
      })
    },

    // 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.fetchData()
    },

    // 分页相关方法
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.fetchData()
    },

    handleSelectionChange(val) {
      this.selectedRows = val
    }
  }
}
</script>

<style scoped>
.whitelist-container {
  height: 100%;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
  position: relative;
}

.operation-area {
  flex: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
}

.search-area {
  position: absolute;
  left: 15%;
}

.right-buttons {
  display: flex;
  gap: 10px;
}

.table-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  margin-bottom: 60px;
}

.pagination-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  background-color: #fff;
  z-index: 1;
}

.pagination-container span {
  color: #606266;
  font-size: 13px;
}

.delete-btn {
  color: #F56C6C;
}

.search-area :deep(.el-input__inner) {
  background-color: #f5f7fa;
  border: none;
  padding-left: 30px;
}

.search-area :deep(.el-input__prefix) {
  left: 10px;
}

.search-area :deep(.el-input) {
  border-radius: 4px;
  overflow: hidden;
}

/* 添加新样式 */
.el-dialog__body {
  padding: 20px 30px;
}

.dialog-footer {
  text-align: right;
}

</style>
