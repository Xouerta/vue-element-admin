import {
  fetchWhitelist,
  addWhitelist,
  deleteWhitelist,
  editWhiteList,
  searchWhileListByCategory,
  searchWhileListByIP,
} from '@/api/white-list'

const state = {
  tableData: [],
  total: 0,
  loading: false
}

const mutations = {
  SET_TABLE_DATA(state, {list, total}) {
    state.tableData = list
    state.total = total
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  UPDATE_WHITELIST_STATUS(state, {ip, status}) {
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
  BATCH_UPDATE_STATUS(state, {ips, status}) {
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
  async fetchTableData({commit}, {page, pageSize, ip, type}) {
    commit('SET_LOADING', true)
    try {
      if (ip) {
        const { category, createTime, endTime, note, status } = await searchWhileListByIP(ip)
        commit('SET_TABLE_DATA', {
          list: [{"category": category, "createTime": createTime , "expireTime": endTime, "ip": ip, "note": note, "status": status}],
          total: 1
        })
        return
      }
      if (type) {
        const { entries } = await searchWhileListByCategory({category: type, page: page, pageSize: pageSize})
        commit('SET_TABLE_DATA', {
          list: entries,
          total: entries.length
        })
        return
      }

      const { entries, total } = await fetchWhitelist({
        page,
        pageSize,
      })

      commit('SET_TABLE_DATA', {
        list: entries,
        total: total
      })
    } catch (error) {
      console.error('获取数据失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 更新白名单状态
  async updateWhitelist({commit}, data) {
    try {
      await editWhiteList(data)
    } catch (error) {
      console.error('更新状态失败:', error)
      throw error
    }
  },

  // 删除白名单
  async deleteWhitelist({commit, dispatch}, ip) {
    try {
      await deleteWhitelist([ip])
    } catch (error) {
      console.error('删除失败:', error)
      throw error
    }
  },

  // 添加白名单
  async addWhitelist({commit}, data) {
    try {
      const {success_ips} =await addWhitelist(data)
      return success_ips.length
    } catch (error) {
      console.error('添加失败:', error)
      throw error
    }
  },

  // 批量启用
  async batchEnable({commit}, ips) {
    try {
      const {success_ips} = await editWhiteList({ips, status: '启用'})

      commit('SET_ADD_IPS', success_ips.length)
    } catch (error) {
      console.error('批量启用失败:', error)
      throw error
    }
  },

  // 批量禁用
  async batchDisable({commit}, ips) {
    try {
      await editWhiteList({ips, status: '禁用'})
    } catch (error) {
      console.error('批量禁用失败:', error)
      throw error
    }
  },

  // 批量删除
  async batchDelete({commit, dispatch}, ips) {
    try {
      await deleteWhitelist(ips)
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
