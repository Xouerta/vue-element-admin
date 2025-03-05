import request from "@/utils/request";

// 删除封禁IP
export function deleteBanIP(params) {
  return request({
    url: '/device/alarm/hfish/deleteBanList',
    method: 'post',
    params
  })
}

// 批量删除封禁IP
export function batchDeleteBanIP(IPList) {
  return request({
    url: '/device/alarm/hfish/deleteBanList',
    method: 'post',
    data: { IP: IPList }
  })
}

// 获取攻击信息
export function getAttackInfo() {
  return request({
    url: '/device/alarm/hfish/get_attack_info',
    method: 'get'
  })
}

// 添加封禁IP
export function addBanIP(data) {
  return request({
    url: '/work/setBanlist',
    method: 'post',
    data: {
      IP: data.ips,
      expireTime: data.expireTime,
      UnderAttack: data.targetAsset,
      Weapons: data.attackType,
      note: data.remark
    }
  })
}

// 生成封禁报告
export function generateBanReport() {
  return request({
    url: '/work/getBanReport',
    method: 'get',
    responseType: 'blob' // For file download
  })
}

// 通过HFish添加封禁
export function addHFishBan(data) {
  return request({
    url: '/device/alarm/hfish/setBanlist',
    method: 'post',
    data: {
      IP: data.ips,
      expireTime: data.expireTime,
      UnderAttack: data.targetAsset,
      Weapons: data.attackType,
      note: data.remark
    }
  })
}

// 记录日志
// todo  ??
export function logOperation() {
  return request({
    url: '/',
    method: 'get'
  })
}
