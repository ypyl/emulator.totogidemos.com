<template>
    <img @click="iconClicked()" src="@/assets/messages.png" alt="Messages icon" id="messages">
</template>

<script>
export default {
  props: ['numberSms', 'deviceId'],
  methods: {
    iconClicked () {
      const message = `SMS ACTIVITY: Charging ${this.numberSms} SMS`
      console.log(message)
      const volume = this.numberSms
      const ratingGroupNumber = 200
      const payload = {
        deviceId: this.$props.deviceId,
        volume: volume,
        ratingGroupNumber: ratingGroupNumber,
        message: message
      }
      this.$store.dispatch('chargeAccount', payload)
    }
  }
}
</script>

<style scoped>
#messages {
    max-width: 80px;
    border-radius: 10px;
}
</style>
