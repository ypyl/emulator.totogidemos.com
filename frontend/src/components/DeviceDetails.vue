<template>
<div>
  <h1>Device Details</h1>
  <CTable>
    <CTableHead>
        <CTableRow>
            <CTableHeaderCell scope="col">Entity Type</CTableHeaderCell>
            <CTableHeaderCell scope="col">Entity ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Entity Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Plan Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Management UI</CTableHeaderCell>
        </CTableRow>
    </CTableHead>
    <CTableBody>
        <div
          v-for="account in $store.state.accounts"
          :key="account.id"
        >
          <CTableRow>
            <CTableDataCell>Account</CTableDataCell>
            <CTableDataCell>
              {{account.id}}
            </CTableDataCell>
            <CTableDataCell>
              {{$store.state.currentPlanInformation.planName}}
            </CTableDataCell>
            <CTableDataCell>
              <CLink @click="this.$router.push('/device/' + device.name)">
                <CButton color="primary">
                    Demo Page
                </CButton>
              </CLink>
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
              <CTableDataCell>{{account.id}}</CTableDataCell>
              <CTableDataCell>
                {{device.name}}
              </CTableDataCell>
              <CTableDataCell>
                {{$store.state.currentPlanInformation.planName}}
              </CTableDataCell>
              <CTableDataCell>
                  <CLink @click="this.$router.push('/device/' + device.name)">
                      <CButton color="primary">
                          Demo Page
                      </CButton>
                  </CLink>
              </CTableDataCell>
          </CTableRow>
        </div>
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
    v-if="loadingDemoDevices"
  />
  <CButton
    v-if="!loadingDemoDevices"
    color="info"
    @click="provisionDevice()"
  >
  Provision Demo Devices
  </CButton>
</div>
</template>

<script>
export default {
  name: 'DeviceDetails',
  data () {
    return {
      loadingDemoDevices: false
    }
  },
  methods: {
    async provisionDevice (accountId) {
      this.loadingDemoDevices = true
      const deviceId = crypto.randomUUID()
      await this.$store.dispatch('device/create', { deviceId: deviceId, accountId: accountId }, { root: true })
      await this.$store.dispatch('account/subscribeToCurrentPlanVersion', { accountId: accountId })
      const deviceName = 'dev' + this.$store.state.accounts
      const newAccount = {
        accountId: accountId,
        children: [],
        devices: [{
          deviceId: deviceId,
          name: 'device'
        }],
        name: deviceName
      }
      this.$store.commit('addDemoAccountsAndDevices', newAccount)
      this.loadingDemoDevices = false
    }
  }
}
</script>
