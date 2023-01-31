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
                <CTableHeaderCell scope="col">Used</CTableHeaderCell>
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
                        <!-- START Handle Rendering Remaining Balances -->
                        <template v-if="allocationOrBalanceValue(allocation) === 'Unlimited'">
                          <CTableDataCell>Unlimited</CTableDataCell>
                        </template>
                        <template v-if="allocationOrBalanceValue(allocation) !== 'Unlimited'">
                          <CTableDataCell>
                            {{ getBalanceRemaining(allocation, $store.state.currentNonMonetaryBalances) }}
                          </CTableDataCell>
                        </template>
                        <!-- END Handle Rendering Remaining Balances -->
                        <template v-if="allocationOrBalanceName(allocation).includes('voice')">
                          <CTableDataCell>
                            {{ $store.state.edrs.voiceEdrSummary }} Minutes (Total Across Balances)
                          </CTableDataCell>
                        </template>
                        <template v-if="allocationOrBalanceName(allocation).includes('text')">
                          <CTableDataCell>
                            {{ $store.state.edrs.smsEdrSummary }} Messages (Total Across Balances)
                          </CTableDataCell>
                        </template>
                        <template v-if="allocationOrBalanceName(allocation).includes('data')">
                          <CTableDataCell>
                            {{ $store.state.edrs.dataEdrSummary }} MB (Total Across Balances)
                          </CTableDataCell>
                        </template>
                        <template v-if="allocationOrBalanceValue(allocation) === 'Unlimited'">
                          <CTableDataCell>100 %</CTableDataCell>
                        </template>
                        <template v-if="allocationOrBalanceValue(allocation) !== 'Unlimited'">
                          <CTableDataCell>
                          {{ parseInt(getBalanceRemaining(allocation, $store.state.currentNonMonetaryBalances)) / parseInt(allocationOrBalanceValue(allocation)) * 100 }} %
                          </CTableDataCell>
                        </template>
                    </CTableRow>
            </CTableBody>
            </CTable>
            <CButton
             color="info"
             @click="reloadBasicPlanData()"
            >
            New Plan Provision
           </CButton>
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
  mounted: function () {
    console.log('Ready')
    this.loadData()
    this.interval = setInterval(function () {
      console.log('interval')
      this.loadData()
    }.bind(this), 6000)
  },
  beforeUnmount () {
    clearInterval(this.interval)
  },
  methods: {
    loadData: function () {
      // Move this out as a prop with account ID
      console.log('Getting account for ' + this.$props.accountId)
      this.$store.dispatch('getAccount', { accountId: this.$props.accountId })
      this.$store.dispatch('notifications/update', { accountId: this.$props.accountId, deviceId: this.$props.deviceId })
      this.$store.dispatch('getAndSummarizeEdrs', { deviceId: this.$props.deviceId })
    },
    allocationOrBalanceName (allocation) {
      return Object.keys(allocation)[0]
    },
    getBalanceRemaining (allocation, balances) {
      const currentAllocationName = this.allocationOrBalanceName(allocation)
      for (let i = 0; i < balances.length; i++) {
        if (Object.keys(balances[i])[0] === currentAllocationName) {
          return this.allocationOrBalanceValue(balances[i])
        }
      }
    },
    allocationOrBalanceValue (allocation) {
      const allocationValue = allocation[this.allocationOrBalanceName(allocation)]
      if (allocationValue === null) {
        return 'Unlimited'
      }
      if (this.allocationOrBalanceType(allocation) === 'voice') {
        return (allocationValue / 60).toString() + ' Minutes'
      } else if (this.allocationOrBalanceType(allocation) === 'data') {
        return (allocationValue / (1024 * 1024)).toString() + ' MB'
      } else {
        return (allocationValue).toString() + ' SMS'
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
    },
    async reloadBasicPlanData () {
      await this.$store.dispatch('account/CancelPlanSubscription', { accountId: this.$props.accountId })
      await new Promise(resolve => setTimeout(resolve, 1000))
      await this.$store.dispatch('account/subscribeToCurrentPlanVersion', { accountId: this.$props.accountId })
    }
  }
}
</script>
