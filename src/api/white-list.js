import request from '@/utils/request'

// 获取白名单列表
export function fetchWhitelist() {
  return request({
    url: '/whitelist/info',
    method: 'get'
  })
}

// 添加白名单（支持批量）
export function addWhitelist(data) {
  return request({
    url: '/whitelist/add',
    method: 'post',
    data: {
      ip_list: data.ips.join(' '), // 将数组转换为空格分隔字符串
      category: data.type,
      expire_time: data.expireTime,
      note: data.remark
    }
  })
}

// 删除白名单（支持批量）
export function deleteWhitelist(ips) {
  return request({
    url: '/whitelist/delete',
    method: 'post',
    data: {
      ip_list: ips.join(' ') // 将数组转换为空格分隔字符串
    }
  })
}

// 记录白名单操作日志
export function logWhitelistOperation() {
  return request({
    url: '/whitelist/log',
    method: 'get'
  })
} 