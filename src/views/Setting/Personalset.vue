<template>
  <div class="security-settings">
    <el-row :gutter="20">
      <!-- 修改密码表单 -->
      <el-col :span="12">
        <el-card class="password-card">
          <div slot="header" class="card-header">
            <span>修改密码</span>
          </div>

          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
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

            <el-form-item label="确认密码" prop="confirmPassword">
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
      </el-col>

      <!-- TOTP配置表单 -->
      <el-col :span="12">
        <el-card class="totp-card">
          <div slot="header" class="card-header">
            <span>TOTP配置</span>
          </div>

          <el-form
            ref="totpFormRef"
            :model="totpForm"
            :rules="totpRules"
            label-width="100px"
          >
            <div class="qr-code" v-if="totpQrCode">
              <img :src="totpQrCode" alt="TOTP QR Code">
              <p class="secret-key">密钥：{{ totpSecretKey }}</p>
            </div>

            <el-form-item label="验证码" prop="code">
              <el-input
                v-model="totpForm.code"
                placeholder="请输入6位验证码"
                maxlength="6"
              >
                <template slot="append">
                  <el-button @click="handleGetTotp" :disabled="!!totpQrCode">
                    {{ totpQrCode ? '重新获取' : '获取' }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleBindTotp">
                确认绑定
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import axios from 'axios'

export default {
  data() {
    return {
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.passwordForm.newPassword) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      totpForm: {
        code: ''
      },
      totpQrCode: '',
      totpSecretKey: '',
      totpRules: {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码必须是6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleChangePassword() {
      this.$refs.passwordFormRef.validate(async(valid) => {
        if (valid) {
          try {
            const response = await axios.post('/changepassword', {
              oldPassword: this.passwordForm.oldPassword,
              newPassword: this.passwordForm.newPassword
            })

            if (response.data.success) {
              Message.success('密码修改成功')
              // 清空表单
              this.passwordForm.oldPassword = ''
              this.passwordForm.newPassword = ''
              this.passwordForm.confirmPassword = ''
            } else {
              Message.error(response.data.message || '密码修改失败')
            }
          } catch (error) {
            Message.error('服务器错误，请稍后重试')
          }
        }
      })
    },
    async handleGetTotp() {
      try {
        const response = await axios.get('/totp/generate')
        if (response.data.success) {
          this.totpQrCode = response.data.qrCode
          this.totpSecretKey = response.data.secretKey
        } else {
          Message.error(response.data.message || '获取TOTP失败')
        }
      } catch (error) {
        Message.error('服务器错误，请稍后重试')
      }
    },
    handleBindTotp() {
      this.$refs.totpFormRef.validate(async(valid) => {
        if (valid) {
          try {
            const response = await axios.post('/totp/bind', {
              code: this.totpForm.code,
              secretKey: this.totpSecretKey
            })

            if (response.data.success) {
              Message.success('TOTP绑定成功')
              // 清空表单
              this.totpForm.code = ''
              this.totpQrCode = ''
              this.totpSecretKey = ''
            } else {
              Message.error(response.data.message || 'TOTP绑定失败')
            }
          } catch (error) {
            Message.error('服务器错误，请稍后重试')
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.security-settings {
  padding: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.qr-code {
  text-align: center;
  margin-bottom: 20px;
}

.qr-code img {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
}

.secret-key {
  color: #666;
  font-size: 14px;
  word-break: break-all;
}

:deep(.el-input__wrapper) {
  border-radius: 2px;
}

:deep(.el-button) {
  border-radius: 2px;
}
</style>
