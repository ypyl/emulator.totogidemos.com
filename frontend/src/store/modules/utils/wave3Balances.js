export async function getMonetaryBalance (balance) {
  return balance.Monetary.total
}

export async function getVoiceAllNetBalance (balance) {
  const voiceAllNetKeys = Object.keys(balance).filter(objectKey => objectKey.startsWith('voice-all-net'))
  // start with naive implementation that assumes just one balance
  return balance[voiceAllNetKeys[0]].total
}

export async function getTextAllNetBalance (balance) {
  const textAllNetKeys = Object.keys(balance).filter(objectKey => objectKey.startsWith('text-all-net'))
  // start with naive implementation that assumes just one balance
  return balance[textAllNetKeys[0]].total
}

export async function getDataBalance (balance) {
  const dataKeys = Object.keys(balance).filter(objectKey => objectKey.startsWith('data'))
  return balance[dataKeys[0]].total
}
