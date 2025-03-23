import request from "@/utils/request";


// 获取告警设备列表
export function fetchList({page, pageSize}) {
  return request({
    url: '/device/alarm_device/list_all',
    method: 'post',
    data: {
      page: page,
      pageSize: pageSize
    }
  })
}

// 添加告警设备
export function addDevice(data) {
  return request({
    url: '/device/alarm_device/add',
    method: 'post',
    data: {
      name: data.name,
      note: data.note,
      ip: data.ip
    }
  })
}

// 删除告警设备
export function deleteDevice({key, name}) {
  return request({
    url: '/device/alarm_device/delete',
    method: 'post',
    data: {name: name},
  })
}

// 获取告警设备详情
export function getDeviceDoc(name) {
  return request({
    url: '/device/alarm_device/info',
    method: 'post',
    data: {name: name},
  })
}

// 查询告警设备
export function searchDevice(name) {
  return request({
    url: '/device/alarm_device/search',
    method: 'post',
    data: {
      name: name,
    }
  })
}

// 编辑
export function editDevice({name, note, key, status}) {
  return request({
    url: '/device/alarm_device/edit',
    method: 'post',
    data: {
      name: name,
      note: note,
      key: key,
      status: status
    }
  })
}
