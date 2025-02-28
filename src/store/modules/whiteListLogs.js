const state = {
  tableData: [
    {
      ip: '101.42.16.99',
      type: '本地服务',
      remark: 'xxx',
      updateTime: Date.now(),
      status: 'delete'
    },
    {
      ip: '101.42.16.99',
      type: '本地服务',
      remark: 'xxx',
      updateTime: Date.now() - 15000,
      status: 'add'
    },
    {
      ip: '192.168.1.100',
      type: '开发环境',
      remark: '开发测试使用',
      updateTime: Date.now() - 3600000, // 1小时前
      status: 'add'
    },
    {
      ip: '192.168.1.101',
      type: '测试环境',
      remark: 'QA测试服务器',
      updateTime: Date.now() - 7200000, // 2小时前
      status: 'delete'
    },
    {
      ip: '10.0.0.1/24',
      type: '生产环境',
      remark: '生产网段',
      updateTime: Date.now() - 86400000, // 1天前
      status: 'add'
    },
    {
      ip: '172.16.0.100',
      type: '办公网络',
      remark: '办公室固定IP',
      updateTime: Date.now() - 172800000, // 2天前
      status: 'delete'
    },
    {
      ip: '192.168.2.0/24',
      type: '测试网段',
      remark: '测试部门网段',
      updateTime: Date.now() - 259200000, // 3天前
      status: 'add'
    },
    {
      ip: '192.168.3.100',
      type: '开发服务器',
      remark: 'Jenkins服务器',
      updateTime: Date.now() - 345600000, // 4天前
      status: 'delete'
    },
    {
      ip: '192.168.4.50',
      type: '监控系统',
      remark: 'Prometheus服务器',
      updateTime: Date.now() - 432000000, // 5天前
      status: 'add'
    },
    {
      ip: '192.168.5.0/24',
      type: '办公网段',
      remark: '研发部网段',
      updateTime: Date.now() - 518400000, // 6天前
      status: 'delete'
    },
    {
      ip: '192.168.6.100',
      type: '数据库服务器',
      remark: 'MySQL主服务器',
      updateTime: Date.now() - 604800000, // 7天前
      status: 'add'
    },
    {
      ip: '192.168.7.0/24',
      type: 'VPN网段',
      remark: '远程办公VPN',
      updateTime: Date.now() - 691200000, // 8天前
      status: 'delete'
    },
    {
      ip: '192.168.8.100',
      type: '开发服务器',
      remark: 'Jenkins服务器',
      updateTime: Date.now() - 777600000, // 9天前
      status: 'delete'
    },
    {
      ip: '192.168.9.0/24',
      type: 'VPN网段',
      remark: '远程办公VPN',
      updateTime: Date.now() - 864000000, // 10天前
      status: 'add'
    },
    {
      ip: '192.168.10.100',
      type: '开发服务器',
      remark: 'Jenkins服务器',
      updateTime: Date.now() - 950400000, // 11天前
      status: 'delete'
    },
    {
      ip: '192.168.11.0/24',
      type: 'VPN网段',
      remark: '远程办公VPN',
      updateTime: Date.now() - 1036800000, // 12天前
      status: 'add'
    },
    {
      ip: '192.168.12.100',
      type: '开发服务器',
      remark: 'Jenkins服务器',
      updateTime: Date.now() - 1123200000, // 13天前
      status: 'delete'
    },
    {
      ip: '192.168.13.0/24',
      type: 'VPN网段',
      remark: '远程办公VPN',
      updateTime: Date.now() - 1209600000, // 14天前
      status: 'add'
    },
    {
      ip: '192.168.14.100',
      type: '开发服务器',
      remark: 'Jenkins服务器',
      updateTime: Date.now() - 1296000000, // 15天前
      status: 'delete'
    },
    {
      ip: '192.168.15.0/24',
      type: 'VPN网段',
      remark: '远程办公VPN',
      updateTime: Date.now() - 1382400000, // 16天前
      status: 'add'
    },
    {
      ip: '192.168.16.100',
      type: '开发服务器',
      remark: 'Jenkins服务器',
      updateTime: Date.now() - 1468800000, // 17天前
      status: 'delete'
    },
    {
      ip: '192.168.17.0/24',
      type: 'VPN网段',
      remark: '远程办公VPN',
      updateTime: Date.now() - 1555200000, // 18天前
    }

  ],
  total: 22,
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
      // 模拟搜索过滤
      let filteredList = state.tableData
      if (ip) {
        filteredList = filteredList.filter(item => item.ip.includes(ip))
      }
      if (type) {
        filteredList = filteredList.filter(item => item.type.includes(type))
      }

      // 计算总页数
      const totalPages = Math.ceil(filteredList.length / pageSize)
      // 确保当前页码不超过总页数
      const validPage = Math.min(page, totalPages || 1)

      // 模拟分页
      const start = (validPage - 1) * pageSize
      const end = start + pageSize
      const paginatedList = filteredList.slice(start, end)

      // 更新表格数据和总数
      commit('SET_TABLE_DATA', {
        list: paginatedList,
        total: filteredList.length
      })

      // 返回实际的页码，以便组件更新
      return validPage
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
