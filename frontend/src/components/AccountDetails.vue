<template>
<div>
  <h1>Account Details</h1>
  <CTable>
    <CTableHead>
        <CTableRow>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Parent</CTableHeaderCell>
            <CTableHeaderCell scope="col">Plan Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Type</CTableHeaderCell>
            <CTableHeaderCell scope="col">Manage</CTableHeaderCell>
        </CTableRow>
    </CTableHead>
    <CTableBody>
      <CTableRow
        v-for="account in $store.state.accounts"
        :key="account.accountId"
      >
        <CTableDataCell>
          {{account.name}}
        </CTableDataCell>
        <CTableDataCell>
          {{account.accountId}}
        </CTableDataCell>
        <CTableDataCell>
          {{account.parent}}
        </CTableDataCell>
        <CTableDataCell>
          <template v-for="(plan, index) in account.subscription">
            {{plan.planName}}<template v-if="account.subscription.length > 0 && index != account.subscription.length - 1">, </template>
          </template>
        </CTableDataCell>
        <CTableDataCell>
          Account
        </CTableDataCell>
        <CTableDataCell>
          <CSpinner
            color="info"
            v-if="subscribingAccount"
          />
          <CButton
            v-if="!subscribingAccount"
            @click="subscribeAccount(account.accountId)" color="primary"
          >
              Subscribe
          </CButton>
        </CTableDataCell>
      </CTableRow>
      <template
        v-for="account in $store.state.accounts"
      >
        <CTableRow
          v-for="device in account.devices"
          :key="device.deviceId"
        >
          <CTableDataCell>
            {{device.deviceName}}
          </CTableDataCell>
          <CTableDataCell>
            {{device.deviceId}}
          </CTableDataCell>
          <CTableDataCell>
            {{account.accountId}}
          </CTableDataCell>
          <CTableDataCell>
            <template v-for="(plan, index) in account.subscription">
              {{plan.planName}}<template v-if="account.subscription.length > 0 && index != account.subscription.length - 1">, </template>
            </template>
          </CTableDataCell>
          <CTableDataCell>
            Device
          </CTableDataCell>
          <CTableDataCell>
              <CLink @click="this.$router.push('/account/' + account.accountId + '/device/' + device.deviceId)">
                  <CButton color="primary">
                      Demo Page
                  </CButton>
              </CLink>
          </CTableDataCell>
        </CTableRow>
      </template>
    </CTableBody>
  </CTable>
  <CRow>
    <CCol></CCol>
    <CCol>
    <p>
        When you're ready to provision devices for a demo
        click the button below.
    </p>
    </CCol>
    <CCol></CCol>
  </CRow>
  <CSpinner
    color="info"
    v-if="provisioningAccounts"
  />
  <CButton
    v-if="!provisioningAccounts"
    color="info"
    @click="provisionAccount()"
  >
  Provision Demo Accounts
  </CButton>
  <br /><br />
  <hr>
  <CRow>
    <CCol></CCol>
    <CCol>
      <CSpinner
        color="info"
        v-if="provisioningDevices"
      />
      <CButton
        v-if="!provisioningDevices"
        color="info"
        @click="provisionDevice()"
      >
      Provision Demo Devices
      </CButton>
      <br /><br />
      <CFormSelect
        aria-label="Select Account to Create Device Under"
        @change="changeAccountSelection($event.target.value)"
      >
        <option>Please select an account</option>
        <option
          v-for="account in $store.state.accounts"
          :value="account.accountId"
          :key="account.accountId"
        >
          {{ account.name }}
        </option>
      </CFormSelect>
    </CCol>
    <CCol></CCol>
  </CRow>
</div>
</template>

<script>
export default {
  name: 'AccountDetails',
  data () {
    return {
      provisioningAccounts: false,
      provisioningDevices: false,
      subscribingAccount: false,
      accountSelection: ''
    }
  },
  methods: {
    changeAccountSelection (value) {
      this.accountSelection = value
    },
    async subscribeAccount (accountId) {
      this.subscribingAccount = true
      await this.$store.dispatch('account/subscribeToCurrentPlanVersion', { accountId: accountId })
      this.subscribingAccount = false
    },
    async provisionDevice () {
      this.provisioningDevices = true
      const deviceId = crypto.randomUUID()
      const accountId = this.accountSelection
      await this.$store.dispatch('device/create', { deviceId: deviceId, accountId: accountId })
      this.provisioningDevices = false
      const accountState = this.$store.state.accounts[accountId]
      const deviceName = accountState.name + 'device' + accountState.devices.length
      const newDevice = { deviceId: deviceId, deviceName: deviceName }
      accountState.devices.push(newDevice)
      await this.$store.commit('putAccount', accountState, { root: true })
    },
    async provisionAccount () {
      this.provisioningAccounts = true
      const accountId = crypto.randomUUID()
      await this.$store.dispatch('account/create', { accountId: accountId })
      const currentAccountsLength = await Object.keys(this.$store.state.accounts).length
      const accountName = 'acct' + currentAccountsLength
      const newAccount = {
        accountId: accountId,
        parent: '',
        childAccounts: [],
        services: [],
        devices: [],
        subscription: [],
        name: accountName
      }
      console.log('Adding new account:')
      console.log(newAccount)
      await this.$store.commit('putAccount', newAccount, { root: true })
      await this.$store.dispatch('account/credit', { accountId: accountId, amount: 1000 })
      this.provisioningAccounts = false
    }
  }
}
</script>
