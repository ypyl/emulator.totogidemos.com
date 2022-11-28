<template>
  <div>
    <MainNav />
    <Profile />
  </div>
</template>

<script>
// @ is an alias to /src
import Profile from '@/components/Profile.vue'
import MainNav from '../components/MainNav.vue'

export default {
  name: 'ProfileView',
  components: {
    Profile,
    MainNav
  }
}
</script>
