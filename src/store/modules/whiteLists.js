import request from '@/utils/request'

const state = {
  tableData: [],
  total: 0
}

const mutations = {
  SET_TABLE_DATA(state, { list, total }) {
    state.tableData = list
    state.total = total
  },
  UPDATE_WHITELIST_STATUS(state, { ip, status }) {
    const item = state.tableData.find(item => item.ip === ip)
    if (item) {
      item.status = status
    }
  },
  DELETE_WHITELIST(state, ip) {
    state.tableData = state.tableData.filter(item => item.ip !== ip)
    state.total--
  },
  ADD_WHITELIST(state, whitelist) {
    state.tableData.unshift(whitelist)
    state.total++
  }
}

const actions = {
  // 获取白名单列表
  async fetchTableData({ commit }, params) {
    try {

      commit('SET_TABLE_DATA', {
        list: [
          {
            ip: '192.168.1.1',
            status: 1,
            createTime: '2023-07-01 12:00:00'
            // 其他字段
          },
          {
            ip: '192.168.1.2',
            status: 0,
            createTime: '2023-07-01 12:00:00'
            // 其他字段
          }
        ],
        total: 2
      })
      return state.tableData
    } catch (error) {
      throw error
    }
  },

  // 更新白名单
  async updateWhitelist({ commit }, data) {
    try {
      const response = await request({
        url: `/api/whitelist/${data.ip}`,
        method: 'put',
        data
      })
      commit('UPDATE_WHITELIST_STATUS', {
        ip: data.ip,
        status: data.status
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 删除白名单
  async deleteWhitelist({ commit }, ip) {
    try {
      const response = await request({
        url: `/api/whitelist/${ip}`,
        method: 'delete'
      })
      commit('DELETE_WHITELIST', ip)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 添加白名单
  async addWhitelist({ commit }, data) {
    try {
      const response = await request({
        url: '/api/whitelist',
        method: 'post',
        data
      })
      commit('ADD_WHITELIST', {
        ...data,
        createTime: new Date().toISOString(),
        status: 0 // 默认启用
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 批量启用
  async batchEnable({ dispatch }, ips) {
    try {
      const response = await request({
        url: '/api/whitelist/batch-enable',
        method: 'put',
        data: { ips }
      })
      // 重新获取列表以确保数据同步
      await dispatch('fetchTableData')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 批量禁用
  async batchDisable({ dispatch }, ips) {
    try {
      const response = await request({
        url: '/api/whitelist/batch-disable',
        method: 'put',
        data: { ips }
      })
      // 重新获取列表以确保数据同步
      await dispatch('fetchTableData')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // 批量删除
  async batchDelete({ dispatch }, ips) {
    try {
      const response = await request({
        url: '/api/whitelist/batch-delete',
        method: 'delete',
        data: { ips }
      })
      // 重新获取列表以确保数据同步
      await dispatch('fetchTableData')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
