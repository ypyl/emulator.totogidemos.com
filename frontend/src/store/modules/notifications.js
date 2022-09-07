import axios from 'axios'

import { notificationsUrl } from '@/store/common'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async update (context, { accountId }) {
      const providerId = context.rootState.providerId
      // End of next like should be updated to this at the end insread of deviceId:
      //  &accountId=${accountId}`
      // Needs to be done after the notifications service is migrated over though
      const url = `${notificationsUrl}notifications?providerId=${providerId}&deviceId=${accountId}`
      const result = await axios.get(url)
      const notifications = result.data.items
      for (let i = 0; i < notifications.length; i++) {
        context.commit('addLog', {
          id: notifications[i].timestamp,
          text: notifications[i].message,
          style: 'notification'
        }, { root: true })
      }
    }
  }
}
