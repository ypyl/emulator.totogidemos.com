import axios from 'axios'
import moment from 'moment'
import {
  initUrl,
  initData,
  updateUrl,
  updateData,
  terminateUrl,
  terminateData,
  getLogTimeSummary,
  getLogTimeVerbose,
  getGrantedVolume,
  getUnitFancy,
  getRatingGroupName
} from './utils/charging'

import { proxyUrl } from '@/store/common'

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async chargeAccount (context, { volume, callednumber, ratingGroupNumber, message, deviceId }) {
      const verboseLoggingOn = context.rootState.verboseLogging
      const token = context.rootState.idToken
      const providerId = context.rootState.providerId
      const unitTypeMapping = context.rootState.unitTypeMapping
      const mcc = context.rootState.mcc
      const mnc = context.rootState.mnc
      const unitType = unitTypeMapping[ratingGroupNumber]

      // be sure that volume is number
      volume = Number(volume)
      const urlForInit = await initUrl()
      const initRequestData = await initData(
        providerId,
        deviceId,
        callednumber,
        volume,
        ratingGroupNumber,
        unitType,
        mcc,
        mnc
      )
      const initRequestBody = {
        url: urlForInit,
        requestData: initRequestData,
        token: token
      }
      const initResult = await axios.post(proxyUrl, initRequestBody)
      console.log('init result:', initResult)
      const logTimeRaw = moment.utc()
      const logTimeSummary = getLogTimeSummary(logTimeRaw)
      const logTimeVerbose = getLogTimeVerbose(logTimeRaw)
      if (verboseLoggingOn) {
        context.commit('addLog', {
          deviceId: deviceId,
          log: {
            id: logTimeSummary,
            text: JSON.stringify(initRequestData, null, 4),
            style: 'info'
          }
        })
      }
      context.commit('addLog', {
        deviceId: deviceId,
        log: {
          id: logTimeVerbose,
          text: message,
          style: 'info'
        }
      })
      if (initResult.status !== 200 && initResult.status !== 203) {
        context.commit('addLog', {
          deviceId: deviceId,
          log: {
            id: moment.utc(),
            text: `charging query returned ${initResult.status}`,
            style: 'error'
          }
        })
        return
      }

      if (initResult.data.response?.multipleUnitInformation === undefined) {
        const status = initResult.data.response.status
        const detail = initResult.data.response.detail
        const cause = initResult.data.response.cause
        const message = `FAILED: status:${status} cause:${cause} detail:${detail}`

        context.commit('addLog', {
          deviceId: deviceId,
          log: {
            id: moment.utc(),
            text: message,
            style: 'quota-fail'
          }
        })
      } else {
        initResult.data.response.multipleUnitInformation.forEach(unitInfo => {
          const ratingGroup = unitInfo.ratingGroup
          const resultCode = unitInfo.resultCode
          const grantedVolume = getGrantedVolume(ratingGroup, unitInfo.grantedUnit)
          const grantedUnit = getUnitFancy(ratingGroup, grantedVolume)
          const requestedUnit = getUnitFancy(ratingGroup, volume)
          const unitType = getRatingGroupName(ratingGroup)
          const isFulfilled = grantedVolume === volume

          const message = `${resultCode}${isFulfilled ? '' : '-PARTIAL'}[${ratingGroup} ${unitType}]: requested:${requestedUnit} granted:${grantedUnit}`
          context.commit('addLog', {
            deviceId: deviceId,
            log: {
              id: moment.utc(),
              text: message,
              style: isFulfilled ? 'quota-success' : 'quota-success-partial'
            }
          })
        })
      }
      const sessionId = initResult.data.headers.location
      const urlForUpdate = await updateUrl(sessionId)
      const updateRequestData = await updateData(providerId, callednumber, deviceId, volume, ratingGroupNumber, unitType, mcc, mnc)
      const updateRequestBody = {
        url: urlForUpdate,
        requestData: updateRequestData,
        token: token
      }
      const updateResult = await axios.post(proxyUrl, updateRequestBody)
      console.log('update result:', updateResult)
      const urlForTerminate = await terminateUrl(sessionId)
      const terminateRequestData = await terminateData(providerId, callednumber, deviceId, ratingGroupNumber, unitType, mcc, mnc)
      const terminateRequestBody = {
        url: urlForTerminate,
        requestData: terminateRequestData,
        token: token
      }
      const terminateResult = await axios.post(proxyUrl, terminateRequestBody)
      console.log('terminate result:', terminateResult)
    }
  }
}
