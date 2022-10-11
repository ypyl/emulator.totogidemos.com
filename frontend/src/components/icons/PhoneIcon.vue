<template>
    <img @click="iconClicked()" src="@/assets/phone.png" alt="Phone icon" id="phone">
</template>

<script>
export default {
  props: ['callednumber', 'numberMinutes', 'deviceId'],
  methods: {
    iconClicked () {
      const message = `VOICE ACTIVITY: Charging ${this.numberMinutes} minutes for ${this.callednumber}`
      console.log(message)
      const callednumber = this.callednumber
      const volumeSeconds = this.numberMinutes * 60
      const ratingGroupNumber = 100
      const payload = {
        deviceId: this.$props.deviceId,
        callednumber: callednumber,
        volume: volumeSeconds,
        ratingGroupNumber: ratingGroupNumber,
        message: message
      }
      this.$store.dispatch('chargeAccount', payload)
    }
  }
}
</script>

<style scoped>
#phone {
    max-width: 80px;
    border-radius: 10px;
}
</style>
