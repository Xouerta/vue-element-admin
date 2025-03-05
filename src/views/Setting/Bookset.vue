<template>
  <div class="certificate-config">
    <el-card class="config-card">
      <div slot="header" class="card-header">
        <span>证书配置</span>
      </div>

      <div class="config-content">
        <!-- 状态展示区 -->
        <div class="status-section">
          <div class="status-item">
            <span class="label">证书状态:</span>
            <el-tag :type="certStatusType">
              {{ certStatus }}
            </el-tag>
          </div>
          <div class="status-item">
            <span class="label">证书类型:</span>
            <el-tag type="info">{{ certType }}</el-tag>
          </div>
        </div>

        <!-- 配置信息区 -->
        <div class="info-section">
          <div class="info-item">
            <span class="label">授权白名单数量:</span>
            <span class="value">{{ whitelistCount }}</span>
          </div>
          <div class="info-item">
            <span class="label">授权告警设备数量:</span>
            <span class="value">{{ alertDeviceCount }}</span>
          </div>
          <div class="info-item">
            <span class="label">授权封禁设备数量:</span>
            <span class="value">{{ banDeviceCount }}</span>
          </div>
          <div class="info-item">
            <span class="label">到期时间:</span>
            <span class="value">{{ expiryTime }}</span>
          </div>
        </div>

        <!-- 证书配置表单 -->
        <el-form
          :model="formData"
          :rules="formRules"
          ref="formRef"
          label-width="100px"
          class="cert-form"
        >
          <el-form-item label="证书编码" prop="certCode">
            <el-input
              v-model="formData.certCode"
              placeholder="请输入证书编码"
            />
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input
              v-model="formData.email"
              placeholder="请输入邮箱地址"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">离线证书</el-button>
            <el-button type="primary" @click="handleOnlineSubmit">在线绑定</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { licenceApi, LICENCE_STATUS, LICENCE_TYPE } from '@/api/licence'

export default {
  data() {
    return {
      // 证书状态数据
      certStatus: '正常',
      certType: '社区版',
      whitelistCount: 10,
      alertDeviceCount: 2,
      banDeviceCount: 2,
      expiryTime: '永久授权',

      // 表单数据
      formData: {
        certCode: 'sec-auto-ban-community',
        email: '1920185878@qq.com'
      },
      formRules: {
        certCode: [
          { required: true, message: '请输入证书编码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    certStatusType() {
      switch (this.certStatus) {
        case 'active':
          return 'success'
        case 'expired':
          return 'danger'
        case 'invalid':
          return 'danger'
        default:
          return 'info'
      }
    }
  },
  methods: {
    // 获取证书信息
    async getCertInfo() {
      try {
        const response = await licenceApi.getLicence()
        if (response.data.success) {
          this.certStatus = response.data.status
          this.certType = response.data.type
          this.whitelistCount = response.data.whitelistCount
          this.alertDeviceCount = response.data.alertDeviceCount
          this.banDeviceCount = response.data.banDeviceCount
          this.expiryTime = response.data.expiryTime
        } else {
          Message.error(response.data.message || '获取证书信息失败')
        }
      } catch (error) {
        Message.error('获取证书信息失败')
      }
    },

    // 提交表单
    async handleSubmit() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          try {
            const response = await licenceApi.setLicence({
              id: this.formData.certCode,
              mail: this.formData.email
            })
            if (response.data.success) {
              Message.success('证书配置成功')
              this.getCertInfo() // 刷新证书信息
            } else {
              Message.error(response.data.message || '证书配置失败')
            }
          } catch (error) {
            Message.error('服务器错误，请稍后重试')
          }
        }
      })
    },

    // 在线绑定
    async handleOnlineSubmit() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          try {
            const response = await licenceApi.setLicence({
              id: this.formData.certCode,
              mail: this.formData.email
            })
            if (response.data.success) {
              Message.success('在线绑定成功')
              this.getCertInfo() // 刷新证书信息
            } else {
              Message.error(response.data.message || '在线绑定失败')
            }
          } catch (error) {
            Message.error('服务器错误，请稍后重试')
          }
        }
      })
    },

    // 重置表单
    handleReset() {
      this.$refs.formRef.resetFields()
    }
  },
  mounted() {
    this.getCertInfo()
  }
}
</script>

<style scoped>
.certificate-config {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.config-card {
  background: #fff;
  border-radius: 4px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.status-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-section {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.label {
  color: #606266;
  width: 150px;
}

.value {
  color: #303133;
}

.cert-form {
  margin-top: 30px;
}

:deep(.el-input__wrapper) {
  border-radius: 2px;
}

:deep(.el-button) {
  border-radius: 2px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}
</style>
