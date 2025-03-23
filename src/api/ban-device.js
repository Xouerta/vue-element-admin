import request from '@/utils/request'


// 获取封禁设备列表
export function fetchList({page, pageSize}) {
  return request({
    url: '/device/block_device/list_all',
    method: 'post',
    data: {
      page: page,
      pageSize: pageSize
    }
  })
}

// 添加封禁设备
export function addDevice(data) {
  return request({
    url: '/device/block_device/add',
    method: 'post',
    data: {
      ip: data.ip,
      name: data.name,
      note: data.note
    }
  })
}

// 删除封禁设备
export function deleteDevice(name) {
  return request({
    url: '/device/block_device/delete',
    method: 'post',
    data: {name: name}
  })
}

export function searchDevice(name) {
  return request({
    url: '/device/block_device/search',
    method: 'post',
    data: {
      name: name,
    }
  })
}

export function getDeviceInfo(name) {
  return request({
    url: '/device/block_device/info',
    method: 'post',
    data: {
      name: name,
    }
  })
}

export function editDevice({name, note, key, status}) {
  return request({
    url: '/device/block_device/edit',
    method: 'post',
    data: {
      name: name,
      note: note,
      key: key,
      status: status
    }
  })
}
