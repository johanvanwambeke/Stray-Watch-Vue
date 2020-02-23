<template>
  <v-flex xs12>
    <client-only>
      <cusSwiper></cusSwiper>
    </client-only>
  </v-flex>
</template>
<style lang="scss" scoped>
</style>
<script>
import cusSwiper from '~/components/mySwiper.vue'
export default {
  mounted() {
    this.$store.dispatch('profiles/getProfile', 245).then(res => {})
  },
  components: {
    cusSwiper
  }
}
</script>