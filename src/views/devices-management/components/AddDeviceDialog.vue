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

      <el-form-item label="备注">
        <el-input
          v-model="formData.remark"
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
    return {
      formData: {
        name: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      }
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
