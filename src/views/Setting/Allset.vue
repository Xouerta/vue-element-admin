<script>
import { Message } from 'element-ui'
import axios from 'axios'

export default {
  data() {
    return {
      banForm: {
        banEnabled: false,
        banDuration: 60 // 默认60分钟
      },
      banFormRef: null,
      saving: false,
      showSuccess: false,
      lastUpdateTime: '-'
    }
  },
  methods: {
    // 获取初始设置
    getInitialSettings() {
      axios.get('/changebanned')
        .then(response => {
          if (response.data.success) {
            this.banForm.banEnabled = response.data.banEnabled
            this.banForm.banDuration = response.data.banDuration
            this.lastUpdateTime = response.data.lastUpdateTime || '-'
          }
        })
        .catch(() => {
          Message.error('获取设置失败')
        })
    },

    // 处理封禁状态改变
    handleBanStatusChange(value) {
      if (!value) {
        Message.warning('关闭封禁可能会降低系统安全性')
      }
    },

    // 处理时长改变
    handleDurationChange(value) {
      if (value < 1) {
        Message.warning('封禁时长不能小于1分钟')
        this.banForm.banDuration = 1
      }
    },

    // 保存设置
    handleSaveSettings() {
      this.saving = true
      this.showSuccess = false

      axios.post('/changebanned', {
        banEnabled: this.banForm.banEnabled,
        banDuration: this.banForm.banDuration
      })
        .then(response => {
          if (response.data.success) {
            this.showSuccess = true
            this.lastUpdateTime = new Date().toLocaleString()
            Message.success('设置已保存')
          } else {
            Message.error(response.data.message || '保存失败')
          }
        })
        .catch(() => {
          Message.error('服务器错误，请稍后重试')
        })
        .finally(() => {
          this.saving = false
        })
    }
  },
  mounted() {
    this.getInitialSettings()
  }
}
</script>
<style scoped>
.ban-settings {
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

.unit-text {
  margin-left: 10px;
  color: #606266;
}

.success-alert {
  margin-top: 20px;
}

.current-settings {
  background: #f8f9fa;
}

.settings-info {
  padding: 10px 0;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  width: 120px;
  color: #606266;
}

.value {
  color: #303133;
}

:deep(.el-input-number) {
  width: 180px;
}

:deep(.el-switch) {
  margin-right: 10px;
}

:deep(.el-form) {
  max-width: 500px;
}
</style>
