import axios from 'axios'
import {
  createAccountQuery,
  subscribeToPlanQuery,
  deleteAccountQuery,
  creditAccountMutation,
  CancelPlanSubscriptionMutation
} from '../modules/queries'
import { graphQLUrl } from '@/store/common'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async delete (context, { accountId }) {
      await axios.post(
        graphQLUrl,
        deleteAccountQuery(
          accountId,
          context.rootState.providerId
        ),
        {
          headers: {
            Authorization: `${context.rootState.idToken}`
          }
        }
      )
    },
    async create (context, { accountId }) {
      await axios.post(
        graphQLUrl,
        createAccountQuery(
          accountId,
          context.rootState.providerId), {
          headers: {
            Authorization: `${context.rootState.idToken}`
          }
        }
      )
    },
    async credit (context, { accountId, amount }) {
      await axios.post(
        graphQLUrl,
        creditAccountMutation(
          accountId,
          context.rootState.providerId,
          amount
        ), {
          headers: {
            Authorization: `${context.rootState.idToken}`
          }
        }
      )
    },
    async subscribeToCurrentPlanVersion (context, { accountId }) {
      await axios.post(
        graphQLUrl,
        subscribeToPlanQuery(
          accountId,
          context.rootState.providerId,
          context.rootState.currentPlanVersionId
        ),
        {
          headers: {
            Authorization: `${context.rootState.idToken}`
          }
        }
      )
    },
    async CancelPlanSubscription (context, { accountId }) {
      await axios.post(
        graphQLUrl,
        CancelPlanSubscriptionMutation(
          accountId,
          context.rootState.providerId,
          context.rootState.currentPlanVersionId
        ),
        {
          headers: {
            Authorization: `${context.rootState.idToken}`
          }
        }
      )
      // Add updating the current plan version for an account
      const planDetails = context.rootState.currentPlanInformation
      const currentAccountState = context.rootState.accounts[accountId]
      currentAccountState.subscription.push(planDetails)
      const newAccountState = await currentAccountState
      console.log(newAccountState)
      await context.commit('putAccount', newAccountState, { root: true })
    }
  }
}
