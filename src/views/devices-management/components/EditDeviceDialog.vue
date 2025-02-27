<template>
  <el-dialog
    :title="`编辑告警设备  ${deviceData.deviceName === undefined ? '' : deviceData.deviceName}`"
    :visible.sync="dialogVisible"
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
      <el-form-item label="设备名称">
        <el-input
          v-model="formData.deviceName"
          placeholder="请输入设备名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="状态">
        <el-switch
          v-model="formData.status"
          active-text="启用"
          inactive-text="禁用"
          :active-value="0"
          :inactive-value="1"
        >
        </el-switch>
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入备注"
        ></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditDeviceDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    deviceData: {
      type: Object,
      required: true,
      default: () => ({
        deviceName: '',
        status: 0,
        remark: ''
      })
    }
  },
  data() {
    return {
      formData: {
        deviceName: '',
        status: 0,
        remark: ''
      },
      rules: {
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    deviceData: {
      handler(newVal) {
        this.formData = { ...newVal }
      },
      immediate: true
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
          this.$emit('submit', { ...this.formData })
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
