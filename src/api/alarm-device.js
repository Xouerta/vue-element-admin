import request from "@/utils/request";

// 告警设备管理接口
export const alarmDeviceApi = {
  // 获取告警设备列表
  fetchList() {
    return request({
      url: '/device/alarm_device/list',
      method: 'get'
    })
  },

  // 添加告警设备
  addDevice(data) {
    return request({
      url: '/device/alarm_device/add',
      method: 'post',
      data: {
        name: data.deviceName,
        note: data.remark
      }
    })
  },

  // 删除告警设备
  deleteDevice(deviceKey) {
    return request({
      url: '/device/alarm_device/delete',
      method: 'post',
      data: { key: deviceKey }
    })
  }
}
