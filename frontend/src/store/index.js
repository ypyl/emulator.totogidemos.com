import { createStore } from 'vuex'

import account from './modules/account.js'
import accountBalances from './modules/accountBalances.js'
import charge5g from './modules/charge5g.js'
import device from './modules/device.js'
import edrs from './modules/edrs.js'
import notifications from './modules/notifications.js'
import planVersionAllocations from './modules/planVersionAllocations.js'
import planVersions from './modules/planVersions.js'
import signIn from './modules/signIn.js'
import unitMapping from './modules/unitMapping.js'
import credit5g from './modules/credit5g.js'
import logging from './modules/logging.js'

export default createStore({
  state () {
    return {
      verboseLogging: false,
      idToken: '',
      providerId: '',
      unitTypeMapping: {
        100: 'time',
        200: 'serviceSpecificUnits',
        300: 'totalVolume',
        400: 'serviceSpecificUnits'
      },
      deviceLogs: {},
      zeroRatedData: false,
      accountDeviceError: false,
      currentSmsBalance: 'loading...',
      currentVoiceBalanceMinutes: 'loading...',
      currentDataBalanceMb: 'loading...',
      currentMonetaryBalance: 'loading...',
      currentNonMonetaryBalances: [],
      planVersionSmsAllocation: null,
      planVersionVoiceAllocationMinutes: null,
      planVersionDataAllocationMb: null,
      allAvailablePlanInformation: {},
      allPlanVersionAllocations: [],
      currentPlanInformation: {},
      accounts: {}
    }
  },
  getters: {
  },
  mutations: {
    toggleVerboseLogging (state) {
      state.verboseLogging = !state.verboseLogging
    },
    setProviderId (state, providerId) {
      state.providerId = providerId
    },
    setIdToken (state, idToken) {
      state.idToken = idToken
    },
    updateUnitTypeMapping (state, newMapping) {
      state.unitTypeMapping = newMapping
    },
    putAccount (state, newAccountDetails) {
      state.accounts[newAccountDetails.accountId] = newAccountDetails
    },
    addLog (state, { log, deviceId }) {
      // Check if the device ID has a log setup for it
      // otherwise create it
      if (!(deviceId in state.deviceLogs)) {
        state.deviceLogs[deviceId] = []
      }
      let logLengthLimit
      if (state.verboseLogging) {
        state.deviceLogs[deviceId].push(log)
        logLengthLimit = 4
      } else {
        state.deviceLogs[deviceId].push(log)
        logLengthLimit = 15
      }
      const ids = state.deviceLogs[deviceId].map(o => o.id)
      const filtered = state.deviceLogs[deviceId].filter(({ id }, index) => !ids.includes(id, index + 1))
      state.deviceLogs[deviceId] = filtered
      state.deviceLogs[deviceId].sort((a, b) => {
        if (a.id < b.id) {
          return -1
        }
        if (a.id > b.id) {
          return 1
        }
        return 0
      })
      if (state.deviceLogs[deviceId].length > logLengthLimit) {
        state.deviceLogs[deviceId].shift()
      }
    },
    setAccountDeviceError (state, errorState) {
      state.accountDeviceError = errorState
    },
    setPlanVersionSmsAllocation (state, planVersionSmsAllocation) {
      state.planVersionSmsAllocation = planVersionSmsAllocation
    },
    setPlanVersionVoiceAllocationMinutes (state, planVersionVoiceAllocationMinutes) {
      state.planVersionVoiceAllocationMinutes = planVersionVoiceAllocationMinutes
    },
    setPlanVersionDataAllocationMb (state, planVersionDataAllocationMb) {
      state.planVersionDataAllocationMb = planVersionDataAllocationMb
    },
    setCurrentSmsBalance (state, currentSmsBalance) {
      state.currentSmsBalance = currentSmsBalance
    },
    setCurrentVoiceBalanceMinutes (state, currentVoiceBalanceMinutes) {
      state.currentVoiceBalanceMinutes = currentVoiceBalanceMinutes
    },
    setCurrentDataBalanceMb (state, currentDataBalanceMb) {
      state.currentDataBalanceMb = currentDataBalanceMb
    },
    setCurrentMonetaryBalance (state, currentMonetaryBalance) {
      state.currentMonetaryBalance = currentMonetaryBalance
    },
    setCurrentNonMonetaryBalances (state, currentNonMonetaryBalances) {
      state.currentNonMonetaryBalances = currentNonMonetaryBalances
    },
    setCurrentPlanInformation (state, currentPlanInformation) {
      state.currentPlanInformation = currentPlanInformation
      state.currentPlanVersionId = currentPlanInformation.planVersionId
    },
    setAllAvailablePlanInformation (state, allAvailablePlanInformation) {
      state.allAvailablePlanInformation = allAvailablePlanInformation
    },
    setAllPlanVersionAllocations (state, allowances) {
      state.allPlanVersionAllocations = allowances
    }
  },
  actions: {},
  modules: {
    account: account,
    accountBalances: accountBalances,
    charge5g: charge5g,
    credit5g: credit5g,
    device: device,
    edrs: edrs,
    logging: logging,
    notifications: notifications,
    planVersionAllocations: planVersionAllocations,
    planVersions: planVersions,
    signIn: signIn,
    unitMapping: unitMapping
  }
})
