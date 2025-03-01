<template>
  <div class="ban-settings">
    <el-card class="setting-card">
      <template #header>
        <div class="card-header">
          <span>封禁设置</span>
        </div>
      </template>

      <div class="setting-content">
        <div class="status-row">
          <span class="label">封禁状态:</span>
          <el-switch
            v-model="banStatus"
            @change="handleStatusChange"
            active-text="启用"
          />
          <span class="hint">禁用后设备将不再封禁IP</span>
        </div>

        <div class="duration-row">
          <span class="label">默认封禁时长:</span>
          <el-input-number
            v-model="banDuration"
            :min="0"
            :precision="0"
            :step="1"
            @change="handleDurationChange"
            style="width: 180px"
          />
          <span class="unit">秒</span>
          <span class="hint">0秒为永久封禁</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// 封禁状态和时长
const banStatus = ref(true)
const banDuration = ref(0)

// 获取初始设置
const getInitialSettings = async () => {
  try {
    const response = await axios.get('/changebanned')
    if (response.data.success) {
      banStatus.value = response.data.status
      banDuration.value = response.data.duration
    }
  } catch (error) {
    ElMessage.error('获取设置失败')
  }
}

// 更新设置
const updateSettings = async (status, duration) => {
  try {
    const response = await axios.post('/changebanned', {
      status: status,
      duration: duration
    })

    if (response.data.success) {
      ElMessage.success('设置更新成功')
      // 保存更新后的状态
      banStatus.value = status
      banDuration.value = duration
    } else {
      ElMessage.error(response.data.message || '设置更新失败')
      // 如果失败，回滚到之前的状态
      banStatus.value = !status
    }
  } catch (error) {
    ElMessage.error('服务器错误，请稍后重试')
    // 发生错误时回滚状态
    banStatus.value = !status
  }
}

// 处理状态改变
const handleStatusChange = (value) => {
  updateSettings(value, banDuration.value)
}

// 处理时长改变
const handleDurationChange = (value) => {
  updateSettings(banStatus.value, value)
}

// 页面加载时获取初始设置
getInitialSettings()
</script>

<style scoped>
.ban-settings {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.setting-card {
  background: #fff;
  border-radius: 4px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.setting-content {
  padding: 20px 0;
}

.status-row,
.duration-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.label {
  width: 120px;
  color: #606266;
}

.hint {
  margin-left: 12px;
  color: #909399;
  font-size: 14px;
}

.unit {
  margin-left: 8px;
  color: #606266;
}

:deep(.el-switch) {
  margin-right: 12px;
}

:deep(.el-input-number) {
  width: 180px;
}

:deep(.el-input__wrapper) {
  border-radius: 2px;
}
</style>
