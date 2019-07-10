<template>
  <v-app>
    <v-content>
      <!-- <v-container> -->
      <nuxt />
      <!-- </v-container> -->
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

<style>
</style>
