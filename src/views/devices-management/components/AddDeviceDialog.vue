<template>
  <el-dialog
    :title="`添加${ mode ? '告警' : '封禁'}设备`"
    :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="deviceForm"
      :model="formData"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="设备名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入设备名称"
        />
      </el-form-item>

      <el-form-item label="设备ip" prop="ip">
        <el-input
          v-model="formData.ip"
          placeholder="设备ip"
          />
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          v-model="formData.note"
          type="textarea"
          :rows="4"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">添加</el-button>
    </div>
  </el-dialog>
</template>

<script>
const isValidIPs = (ip) => {
  const parts = ip.split('.')
  return parts.length === 4 && parts.every(part => {
    const num = parseInt(part)
    return num >= 0 && num <= 255 && part === num.toString()
  })
}

export default {
  name: 'AddDeviceDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    mode: {
      type: Boolean,
      default: true
    }
  },
  data() {
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
    return {
      formData: {
        name: '',
        note: '',
        ip: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        ip:[
          {required: true, message: '请输入设备ip', trigger: 'blur'},
          {validator: validateIPs, trigger: 'blur'}
        ]
      },
    }
  },
  methods: {
    handleClose() {
      this.$refs.deviceForm?.resetFields()
      this.$emit('update:visible', false)
      this.$emit('close')
    },

    handleSubmit() {
      this.$refs.deviceForm.validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData)
          this.handleClose()
        }
      })
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
