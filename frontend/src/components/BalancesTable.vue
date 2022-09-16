<template>
    <div>
      <CContainer fluid>
        <CTable>
            <CTableHead>
                <CTableRow>
                <CTableHeaderCell scope="col">Balance Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Balance Type</CTableHeaderCell>
                <CTableHeaderCell scope="col">Allocation</CTableHeaderCell>
                <CTableHeaderCell scope="col">Remaining</CTableHeaderCell>
                <CTableHeaderCell scope="col">Percent Remaining</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                    <CTableRow
                        v-for="(allocation, key) in $store.state.allPlanVersionAllocations"
                        :key="key"
                        color="primary"
                    >
                        <CTableDataCell>{{ allocationOrBalanceName(allocation) }}</CTableDataCell>
                        <CTableDataCell>{{ allocationOrBalanceType(allocation) }}</CTableDataCell>
                        <CTableDataCell>{{ allocationOrBalanceValue(allocation) }}</CTableDataCell>
                        <CTableDataCell> {{ getBalanceRemaining(allocation, $store.state.currentNonMonetaryBalances) }} </CTableDataCell>
                        <CTableDataCell> {{ parseInt(getBalanceRemaining(allocation, $store.state.currentNonMonetaryBalances)) / parseInt(allocationOrBalanceValue(allocation)) * 100 }} %</CTableDataCell>
                    </CTableRow>
            </CTableBody>
            </CTable>
      </CContainer>
    </div>
</template>

<script>
export default {
  name: 'BalancesTable',
  data () {
    return {
      balanceRemaining: 0
    }
  },
  props: {
    accountId: {
      type: String,
      required: true
    },
    deviceId: {
      type: String,
      required: true
    }
  },
  methods: {
    allocationOrBalanceName (allocation) {
      return Object.keys(allocation)[0]
    },
    getBalanceRemaining (allocation, balances) {
      const currentAllocationName = this.allocationOrBalanceName(allocation)
      console.log('what')
      console.log(balances)
      console.log(balances.length)
      for (let i = 0; i < balances.length; i++) {
        if (Object.keys(balances[i])[0] === currentAllocationName) {
          return this.allocationOrBalanceValue(balances[i])
        }
      }
    },
    allocationOrBalanceValue (allocation) {
      if (this.allocationOrBalanceType(allocation) === 'voice') {
        return (allocation[this.allocationOrBalanceName(allocation)] / 60).toString() + ' Minutes'
      } else if (this.allocationOrBalanceType(allocation) === 'data') {
        return (allocation[this.allocationOrBalanceName(allocation)] / (1024 * 1024)).toString() + ' MB'
      } else {
        return (allocation[this.allocationOrBalanceName(allocation)]).toString() + ' SMS'
      }
    },
    allocationOrBalanceType (allocation) {
      if (this.allocationOrBalanceName(allocation).includes('voice-')) {
        return 'voice'
      } else if (this.allocationOrBalanceName(allocation).includes('text-')) {
        return 'text'
      } else if (this.allocationOrBalanceName(allocation).includes('data')) {
        return 'data'
      }
    }
  }
}
</script>
