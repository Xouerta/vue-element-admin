const state = {
  tableData: [],
  total: 0
}

const mutations = {
  SET_TABLE_DATA(state, {list, total}) {
    state.tableData = list
    state.total = total
  },
  UPDATE_DEVICE(state, {index, device}) {
    state.tableData.splice(index, 1, device)
  },
  DELETE_DEVICE(state, index) {
    state.tableData.splice(index, 1)
    state.total--
  },
  ADD_DEVICE(state, device) {
    state.tableData.push(device)
    state.total++
  }
}

const actions = {
  // 获取设备列表
  fetchTableData({commit}) {
    // 这里可以添加API调用
    // const response = await api.getDeviceList()
    commit('SET_TABLE_DATA', {
      list: [{
        deviceName: '长亭雷池',
        key: 'sk-*****rwS',
        connection: '空闲',
        status: '应用',
        remark: 'sk-TnBYAIOJj84ERrwS'
      },
        {
          deviceName: '长亭雷池',
          key: 'sk-*****rwS',
          connection: '空闲',
          status: '应用',
          remark: 'sk-TnBYAIOJj84ERrwS'
        }, {
          deviceName: '长亭雷池',
          key: 'sk-*****rwS',
          connection: '空闲',
          status: '应用',
          remark: 'sk-TnBYAIOJj84ERrwS'
        }
      ], total: 3
    })
  },
  // 更新设备
  updateDevice({commit, state}, device) {
    const index = state.tableData.findIndex(item => item.deviceName === device.deviceName) // todo 优化Name
    if (index !== -1) {
      commit('UPDATE_DEVICE', {index, device})
    }
  },
  // 删除设备
  deleteDevice({commit, state}, deviceName) {
    const index = state.tableData.findIndex(item => item.deviceName === deviceName)
    if (index !== -1) {
      commit('DELETE_DEVICE', index)
    }
  },
  // 添加设备
  addDevice({commit}, device) {
    commit('ADD_DEVICE', device)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
