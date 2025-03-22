import request from '@/utils/request'

/**
 * @typedef {Object} NoticeConfig
 * @property {string} [dingding_webhook] - 钉钉webhook地址
 * @property {string} [secret] - 钉钉密钥
 * @property {string} [qywx_webhook] - 企业微信webhook地址
 * @property {string} [smtp_server] - SMTP服务器地址
 * @property {string} [email_from] - 发件人邮箱
 * @property {string} [email_password] - 邮箱密码
 * @property {string} [email_to] - 收件人邮箱
 * @property {string} [email_subject] - 邮件主题
 */

/**
 * @typedef {Object} Notice
 * @property {number} id - 通知ID
 * @property {string} name - 通知名称
 * @property {string} interval - 通知间隔（Cron表达式）
 * @property {string} notice_type - 通知类型（钉钉/企业微信/邮件）
 * @property {boolean} status - 通知状态
 * @property {string} message - 通知消息
 * @property {NoticeConfig} config - 通知配置
 */

// 通知类型常量
export const NOTICE_TYPES = {
  DINGDING: '钉钉',
  WEWORK: '企业微信',
  EMAIL: '邮件'
}

// 通知设置相关接口
export const noticeSettingApi = {
  /**
   * 获取所有通知设置
   * @param {Object} params - 查询参数
   * @param {string} [params.name] - 通知名称
   * @param {string} [params.type] - 通知类型
   * @param {string} [params.status] - 通知状态
   * @param {string} [params.interval] - 通知间隔
   * @returns {Promise<Notice[]>}
   */
  getNotices(params = {}) {
    return request({
      url: '/set/getNotice',
      method: 'get',
      params
    })
  },

  /**
   * 添加通知
   * @param {Notice} data - 通知信息
   * @returns {Promise<{message: string}>}
   */
  addNotice(data) {
    return request({
      url: '/set/addNotice',
      method: 'post',
      data
    })
  },

  /**
   * 编辑通知
   * @param {Notice} data - 通知信息
   * @returns {Promise<{message: string}>}
   */
  editNotice(data) {
    return request({
      url: '/set/editNotice',
      method: 'post',
      data
    })
  },

  /**
   * 删除通知
   * @param {number} id - 通知ID
   * @returns {Promise<{msg: string, code: number}>}
   */
  deleteNotice(id) {
    return request({
      url: '/set/deleteNotice',
      method: 'post',
      data: { id }
    })
  },

  /**
   * 获取机器人推送状态
   * @returns {Promise}
   */
  getRobotStatus() {
    return request({
      url: '/',
      method: 'get'
    })
  },

  /**
   * 获取日报总结
   * @returns {Promise<Blob>} - 返回文件流
   */
  getReport() {
    return request({
      url: '/work/report',
      method: 'get',
      responseType: 'blob'
    })
  }
}

// 配置模板
export const configTemplates = {
  [NOTICE_TYPES.DINGDING]: {
    dingding_webhook: '',
    secret: ''
  },
  [NOTICE_TYPES.WEWORK]: {
    qywx_webhook: ''
  },
  [NOTICE_TYPES.EMAIL]: {
    smtp_server: '',
    email_from: '',
    email_password: '',
    email_to: '',
    email_subject: ''
  }
}

export default noticeSettingApi

// 使用示例：
