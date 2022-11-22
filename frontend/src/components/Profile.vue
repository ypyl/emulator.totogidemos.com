<template>
<div>
    <h1>Profile Detail</h1>
    <br />
    <div class="profile-container">
        <p>Provider ID: {{$store.state.currentUser.providerId}}</p>
        <p>Email: {{$store.state.currentUser.email}}</p>
        <p>Name: {{$store.state.currentUser.name}}</p>
        <p>Phone: {{$store.state.currentUser.phoneNumber}}</p>
        <p>Job title: {{$store.state.currentUser.jobTitle}}</p>
    </div>
</div>
</template>

<script>

export default {
  name: 'ProfileDetail',
  async mounted () {
    await this.$store.dispatch('user/getCurrentUser')
  }
}
</script>

<style scoped>
    .profile-container {
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
        text-align: left;
    }
</style>
