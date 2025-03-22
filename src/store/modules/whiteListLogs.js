import {
  logWhitelistOperation,
  searchWhileListLogByIP,
  searchWhileListLogByCategory
} from '@/api/white-list'

const state = {
  tableData: [],
  total: 0,
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
  ADD_LOG(state, log) {
    state.tableData.unshift(log)
    state.total++
  }
}

const actions = {
  // 获取日志列表
  async fetchTableData({ commit }, { page, pageSize, ip, type }) {
    commit('SET_LOADING', true)
    try {

      if (ip) {
        const { log_info, total } = await searchWhileListLogByIP(ip)
        commit('SET_TABLE_DATA', {
          list: log_info,
          total
        })
        return
      }
      if (type) {
        const { log_info, total } = await searchWhileListLogByCategory({category: type, page: page, pageSize: pageSize})
        commit('SET_TABLE_DATA', {
          list: log_info,
          total
        })
        return
      }
      const { log_info, total } = await logWhitelistOperation(page, pageSize)

      commit('SET_TABLE_DATA', {
        list: log_info,
        total: total
      })

    } catch (error) {
      console.error('获取日志失败:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // 添加日志记录
  async addLog({ commit }, { ip, type, remark, status }) {
    try {
      const log = {
        ip,
        type,
        remark,
        updateTime: Date.now(),
        status // 'add' 或 'delete'
      }
      commit('ADD_LOG', log)
    } catch (error) {
      console.error('添加日志失败:', error)
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
