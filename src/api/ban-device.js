import request from '@/utils/request'

// 封禁设备管理接口
export const blockDeviceApi = {
  // 获取封禁设备列表
  fetchList() {
    return request({
      url: '/device/block_device/list',
      method: 'get'
    })
  },

  // 添加封禁设备
  addDevice(data) {
    return request({
      url: '/device/block_device/add',
      method: 'post',
      data: {
        name: data.deviceName,
        note: data.remark
      }
    })
  },

  // 删除封禁设备
  deleteDevice(deviceKey) {
    return request({
      url: '/device/block_device/delete',
      method: 'post',
      data: { key: deviceKey }
    })
  }
}
