import axios from 'axios'
import { graphQLUrl } from '@/store/common'
import { getMyProviderConfig } from '../modules/queries'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async getMyProviderConfig (context) {
      const idToken = await context.rootState.idToken
      const providerConfigResponse = await axios.post(
        graphQLUrl,
        getMyProviderConfig(), {
          headers: {
            Authorization: `${idToken}`
          }
        }
      )
      console.log('My provider config response:')
      console.log(providerConfigResponse)
      try {
        const providerConfigData = providerConfigResponse.data.data.getMyProviderConfig
        if (providerConfigData.__typename !== 'ProviderConfig') {
          throw new Error('Error while fetching ProviderConfig!')
        }
        const homeNetworks = providerConfigData.homeNetworks
        console.log('homeNetworks:', homeNetworks)
        const mcc = homeNetworks.substr(0, 3)
        const mnc = homeNetworks.substr(3)
        console.log('mcc:', mcc)
        console.log('mnc:', mnc)
        context.commit('updateMcc', mcc, { root: true })
        context.commit('updateMnc', mnc, { root: true })
      } catch (e) {
        console.error('Setting MCC and MNC failed: ', e.toString())
      }
    }
  }
}
