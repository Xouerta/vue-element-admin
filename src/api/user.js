import request from '@/utils/request'

// 用户认证相关接口
export const userApi = {
  /**
   * 普通用户登录
   * @param {Object} data - 登录信息
   * @param {string} data.name - 用户名
   * @param {string} data.password - 密码
   * @returns {Promise}
   * @example
   * login({ name: 'admin', password: '123456' })
   */
  login(data) {
    return request({
      url: '/auth/user/Login',
      method: 'post',
      data
    })
  },

  /**
   * 管理员登录
   * @param {Object} data - 登录信息
   * @param {string} data.name - 用户名
   * @param {string} data.password - 密码
   * @returns {Promise}
   */
  adminLogin(data) {
    return request({
      url: '/auth/admin/Login',
      method: 'post',
      data
    })
  },

  /**
   * 普通用户重设密码
   * @param {Object} data - 密码信息
   * @param {string} data.password - 原密码
   * @param {string} data.newpassword - 新密码
   * @returns {Promise}
   */
  resetPassword(data) {
    return request({
      url: '/auth/user/ResetPassword',
      method: 'post',
      data
    })
  },

  /**
   * 管理员重设密码
   * @param {Object} data - 密码信息
   * @param {string} data.password - 原密码
   * @param {string} data.newpassword - 新密码
   * @returns {Promise}
   */
  adminResetPassword(data) {
    return request({
      url: '/auth/admin/ResetPassword',
      method: 'post',
      data
    })
  },

  /**
   * 普通用户登出
   * @returns {Promise}
   */
  logout() {
    return request({
      url: '/auth/user/Logout',
      method: 'delete'
    })
  },

  /**
   * 管理员登出
   * @returns {Promise}
   */
  adminLogout() {
    return request({
      url: '/auth/admin/Logout',
      method: 'delete'
    })
  },

  /**
   * 检查普通用户登录状态
   * @returns {Promise}
   */
  checkSession() {
    return request({
      url: '/auth/user/Session',
      method: 'get'
    })
  },

  /**
   * 检查管理员登录状态
   * @returns {Promise}
   */
  checkAdminSession() {
    return request({
      url: '/auth/admin/Session',
      method: 'get'
    })
  },

  getInfo(token) {
    return request({
      url: '/auth/user/Info',
      method: 'get',
      params: { token }
    })
  }
}

export default userApi
