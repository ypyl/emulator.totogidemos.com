<template>
<div>
  <CNavbar
    expand="lg"
    color-scheme="dark"
    style="background-color: #001D3D"
    placement="fixed-top"
  >
    <!-- ^ Same background color as the Totogi documentation sidebar -->
    <!-- http://docs.api.totogi.com/graphql/#definition-InitialTemplateInstance -->
    <CContainer fluid>
      <CNavbarBrand href="#">
        <img
          src="@/assets/totogi-logo-white.svg"
          alt="Totogi Logo"
          style="max-width: 80px"
          class="d-inline-block align-top"
        />
      </CNavbarBrand>
      <CNavbarNav>
          <CNavItem>
            <CNavLink
              @click="this.$router.push({ name: 'Home' })"
              active
            >
              Home
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              @click="this.$router.push({ name: 'Accounts' })"
              active
            >
              Accounts
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              v-if="$store.state.idToken"
              @click="openConfigModal()" active>
              View Config
            </CNavLink>
          </CNavItem>
      </CNavbarNav>
    </CContainer>
  </CNavbar>
  <CModal :visible="configModalVisible">
    <CModalHeader>
      <CModalTitle>Current Demo Tool Config</CModalTitle>
    </CModalHeader>
    <CModalBody style="text-align: left;">
      <b>Your Provider:</b> {{ $store.state.providerId }}<br />
      <b>Current Plan Name:</b> {{ $store.state.currentPlanInformation.planName }}<br />
      <b>Current Plan ID:</b> {{ $store.state.currentPlanInformation.planId }}<br />
      <b>Plan Version Name:</b> {{ $store.state.currentPlanInformation.planVersionName }}<br />
      <b>Plan Version ID:</b> {{ $store.state.currentPlanInformation.planVersionId }}<br />
      <b>Rating Group 100 Unit Type:</b>
      <CFormSelect
        aria-label="Select unity type of rating group 100"
        @change="changeUnitType(100, $event.target.value)"
        :options="defaultOptions(100)"
      >
      </CFormSelect>
      <b>Rating Group 200 Unit Type:</b>
      <CFormSelect
        aria-label="Select unity type of rating group 200"
        @change="changeUnitType(200, $event.target.value)"
        :options="defaultOptions(200)"
      >
      </CFormSelect>
      <b>Rating Group 300 Unit Type:</b>
      <CFormSelect
        aria-label="Select unity type of rating group 300"
        @change="changeUnitType(300, $event.target.value)"
        :options="defaultOptions(300)"
      >
      </CFormSelect>
      <b>Rating Group 400 Unit Type:</b>
      <CFormSelect
        aria-label="Select unity type of rating group 400"
        @change="changeUnitType(400, $event.target.value)"
        :options="defaultOptions(400)"
      >
      </CFormSelect>
      <b>Verbose Logging:</b>
      <div id="verboseLogging">
        <CButton
          @click="this.$store.dispatch('logging/toggleVerbosity')"
          color="info"
          shape="rounded-pill"
        >Verbose Logging: {{this.$store.state.verboseLogging ? 'ON' : 'OFF'}}
      </CButton>
      </div>
      <br />
      <CForm>
        <CFormInput
          v-model="mcc"
          type="text"
          id="mcc"
          label="Mobile Country Code"
          placeholder="310"
          text="the mobile country code you want to send traffic in on"
          aria-describedby="the mobile country code you want to send traffic in on"
        />
        <CFormInput
          v-model="mnc"
          type="text"
          id="mnc"
          label="Mobile Network Code"
          placeholder="170"
          text="the mobile network code you want to send traffic in on"
          aria-describedby="the mobile network code you want to send traffic in on"
        />
      </CForm>
      <div id="verboseLogging">
        <CButton
          @click="updateMncMccValues()"
          color="info"
          shape="rounded-pill"
        >Update MNC/MCC
      </CButton>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeConfigModal()">
        Close
      </CButton>
    </CModalFooter>
  </CModal>
</div>
</template>

<script>

export default {
  name: 'MainNav',
  data () {
    return {
      configModalVisible: false
    }
  },
  computed: {
    mcc: {
      get () {
        return this.$store.state.mcc
      },
      set (value) {
        this.$store.commit('updateMcc', value)
      }
    },
    mnc: {
      get () {
        return this.$store.state.mnc
      },
      set (value) {
        this.$store.commit('updateMnc', value)
      }
    }
  },
  methods: {
    defaultOptions (ratingGroup) {
      return [
        this.$store.state.unitTypeMapping[ratingGroup],
        { label: 'time', value: 'time' },
        { label: 'totalVolume', value: 'totalVolume' },
        { label: 'serviceSpecificUnits', value: 'serviceSpecificUnits' }
      ]
    },
    openConfigModal () {
      this.configModalVisible = true
    },
    closeConfigModal () {
      this.configModalVisible = false
    },
    changeUnitType (ratingGroup, newRatingGroupUnitType) {
      const currentState = this.$store.state.unitTypeMapping
      currentState[ratingGroup] = newRatingGroupUnitType
      const newState = currentState
      this.$store.dispatch('unitMapping/update', newState)
    }
  }
}
</script>
