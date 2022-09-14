import axios from 'axios'

import { notificationsUrl } from '@/store/common'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async update (context, { accountId, deviceId }) {
      const providerId = context.rootState.providerId
      const url = `${notificationsUrl}notifications?providerId=${providerId}&accountId=${accountId}`
      const result = await axios.get(url)
      const notifications = result.data.items
      for (let i = 0; i < notifications.length; i++) {
        context.commit('addLog', {
          deviceId: deviceId,
          log: {
            id: notifications[i].timestamp,
            text: notifications[i].message,
            style: 'notification'
          }
        }, { root: true })
      }
    }
  }
}
