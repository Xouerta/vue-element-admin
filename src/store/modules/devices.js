const state = {
  tableData: [
    {
      deviceName: '长亭雷池',
      key: 'sk-*****rwS',
      connection: '空闲',
      status: '应用',
      remark: 'sk-TnBYAIOJj84ERrwS'
    }
  ]
}

const mutations = {
  SET_TABLE_DATA(state, data) {
    state.tableData = data
  },
  UPDATE_DEVICE(state, { index, device }) {
    state.tableData.splice(index, 1, device)
  },
  DELETE_DEVICE(state, index) {
    state.tableData.splice(index, 1)
  },
  ADD_DEVICE(state, device) {
    state.tableData.push(device)
  }
}

const actions = {
  // 获取设备列表
  fetchTableData({ commit }) {
    // 这里可以添加API调用
    // const response = await api.getDeviceList()
    // commit('SET_TABLE_DATA', response.data)
  },
  // 更新设备
  updateDevice({ commit, state }, device) {
    const index = state.tableData.findIndex(item => item.deviceName === device.deviceName)
    if (index !== -1) {
      commit('UPDATE_DEVICE', { index, device })
    }
  },
  // 删除设备
  deleteDevice({ commit, state }, deviceName) {
    const index = state.tableData.findIndex(item => item.deviceName === deviceName)
    if (index !== -1) {
      commit('DELETE_DEVICE', index)
    }
  },
  // 添加设备
  addDevice({ commit }, device) {
    commit('ADD_DEVICE', device)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
