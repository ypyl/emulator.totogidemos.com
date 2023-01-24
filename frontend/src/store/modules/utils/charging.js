import moment from 'moment'

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
