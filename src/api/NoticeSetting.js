import request from '@/utils/request'

// 设备通知相关接口
export const settingApi = {
  /**
   * 获取设备通知
   * @param {Object} params - 查询参数
   * @param {string} [params.name] - 名称
   * @param {string} [params.type] - 类型
   * @param {string} [params.status] - 状态
   * @param {string} [params.interval] - 间隔
   * @returns {Promise}
   */
  getNotice(params) {
    return request({
      url: '/set/getNotice',
      method: 'get',
      params
    })
  },

  /**
   * 设置设备通知
   * @param {Object} params - 通知参数
   * @param {string} [params.name] - 名称
   * @param {string} [params.interval] - 通知间隔
   * @param {string} [params.type] - 通知类型
   * @returns {Promise}
   */
  setNotice(params) {
    return request({
      url: '/set/setNotice',
      method: 'post',
      params
    })
  },

  /**
   * 删除通知
   * @returns {Promise}
   */
  deleteNotice() {
    return request({
      url: '/set/deleteNotice',
      method: 'delete'
    })
  },

  /**
   * 获取机器人推送
   * @returns {Promise}
   */
  getRobot() {
    return request({
      url: '/work/robot',
      method: 'get'
    })
  },

  /**
   * 获取日报总结
   * @returns {Promise}
   */
  getDailySummary() {
    return request({
      url: '/',
      method: 'get'
    })
  }
}

export default settingApi
