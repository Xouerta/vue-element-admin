import request from '@/utils/request'

// 获取白名单列表
export function fetchWhitelist(data) { // todo page
  return request({
    url: '/whitelist/list',
    method: 'post',
    data: {
      page: data.page,
      page_size: data.pageSize,
    }
  })
}

// 添加白名单（支持批量）
export function addWhitelist(data) {
  return request({
    url: '/whitelist/add',
    method: 'post',
    data: {
      ip_list: data.ip.split('\n').map(item => item.trim()),
      category: data.type,
      expire_time: data.expireTime,
      note: data.remark,
      status: data.status
    }
  })
}

// 删除白名单（支持批量）
export function deleteWhitelist(ips) {
  return request({
    url: '/whitelist/delete',
    method: 'post',
    data: {
      ip_list: ips
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

// 编辑白名单（支持批量）
export function editWhiteList(data) {
  return request({
    url: '/whitelist/edit',
    method: 'post',
    data: {
      ip_list: data.ips,
      category: data.type,
      expire_time: data.expireTime,
      note: data.remark,
      status: data.status // todo 不是bool
    }
  })
}

// 搜索白名单ip 优先级高于分类
export function searchWhileListByIP(ip) {
  return request(
    {
      url: '/whitelist/search/ip',
      method: 'post',
      data: {
        ip: ip
      }
    }
  )
}

// 搜索白名单分类
export function searchWhileListByCategory(category) {
  return request(
    {
      url: '/whitelist/search/category',
      method: 'post',
      data: {
        category: category
      }
    }
  )
}

// 搜索白名单操作日志ip
export function searchWhileListLogByIP(ip) {
  return request(
    {
      url: '/whitelist/log/search/ip',
      method: 'post',
      data: {
        ip: ip
      }
    }
  )
}

// 搜索白名单操作日志分类
export function searchWhileListLogByCategory(category) {
  return request(
    {
      url: '/whitelist/log/search/category',
      method: 'post',
      data: {
        category: category
      }
    }
  )
}
