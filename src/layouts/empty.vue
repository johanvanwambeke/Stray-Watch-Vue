<template>
  <v-app>
    <v-content>
      <div class="backgroundImage">
        <div class="maxwidth">
          <nuxt />
        </div>
      </div>
      <style>
  :root {
    --accent-color: {{ accentColor }};
    --main-color: {{ mainColor }};
    --background-color: {{ backgroundColor }};
  }
      </style>
    </v-content>
  </v-app>
</template>

<script>
import config from '@/config.js'
export default {
  data() {
    return {
      accentColor: config.colors.accentColor,
      mainColor: config.colors.mainColor,
      backgroundColor: config.colors.backgroundColor
    }
  }
}
</script>

<style scoped>
.backgroundImage {
  background: #314755; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #26a0da,
    #314755
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #26a0da,
    #314755
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.maxwidth {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  min-height: 100vh;
}
</style>
