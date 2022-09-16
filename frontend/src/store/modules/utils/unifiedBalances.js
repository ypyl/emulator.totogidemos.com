export async function getMonetaryBalance (balance) {
  return balance.Monetary.total
}

export async function getAllServiceBalances (balance) {
  const voiceKeys = Object.keys(balance).filter(objectKey => objectKey.startsWith('voice-'))
  const textKeys = Object.keys(balance).filter(objectKey => objectKey.startsWith('text-'))
  const dataKeys = Object.keys(balance).filter(objectKey => objectKey.startsWith('data'))
  // start with naive implementation that assumes just one balance
  let convertedBalances = []
  for (let i = 0; i < voiceKeys.length; i++) {
    // Add voice seconds to minutes conversion
    const newBalance = {
      [voiceKeys[i]]: balance[voiceKeys[i]].total
    }
    convertedBalances = [...convertedBalances, newBalance]
  }
  for (let i = 0; i < textKeys.length; i++) {
    const newBalance = {
      [textKeys[i]]: balance[textKeys[i]].total
    }
    convertedBalances = [...convertedBalances, newBalance]
  }
  for (let i = 0; i < dataKeys.length; i++) {
    // Add bytes to MB conversion
    const newBalance = {
      [dataKeys[i]]: balance[dataKeys[i]].total
    }
    convertedBalances = [...convertedBalances, newBalance]
  }
  console.log(convertedBalances)
  return convertedBalances
}

export async function getAllServiceAllowances (allowances) {
  let convertedAllowances = []
  for (let i = 0; i < allowances.length; i++) {
    const newAllowance = {
      [allowances[i].unit.balanceName]: allowances[i].unit.periodAllowance
    }
    convertedAllowances = [...convertedAllowances, newAllowance]
  }
  return convertedAllowances
}
