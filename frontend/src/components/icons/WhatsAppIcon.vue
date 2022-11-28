<template>
    <img @click="iconClicked()" src="@/assets/whatsapp.png" alt="WhatsApp icon" id="whatsapp">
</template>

<script>
import getStorageSizeInBytesByUnit from '@/utils/storageSizes'

export default {
  props: ['deviceId'],
  methods: {
    iconClicked () {
      const message = 'DATA ACTIVITY: Charging 50 MB'
      console.log(message)
      const volume = 50 * getStorageSizeInBytesByUnit('MB')
      const ratingGroupNumber = 380
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
#whatsapp {
    max-width: 80px;
    border-radius: 10px;
}
</style>
