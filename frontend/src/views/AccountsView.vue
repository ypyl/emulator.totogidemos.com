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
  name: 'AccountsView',
  components: {
    MainNav,
    AccountDetails
  }
}
</script>
