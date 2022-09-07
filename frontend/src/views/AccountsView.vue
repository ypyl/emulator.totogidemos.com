<template>
  <div>
    <MainNav />
    <AccountDetails />
  </div>
</template>

<script>
import MainNav from '@/components/MainNav.vue'
import AccountDetails from '@/components/AccountDetails.vue'

export default {
  name: 'DevicesView',
  components: {
    MainNav,
    AccountDetails
  }
}
</script>
