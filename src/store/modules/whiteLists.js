const state = {
  tableData: [
    {
      ip: '192.168.1.1',
      type: '测试',
      status: 1,
      createTime: Date.now(),
      expireTime: new Date('2024-12-31 23:59:59').getTime(),
      remark: '测试IP'
    },
    {
      ip: '192.168.1.2',
      type: '开发',
      status: 0,
      createTime: Date.now(),
      expireTime: new Date('2024-12-31 23:59:59').getTime(),
      remark: '开发IP'
    }
  ],
  total: 2,
  loading: false
}

const mutations = {
  SET_TABLE_DATA(state, { list, total }) {
    state.tableData = list
    state.total = total
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  UPDATE_WHITELIST_STATUS(state, { ip, status }) {
    const item = state.tableData.find(item => item.ip === ip)
    if (item) {
      item.status = status
    }
  },
  DELETE_WHITELIST(state, ip) {
    const prevLength = state.tableData.length
    state.tableData = state.tableData.filter(item => item.ip !== ip)
    if (state.tableData.length < prevLength) {
      state.total = Math.max(0, state.total - 1)
    }
  },
  ADD_WHITELIST(state, whitelist) {
    state.tableData.unshift(whitelist)
    state.total++
  },
  BATCH_UPDATE_STATUS(state, { ips, status }) {
    ips.forEach(ip => {
      const item = state.tableData.find(item => item.ip === ip)
      if (item) {
        item.status = status
      }
    })
  },
  BATCH_DELETE(state, ips) {
    const prevLength = state.tableData.length
    state.tableData = state.tableData.filter(item => !ips.includes(item.ip))
    const deletedCount = prevLength - state.tableData.length
    state.total = Math.max(0, state.total - deletedCount)
  }
}

const actions = {
  // 获取白名单列表
  async fetchTableData({ commit }, { page, pageSize, ip, type }) {
    commit('SET_LOADING', true)
    try {

      // 模拟搜索过滤
      let filteredList = state.tableData
      if (ip) {
        filteredList = filteredList.filter(item => item.ip.includes(ip))
      }
      if (type) {
        filteredList = filteredList.filter(item => item.type.includes(type))
      }

      // 模拟分页
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const paginatedList = filteredList.slice(start, end)

      commit('SET_TABLE_DATA', {
        list: paginatedList,
        total: filteredList.length
      })
    } catch (error) {
      console.error('获取数据失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 更新白名单状态
  async updateWhitelist({ commit }, data) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      commit('UPDATE_WHITELIST_STATUS', {
        ip: data.ip,
        status: data.status
      })
    } catch (error) {
      console.error('更新状态失败:', error)
      throw error
    }
  },

  // 删除白名单
  async deleteWhitelist({ commit, dispatch }, ip) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      commit('DELETE_WHITELIST', ip)
      // 删除后重新获取当前页数据
      await dispatch('fetchTableData', {
        page: state.currentPage,
        pageSize: state.pageSize
      })
    } catch (error) {
      console.error('删除失败:', error)
      throw error
    }
  },

  // 添加白名单
  async addWhitelist({ commit }, data) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      commit('ADD_WHITELIST', {
        ...data,
        createTime: Date.now(),
        expireTime: new Date(data.expireTime).getTime(),
        status: 1
      })
    } catch (error) {
      console.error('添加失败:', error)
      throw error
    }
  },

  // 批量启用
  async batchEnable({ commit }, ips) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      commit('BATCH_UPDATE_STATUS', { ips, status: 0 })
    } catch (error) {
      console.error('批量启用失败:', error)
      throw error
    }
  },

  // 批量禁用
  async batchDisable({ commit }, ips) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      commit('BATCH_UPDATE_STATUS', { ips, status: 1 })
    } catch (error) {
      console.error('批量禁用失败:', error)
      throw error
    }
  },

  // 批量删除
  async batchDelete({ commit, dispatch }, ips) {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      commit('BATCH_DELETE', ips)
      // 删除后重新获取当前页数据
      await dispatch('fetchTableData', {
        page: state.currentPage,
        pageSize: state.pageSize
      })
    } catch (error) {
      console.error('批量删除失败:', error)
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
