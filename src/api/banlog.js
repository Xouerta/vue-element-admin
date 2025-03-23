import request from '@/utils/request'

/**
 * @typedef {Object} AlertInfo
 * @property {string} 创建时间 - 告警创建时间
 * @property {string} 地理位置 - 攻击IP的地理位置
 * @property {string} 攻击IP - 攻击者的IP地址
 * @property {string} 攻击方式 - 攻击的方法
 * @property {string} 来源 - 告警来源
 * @property {string} 被攻击资产 - 被攻击的资产
 */

/**
 * @typedef {Object} LogEntry
 * @property {string} attack_ip - 告警IP
 * @property {string} attack_method - 攻击方法
 * @property {string} attacked_asset - 攻击来源
 * @property {string} note - 备注
 * @property {string} source - 告警信息来源
 * @property {boolean} status - 是否启用
 * @property {string} time - 变更时间
 */

// 告警日志相关接口
export const banlogApi = {
  /**
   * 删除告警IP
   * @param {{IP: any[]}} attack_ip - 要删除的告警IP
   * @returns {Promise<{message: string}>}
   */
  deleteAlertIP(attack_ip) {
    return request({
      url: '/banning/delete',
      method: 'post',
      data: { attack_ip }
    })
  },

  /**
   * 获取告警信息
   * @returns {Promise<AlertInfo[]>}
   */
  getAlerts(p) {
    return request({
      url: '/linkage/get_alerts',
      method: 'get'
    })
  },

  /**
   * 封禁处理
   * @param {Object} data - 封禁信息
   * @param {string[]} data.IP - 封禁IP列表
   * @param {string} [data.expireTime] - 过期时间
   * @param {string} [data.UnderAttack] - 被攻击资产
   * @param {string} [data.Weapons] - 攻击方式
   * @param {string} [data.note] - 备注
   * @returns {Promise}
   */
  setBanList(data) {
    return request({
      url: '/banning/setBanlist',
      method: 'post',
      data
    })
  },

  /**
   * 添加告警IP
   * @param {{note: string, expireTime: (string|null), Weapons: *, IP: string[], UnderAttack: *}} data - 告警信息
   * @param {string[]} data.ip_list - 告警IP列表
   * @param {string} data.end_time - 截止时间
   * @param {string} data.attacked_asset - 攻击来源
   * @param {string} data.attack_method - 攻击方法
   * @param {string} data.note - 备注
   * @param {string} data.source - 告警来源
   * @returns {Promise<{message: string}>}
   */
  addAlertIP(data) {
    return request({
      url: '/banning/add',
      method: 'post',
      data
    })
  },

  /**
   * 获取变更日志
   * @returns {Promise<LogEntry[]>}
   */
  getLogs(p) {
    return request({
      url: '/banning/log/get',
      method: 'get'
    })
  },

  /**
   * 编辑告警信息
   * @param {Object} data - 告警信息
   * @param {string} data.attack_ip - 攻击IP
   * @param {boolean} data.status - 启用状态
   * @param {string} data.end_Time - 过期时间
   * @param {string} data.attacked_asset - 攻击来源
   * @param {string} data.attack_method - 攻击方式
   * @param {string} data.note - 备注
   * @returns {Promise<{message: string}>}
   */
  editAlert(data) {
    return request({
      url: '/banning/edit',
      method: 'post',
      data
    })
  },

  /**
   * 通过IP搜索日志
   * @param {string} attack_ip - 告警IP
   * @returns {Promise<LogEntry[]>}
   */
  searchLogsByIP(attack_ip, p) {
    return request({
      url: '/banning/log/search/ip',
      method: 'post',
      data: { attack_ip }
    })
  },

  /**
   * 通过来源搜索日志
   * @param {string} source - 告警来源
   * @returns {Promise<LogEntry[]>}
   */
  searchLogsBySource(source, p) {
    return request({
      url: '/banning/log/search/source',
      method: 'post',
      data: { source }
    })
  }
}

export default banlogApi

// 使用示例：
/**
 * import banlogApi from '@/api/banlog'
 *
 * // 获取告警信息
 * const fetchAlerts = async () => {
 *   try {
 *     const alerts = await banlogApi.getAlerts()
 *     return alerts
 *   } catch (error) {
 *     console.error('获取告警信息失败:', error)
 *     return []
 *   }
 * }
 *
 * // 添加告警IP
 * const addNewAlert = async (alertData) => {
 *   try {
 *     const res = await banlogApi.addAlertIP({
 *       ip_list: ['192.168.1.101', '192.168.1.102'],
 *       end_time: '2025-06-15 08:00:00',
 *       attacked_asset: '文件服务器',
 *       attack_method: '暴力破解',
 *       note: '新发现的攻击IP',
 *       source: '防火墙告警'
 *     })
 *     return res
 *   } catch (error) {
 *     console.error('添加告警IP失败:', error)
 *     throw error
 *   }
 * }
 *
 * // 编辑告警信息
 * const updateAlert = async (alertData) => {
 *   try {
 *     const res = await banlogApi.editAlert({
 *       attack_ip: '195.178.110.163',
 *       status: false,
 *       end_Time: '2025-12-31 23:59:59',
 *       attacked_asset: 'Web服务器',
 *       attack_method: 'SQL注入',
 *       note: '近期频繁攻击'
 *     })
 *     return res
 *   } catch (error) {
 *     console.error('编辑告警信息失败:', error)
 *     throw error
 *   }
 * }
 *
 * // 搜索日志
 * const searchLogs = async (searchType, searchValue) => {
 *   try {
 *     let logs
 *     if (searchType === 'ip') {
 *       logs = await banlogApi.searchLogsByIP(searchValue)
 *     } else if (searchType === 'source') {
 *       logs = await banlogApi.searchLogsBySource(searchValue)
 *     }
 *     return logs
 *   } catch (error) {
 *     console.error('搜索日志失败:', error)
 *     return []
 *   }
 * }
 */
