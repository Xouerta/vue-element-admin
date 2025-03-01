<template>
  <div class="certificate-config">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>证书配置</span>
        </div>
      </template>

      <div class="config-content">
        <!-- 状态展示区 -->
        <div class="status-section">
          <div class="status-item">
            <span class="label">证书状态:</span>
            <el-tag :type="certStatus === '正常' ? 'success' : 'danger'">
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

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// 证书状态数据
const certStatus = ref('正常')
const certType = ref('社区版')
const whitelistCount = ref(10)
const alertDeviceCount = ref(2)
const banDeviceCount = ref(2)
const expiryTime = ref('永久授权')

// 表单数据
const formRef = ref(null)
const formData = reactive({
  certCode: 'sec-auto-ban-community',
  email: '1920185878@qq.com'
})

// 表单验证规则
const formRules = {
  certCode: [
    { required: true, message: '请输入证书编码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 获取证书信息
const getCertInfo = async () => {
  try {
    const response = await axios.get('/book')
    if (response.data.success) {
      certStatus.value = response.data.status
      certType.value = response.data.type
      whitelistCount.value = response.data.whitelistCount
      alertDeviceCount.value = response.data.alertDeviceCount
      banDeviceCount.value = response.data.banDeviceCount
      expiryTime.value = response.data.expiryTime
    }
  } catch (error) {
    ElMessage.error('获取证书信息失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await axios.post('/book', formData)
        if (response.data.success) {
          ElMessage.success('证书配置成功')
          // 更新证书信息显示
          getCertInfo()
        } else {
          ElMessage.error(response.data.message || '证书配置失败')
        }
      } catch (error) {
        ElMessage.error('服务器错误，请稍后重试')
      }
    }
  })
}

// 在线绑定
const handleOnlineSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await axios.post('/book/online', formData)
        if (response.data.success) {
          ElMessage.success('在线绑定成功')
          getCertInfo()
        } else {
          ElMessage.error(response.data.message || '在线绑定失败')
        }
      } catch (error) {
        ElMessage.error('服务器错误，请稍后重试')
      }
    }
  })
}

// 重置表单
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 页面加载时获取证书信息
getCertInfo()
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

.config-content {
  padding: 20px 0;
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

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #606266;
  width: 150px;
}

.value {
  color: #303133;
}

.cert-form {
  max-width: 500px;
  margin-top: 30px;
}

:deep(.el-input__wrapper) {
  border-radius: 2px;
}

:deep(.el-button) {
  border-radius: 2px;
}

:deep(.el-tag) {
  border-radius: 2px;
}
</style>
