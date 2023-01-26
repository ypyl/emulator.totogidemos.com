import moment from 'moment'
import getStorageSizeInBytesByUnit from '@/utils/storageSizes'

const baseUrl = 'https://5g.produseast1.api.totogi.com/nchf-convergedcharging/v3/chargingData'

export async function isoUtcNow () {
  const now = moment.utc().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
  return now
}

export async function topUpUrl () {
  // Just happens to be the same as the init URL
  return baseUrl
}

export async function initUrl () {
  return baseUrl
}

export async function updateUrl (sessionId) {
  const url = baseUrl + '/' + sessionId + '/update'
  return url
}

export async function terminateUrl (sessionId) {
  const url = baseUrl + '/' + sessionId + '/release'
  return url
}

export async function headers (idToken) {
  const headers = {
    Authorization: `Bearer ${idToken}`
  }
  return headers
}

export async function topUpData (providerId, deviceId, volume) {
  const timestampNow = await isoUtcNow()
  const result = {
    invocationSequenceNumber: 1,
    tenantIdentifier: providerId,
    subscriberIdentifier: deviceId,
    multipleUnitUsage: [
      {
        requestedUnit: {
          serviceSpecificUnits: volume
        },
        ratingGroup: 400
      }
    ],
    oneTimeEvent: true,
    oneTimeEventType: 'IEC',
    requestedAction: 'TOP_UP',
    nfConsumerIdentification: {
      nodeFunctionality: 'SMF'
    },
    invocationTimeStamp: timestampNow
  }
  return result
}

export async function initData (providerId, deviceId, callednumber, volume, ratingGroupNumber, unitType, mcc, mnc) {
  const timestampNow = await isoUtcNow()
  return {
    invocationSequenceNumber: 1,
    tenantIdentifier: providerId,
    subscriberIdentifier: deviceId,
    multipleUnitUsage: [
      {
        requestedUnit: {
          [unitType]: volume
        },
        usedUnitContainer: [
          {
            localSequenceNumber: 1,
            [unitType]: 0
          }
        ],
        ratingGroup: ratingGroupNumber
      }
    ],
    iMSChargingInformation: {
      calledPartyAddress: callednumber,
      carrierSelectRoutingInformation: 'ARIN',
      numberPortabilityRoutingInformation: 'ARIN'
    },
    locationReportingChargingInformation: {
      pSCellInformation: {
        nrcgi: {
          nrCellId: '11',
          nid: '12',
          plmnId: {
            mcc: mcc,
            mnc: mnc
          }
        }
      }
    },
    nfConsumerIdentification: {
      nodeFunctionality: 'SMF'
    },
    invocationTimeStamp: timestampNow
  }
}

export function getLogTimeSummary (logTimeRaw = moment.utc()) {
  return logTimeRaw.clone().subtract(1, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SS') + 'Z'
}

export function getLogTimeVerbose (logTimeRaw = moment.utc()) {
  return logTimeRaw.format('YYYY-MM-DDTHH:mm:ss.SS') + 'Z'
}

export function getGrantedVolume (ratingGroup, grantedUnit) {
  switch (ratingGroup) {
    case 100: return grantedUnit.time
    case 200: return grantedUnit.serviceSpecificUnits
    case 300: return grantedUnit.totalVolume
    case 400: return grantedUnit.serviceSpecificUnits
    case 380: return grantedUnit.totalVolume
    default:
      console.error('check Granted Volume ratingGroup ', ratingGroup, ' unit is ', JSON.stringify(grantedUnit))
      return -1 // unknown unit
  }
}

export function getRatingGroupName (ratingGroup) {
  switch (ratingGroup) {
    case 100: return 'voice'
    case 200: return 'sms'
    case 300:
    case 380: return 'data'
    default: return 'unknown' // an unknown unit
  }
}

export function getUnitFancy (ratingGroup, volume) {
  const MINUTE = 60

  switch (ratingGroup) {
    case 100: return `${volume / MINUTE} min`
    case 200: return `${volume} SMS`
    case 300:
    case 380: return `${volume / getStorageSizeInBytesByUnit('MB')} MB`
    default: return `ratingGroup ${ratingGroup} ${volume}` // an unknown unit
  }
}

export async function updateData (providerId, callednumber, deviceId, volume, ratingGroupNumber, unitType, mcc, mnc) {
  const timestampNow = await isoUtcNow()
  return {
    invocationSequenceNumber: 2,
    tenantIdentifier: providerId,
    subscriberIdentifier: deviceId,
    multipleUnitUsage: [
      {
        requestedUnit: {
          [unitType]: 0
        },
        usedUnitContainer: [
          {
            localSequenceNumber: 1,
            [unitType]: volume
          }
        ],
        ratingGroup: ratingGroupNumber
      }
    ],
    iMSChargingInformation: {
      calledPartyAddress: callednumber,
      carrierSelectRoutingInformation: 'ARIN',
      numberPortabilityRoutingInformation: 'ARIN'
    },
    locationReportingChargingInformation: {
      pSCellInformation: {
        nrcgi: {
          nrCellId: '11',
          nid: '12',
          plmnId: {
            mcc: mcc,
            mnc: mnc
          }
        }
      }
    },
    nfConsumerIdentification: {
      nodeFunctionality: 'SMF'
    },
    invocationTimeStamp: timestampNow
  }
}

export async function terminateData (providerId, callednumber, deviceId, ratingGroupNumber, unitType, mcc, mnc) {
  const timestampNow = await isoUtcNow()
  return {
    invocationSequenceNumber: 3,
    tenantIdentifier: providerId,
    subscriberIdentifier: deviceId,
    multipleUnitUsage: [
      {
        usedUnitContainer: [
          {
            localSequenceNumber: 1,
            [unitType]: 0
          }
        ],
        ratingGroup: ratingGroupNumber
      }
    ],
    iMSChargingInformation: {
      calledPartyAddress: callednumber,
      carrierSelectRoutingInformation: 'ARIN',
      numberPortabilityRoutingInformation: 'ARIN'
    },
    locationReportingChargingInformation: {
      pSCellInformation: {
        nrcgi: {
          nrCellId: '11',
          nid: '12',
          plmnId: {
            mcc: mcc,
            mnc: mnc
          }
        }
      }
    },
    nfConsumerIdentification: {
      nodeFunctionality: 'SMF'
    },
    invocationTimeStamp: timestampNow
  }
}
