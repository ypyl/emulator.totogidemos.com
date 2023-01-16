<template>
<div>
  <h1>Plan Details</h1>
  <CTable>
    <CTableHead>
        <CTableRow>
            <CTableHeaderCell scope="col">Plan Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Plan Id</CTableHeaderCell>
            <CTableHeaderCell scope="col">Plan Version Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Plan Version Id</CTableHeaderCell>
            <CTableHeaderCell scope="col">Default Plan?</CTableHeaderCell>
        </CTableRow>
    </CTableHead>
    <CTableBody>
        <CTableRow>
            <CTableDataCell>
              <b>
                {{$store.state.currentPlanInformation.planName}}
              </b>
            </CTableDataCell>
            <CTableDataCell>
              <b>
                {{$store.state.currentPlanInformation.planId}}
              </b>
            </CTableDataCell>
            <CTableDataCell>
              <b>
                {{$store.state.currentPlanInformation.planVersionName}}
              </b>
            </CTableDataCell>
            <CTableDataCell>
              <b>
                {{$store.state.currentPlanInformation.planVersionId}}
              </b>
            </CTableDataCell>
            <CTableDataCell>
              <CButton
                disabled
                color="success"
              >
                <b>
                  Yes.
                </b>
              </CButton>
            </CTableDataCell>
        </CTableRow>
        <template v-if="!showFull && Array.isArray($store.state.allAvailablePlanInformation)">
          <CTableRow
            v-for="plan in $store.state.allAvailablePlanInformation.slice(0, 5)"
            :key="plan.planId"
          >
            <CTableDataCell>{{plan.planName}}</CTableDataCell>
            <CTableDataCell>{{plan.planId}}</CTableDataCell>
            <CTableDataCell>{{plan.planVersionName}}</CTableDataCell>
            <CTableDataCell>{{plan.planVersionId}}</CTableDataCell>
            <CTableDataCell>
              <CButton
                color="info"
                @click="makeDefault(plan)"
              >
                Make default
              </CButton>
            </CTableDataCell>
          </CTableRow>
        </template>
        <template v-if="showFull">
          <CTableRow
            v-for="plan in $store.state.allAvailablePlanInformation"
            :key="plan.planId"
          >
            <CTableDataCell>{{plan.planName}}</CTableDataCell>
            <CTableDataCell>{{plan.planId}}</CTableDataCell>
            <CTableDataCell>{{plan.planVersionName}}</CTableDataCell>
            <CTableDataCell>{{plan.planVersionId}}</CTableDataCell>
            <CTableDataCell>
              <CButton
                color="info"
                @click="makeDefault(plan)"
              >
                Make default
              </CButton>
            </CTableDataCell>
          </CTableRow>
        </template>
    </CTableBody>
  </CTable>
  <CButton
    v-if = "!showFull"
    color="info"
    @click="showFull = !showFull"
  >
    Show more plans
  </CButton>
  <CButton
    v-if = "showFull"
    color="info"
    @click="showFull = !showFull"
  >
    Show less plans
  </CButton>
  <CRow>
    <CCol></CCol>
    <CCol>
    <p>If the above plan is incorrect, please publish a new plan version for the plan
       you would like to demo with. This tool assumes you want to demo the latest
       plan version of all your plans and versions.
    </p>
    </CCol>
    <CCol></CCol>
  </CRow>
  <CSpinner
    color="info"
    v-if="loadingPlanData"
  />
  <CButton
    v-if="!loadingPlanData"
    color="info"
    @click="loadBasicPlanData()"
  >
  Refresh Plan Details
  </CButton>
</div>
</template>

<script>

export default {
  name: 'PlanDetails',
  data () {
    return {
      loadingPlanData: false,
      showFull: false
    }
  },
  methods: {
    async makeDefault (planDetails) {
      await this.$store.commit('setCurrentPlanInformation', planDetails, { root: true })
      await this.$store.dispatch('planVersionAllocations/getPlanVersionInformation')
      await this.$nextTick()
      await this.$store.dispatch('myProviderConfig/getMyProviderConfig')
    },
    async loadBasicPlanData () {
      this.loadingPlanData = true
      await this.$store.dispatch('planVersions/getPlanInformation')
      this.loadingPlanData = false
      await this.$nextTick()
      await this.$store.dispatch('planVersionAllocations/getPlanVersionInformation')
      await this.$nextTick()
      await this.$store.dispatch('myProviderConfig/getMyProviderConfig')
    }
  },
  async mounted () {
    await this.$store.dispatch('planVersions/getPlanInformation')
    await this.$nextTick()
    await this.$store.dispatch('planVersionAllocations/getPlanVersionInformation')
    await this.$nextTick()
    await this.$store.dispatch('myProviderConfig/getMyProviderConfig')
  }
}
</script>
