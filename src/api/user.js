import request from '@/utils/request'

/**
 * @typedef {Object} LoginResponse
 * @property {string} msg - 提示信息
 * @property {number} code - 状态码
 * @property {string} name - 用户名
 */

/**
 * @typedef {Object} ResetPasswordResponse
 * @property {number} code - 状态码
 * @property {string} msg - 提示信息
 */

/**
 * @typedef {Object} SessionResponse
 * @property {number} code - 状态码
 * @property {boolean} islogin - 是否登录
 * @property {string} name - 用户名
 */

/**
 * @typedef {Object} AdminCheckResponse
 * @property {number} code - 状态码
 * @property {boolean} is_admin - 是否为管理员
 * @property {string} name - 用户名
 */

// 用户认证相关接口
export const userApi = {
  /**
   * 用户登录
   * @param {Object} data - 登录信息
   * @param {string} data.name - 用户名
   * @param {string} data.password - 密码
   * @returns {Promise<LoginResponse>}
   */
  login(data) {
    return request({
      url: '/auth/Login',
      method: 'post',
      data
    })
  },

  /**
   * 重置密码
   * @param {Object} data - 密码信息
   * @param {string} data.password - 旧密码
   * @param {string} data.newpassword1 - 新密码
   * @returns {Promise<ResetPasswordResponse>}
   */
  resetPassword(data) {
    return request({
      url: '/auth/ResetPassword',
      method: 'post',
      data
    })
  },

  /**
   * 用户登出
   * @returns {Promise<{code: number, msg: string}>}
   */
  logout() {
    return request({
      url: '/auth/Logout',
      method: 'post'
    })
  },

  /**
   * 检查登录状态
   * @returns {Promise<SessionResponse>}
   */
  checkSession() {
    return request({
      url: '/auth/CheckSession',
      method: 'get'
    })
  },

  /**
   * 检查是否为管理员
   * @returns {Promise<AdminCheckResponse>}
   */
  checkIsAdmin() {
    return request({
      url: '/auth/CheckIsAdmin',
      method: 'get'
    })
  }
}

// 响应状态码常量
export const ResponseCode = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  ERROR: 500
}

export default userApi
