
import axios from 'axios'
import { graphQLUrl } from '@/store/common'
import { getCurrentUserQuery } from '@/store/modules/queries'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async getCurrentUser (context) {
      const idToken = context.rootState.idToken
      const response = await axios.post(graphQLUrl, getCurrentUserQuery(), {
        headers: {
          Authorization: `${idToken}`
        }
      })
      console.log(response)
      const user = response.data.data.getCurrentUser
      context.commit('setCurrentUser', user, { root: true })
    }
  }
}
