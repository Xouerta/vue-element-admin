import request from '@/utils/request'
import io from 'socket.io-client'

// 工作台相关接口
export const dashboardApi = {
  /**
   * 获取工作台数据
   * @returns {Promise<{
   *   DayBlock: string,
   *   TotalBlock: string,
   *   WhitelistCount: string,
   *   Devices: string,
   *   '24hBlock': string,
   *   '7dayBlock': string
   * }>}
   */
  getDashboardData() {
    return request({
      url: '/work/data',
      method: 'get'
    })
  },

  /**
   * 获取实时处理流水
   * @param {Object} params - 查询参数
   * @param {string} [params.WorkFlows] - 实时处理流水
   * @param {string} [params.id] - ID编号
   * @param {string} [params.status] - 状态
   * @returns {Promise}
   */
  getWorkFlows(params = {}) {
    return request({
      url: '/work/WorkFlows',
      method: 'get',
      params
    })
  },

  /**
   * 获取地图展示数据
   * @returns {Promise<Array<{
   *   id: number,
   *   attack_ip: string,
   *   source: string,
   *   attacked_asset: string,
   *   attack_method: string,
   *   location: string,
   *   create_time: string
   * }>>}
   */
  getMapData() {
    return request({
      url: '/work',
      method: 'get'
    })
  }
}

// WebSocket连接类
export class DashboardSocket {
  constructor(options = {}) {
    this.socket = null
    this.options = {
      url: 'ws://127.0.0.1:5000/work',
      autoReconnect: true,
      reconnectDelay: 5000,
      ...options
    }
    this.listeners = new Map()
  }

  /**
   * 连接WebSocket
   * @returns {Promise}
   */
  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.options.url)

        this.socket.on('connect', () => {
          console.log('WebSocket connected')
          resolve(this.socket)
        })

        this.socket.on('disconnect', () => {
          console.log('WebSocket disconnected')
          if (this.options.autoReconnect) {
            setTimeout(() => this.connect(), this.options.reconnectDelay)
          }
        })

        this.socket.on('error', (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        })

        // 恢复之前注册的所有监听器
        this.listeners.forEach((callback, event) => {
          this.socket.on(event, callback)
        })

      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 添加事件监听器
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  on(event, callback) {
    this.listeners.set(event, callback)
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  /**
   * 移除事件监听器
   * @param {string} event - 事件名称
   */
  off(event) {
    this.listeners.delete(event)
    if (this.socket) {
      this.socket.off(event)
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export default {
  dashboardApi,
  DashboardSocket
}

// 使用示例：
/**
 * // 在Vue组件中使用
 * import { dashboardApi, DashboardSocket } from '@/api/dashboard'
 *
 * export default {
 *   data() {
 *     return {
 *       dashboardData: null,
 *       workFlows: [],
 *       mapData: [],
 *       socket: null
 *     }
 *   },
 *
 *   async created() {
 *     // 获取初始数据
 *     await this.fetchDashboardData()
 *
 *     // 建立WebSocket连接
 *     this.socket = new DashboardSocket()
 *     await this.socket.connect()
 *
 *     // 监听实时数据更新
 *     this.socket.on('data_update', (data) => {
 *       // 处理实时数据更新
 *       this.handleDataUpdate(data)
 *     })
 *   },
 *
 *   methods: {
 *     async fetchDashboardData() {
 *       try {
 *         const [dashboardData, workFlows, mapData] = await Promise.all([
 *           dashboardApi.getDashboardData(),
 *           dashboardApi.getWorkFlows(),
 *           dashboardApi.getMapData()
 *         ])
 *
 *         this.dashboardData = dashboardData
 *         this.workFlows = workFlows
 *         this.mapData = mapData
 *       } catch (error) {
 *         console.error('获取数据失败:', error)
 *       }
 *     },
 *
 *     handleDataUpdate(data) {
 *       // 处理实时数据更新逻辑
 *     }
 *   },
 *
 *   beforeDestroy() {
 *     // 组件销毁时断开WebSocket连接
 *     if (this.socket) {
 *       this.socket.disconnect()
 *     }
 *   }
 * }
 */
