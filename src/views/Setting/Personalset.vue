<template>
  <div class="security-settings">
    <!-- 修改密码卡片 -->
    <el-card class="setting-card">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>

      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordFormRef"
        label-width="120px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
            placeholder="请输入原密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleChangePassword">
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- TOTP设置卡片 -->
    <el-card class="setting-card">
      <template #header>
        <div class="card-header">
          <span>TOTP设置</span>
        </div>
      </template>

      <div class="totp-content" v-if="!totpEnabled">
        <div class="qr-code">
          <img :src="totpQrCode" v-if="totpQrCode" />
          <el-skeleton :rows="5" animated v-else />
        </div>
        <div class="totp-key">
          <p>密钥: {{ totpKey }}</p>
        </div>
        <el-form
          :model="totpForm"
          :rules="totpRules"
          ref="totpFormRef"
          label-width="120px"
        >
          <el-form-item label="验证码" prop="code">
            <el-input
              v-model="totpForm.code"
              placeholder="请输入验证码"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleEnableTotp">
              启用TOTP
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="totp-enabled" v-else>
        <el-alert
          title="TOTP已启用"
          type="success"
          :closable="false"
        >
          <template #default>
            您的账号已启用TOTP双因素认证
          </template>
        </el-alert>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// 密码表单
const passwordFormRef = ref(null)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// TOTP相关
const totpFormRef = ref(null)
const totpEnabled = ref(false)
const totpQrCode = ref('')
const totpKey = ref('')
const totpForm = reactive({
  code: ''
})

const totpRules = {
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度必须为6位', trigger: 'blur' }
  ]
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await axios.post('/changepassword', {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })

        if (response.data.success) {
          ElMessage.success('密码修改成功')
          // 清空表单
          passwordForm.oldPassword = ''
          passwordForm.newPassword = ''
          passwordForm.confirmPassword = ''
        } else {
          ElMessage.error(response.data.message || '密码修改失败')
        }
      } catch (error) {
        ElMessage.error('服务器错误，请稍后重试')
      }
    }
  })
}

// 获取TOTP信息
const getTotpInfo = async () => {
  try {
    const response = await axios.get('/totp')
    if (response.data.success) {
      totpEnabled.value = response.data.enabled
      if (!response.data.enabled) {
        totpQrCode.value = response.data.qrCode
        totpKey.value = response.data.key
      }
    }
  } catch (error) {
    ElMessage.error('获取TOTP信息失败')
  }
}

// 启用TOTP
const handleEnableTotp = async () => {
  if (!totpFormRef.value) return

  await totpFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await axios.post('/totp', {
          code: totpForm.code
        })

        if (response.data.success) {
          ElMessage.success('TOTP启用成功')
          totpEnabled.value = true
          totpForm.code = ''
        } else {
          ElMessage.error(response.data.message || 'TOTP启用失败')
        }
      } catch (error) {
        ElMessage.error('服务器错误，请稍后重试')
      }
    }
  })
}

// 页面加载时获取TOTP信息
getTotpInfo()
</script>

<style scoped>
.security-settings {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.setting-card {
  margin-bottom: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.totp-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qr-code {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-code img {
  max-width: 100%;
  max-height: 100%;
}

.totp-key {
  font-family: monospace;
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
}

:deep(.el-form) {
  width: 100%;
  max-width: 400px;
}

:deep(.el-input__wrapper) {
  border-radius: 2px;
}

:deep(.el-button) {
  border-radius: 2px;
}
</style>
