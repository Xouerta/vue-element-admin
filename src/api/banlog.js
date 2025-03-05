import request from '@/utils/request'

// 封禁IP相关接口
export const banlogApi = {
  /**
   * 删除封禁IP
   * @param {Object} data - 请求数据
   * @param {string[]} data.IP - 要删除的IP数组
   * @returns {Promise}
   * @example
   * deleteBanList({ IP: ['192.168.2.100', '192.168.1.101'] })
   */
  deleteBanList(data) {
    return request({
      url: '/device/alarm/hfish/deleteBanList',
      method: 'post',
      data
    })
  },

  /**
   * 获取封禁信息
   * @returns {Promise}
   */
  getAttackInfo() {
    return request({
      url: '/device/alarm/hfish/get_attack_info',
      method: 'get'
    })
  },

  /**
   * 封禁处理（添加封禁IP）
   * @param {Object} params - 封禁参数
   * @param {string[]} params.IP - 封禁IP数组
   * @param {string} [params.expireTime] - 过期时间
   * @param {string} [params.UnderAttack] - 被攻击资产
   * @param {string} [params.Weapons] - 攻击方式
   * @param {string} [params.note] - 备注
   * @returns {Promise}
   */
  setBanList(params) {
    return request({
      url: '/device/setBanlist',
      method: 'post',
      params
    })
  },

  /**
   * 生成封禁报告
   * @returns {Promise}
   */
  getBanReport() {
    return request({
      url: '/work/getBanReport',
      method: 'get'
    })
  },

  /**
   * 添加封禁IP（hfish）
   * @param {Object} data - 封禁数据
   * @param {string[]} data.IP - 封禁IP数组
   * @param {string} data.expireTime - 过期时间
   * @param {string} data.UnderAttack - 被攻击资产
   * @param {string} data.Weapons - 攻击方式
   * @param {string} data.note - 备注
   * @returns {Promise}
   * @example
   * setHfishBanList({
   *   IP: ['192.168.1.100', '192.168.1.101'],
   *   expireTime: '2025-12-31 23:59:59',
   *   UnderAttack: '蜜罐服务器',
   *   Weapons: '端口扫描',
   *   note: '疑似恶意扫描行为'
   * })
   */
  setHfishBanList(data) {
    return request({
      url: '/device/alarm/hfish/setBanlist',
      method: 'post',
      data
    })
  },

  /**
   * 获取记录日志
   * @returns {Promise}
   */
  getLog() {
    return request({
      url: '/device/getLog',
      method: 'get'
    })
  }
}

export default banlogApi
