import request from '@/utils/request'

// 证书相关接口
export const licenceApi = {
  /**
   * 获取证书信息
   * @param {Object} params - 查询参数
   * @param {string} [params.status] - 状态
   * @param {string} [params.Litype] - 证书类型
   * @param {string} [params.WhitelistCount] - 白名单数量
   * @param {string} [params.AlarmCount] - 告警设备数量
   * @param {string} [params.BanCount] - 封禁设备数量
   * @param {string} [params.ExpireTime] - 过期时间
   * @param {string} [params.id] - ID编号
   * @param {string} [params.mail] - 邮箱
   * @returns {Promise}
   */
  getLicence(params = {}) {
    return request({
      url: '/set/getLicence',
      method: 'get',
      params
    })
  },

  /**
   * 设置证书信息
   * @param {Object} params - 证书参数
   * @param {string} [params.id] - 证书编码
   * @param {string} [params.mail] - 电子邮件
   * @returns {Promise}
   */
  setLicence(params) {
    return request({
      url: '/set/setLicence',
      method: 'post',
      params
    })
  }
}

// 证书状态常量
export const LICENCE_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  INVALID: 'invalid'
}

// 证书类型常量
export const LICENCE_TYPE = {
  TRIAL: 'trial',
  STANDARD: 'standard',
  ENTERPRISE: 'enterprise'
}

export default licenceApi

// 使用示例：
/**
 * // 获取证书信息
 * const getLicenceInfo = async () => {
 *   try {
 *     const res = await licenceApi.getLicence({
 *       status: LICENCE_STATUS.ACTIVE,
 *       Litype: LICENCE_TYPE.ENTERPRISE
 *     })
 *     return res.data
 *   } catch (error) {
 *     console.error('获取证书信息失败:', error)
 *     return null
 *   }
 * }
 *
 * // 设置证书信息
 * const updateLicence = async (id, mail) => {
 *   try {
 *     const res = await licenceApi.setLicence({
 *       id,
 *       mail
 *     })
 *     return res.data
 *   } catch (error) {
 *     console.error('设置证书信息失败:', error)
 *     return null
 *   }
 * }
 */
