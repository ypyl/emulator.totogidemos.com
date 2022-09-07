<template>
    <img @click="iconClicked()" src="@/assets/podcast.png" alt="Podcast icon" id="podcast">
</template>

<script>
import getStorageSizeInBytesByUnit from '@/utils/storageSizes'

export default {
  props: ['deviceId'],
  methods: {
    iconClicked () {
      const message = 'DATA ACTIVITY: Charging 100 MB'
      console.log(message)
      const volume = 100 * getStorageSizeInBytesByUnit('MB')
      const ratingGroupNumber = 300
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
#podcast {
    max-width: 80px;
    border-radius: 10px;
}
</style>
