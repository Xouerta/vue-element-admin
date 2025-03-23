import {
  fetchList,
  addDevice,
  deleteDevice,
  getDeviceDoc,
  searchDevice,
  editDevice
} from '@/api/alarm-device'

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
  },
  UPDATE_DEVICE_DOC(state, {name, connect, ip, key, note, status}) {
    state.tableData = state.tableData.map(item => {
      if (item.name === name) {
        return {
          ...item,
          connect: connect,
          ip: ip,
          key: key,
          note: note,
          status: status
        }
      }
      return item
    })
  }
}

const actions = {
  // 获取设备列表
  async fetchTableData({commit}, {page, pageSize, query}) {
    if (query) {
      const {devices} = await searchDevice(query)
      commit('SET_TABLE_DATA', {
        list: devices,
        total: devices.length
      })
      return
    }
    const {devices, total} = await fetchList({page, pageSize})
    commit('SET_TABLE_DATA', {
      list: devices,
      total: total
    })
  },
  // 更新设备
  updateDevice({commit, state}, device) {
    editDevice(device)
  },
  // 删除设备
  async deleteDevice({commit, state}, deviceName) {
    await deleteDevice({name: deviceName})
  },
  // 添加设备
  async addDevice({commit}, device) {
    const {key} = await addDevice(device)
    commit('ADD_DEVICE', {...device, key: key})
  },
  async deviceDoc({commit}, name) {
    const {info} = await getDeviceDoc(name)
    const {connect, ip, key, note, status} = info
    commit('UPDATE_DEVICE_DOC', {name, connect, ip, key, note, status})
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
