<template>
  <v-layout>
    <v-flex>
      <h1>This is you</h1>
      <p>{{token}}</p>
    </v-flex>
    <v-flex>
      <nuxt-link to="profile">Profiel maken</nuxt-link>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      email: ''
    }
  },
  computed: {
    token: {
      get() {
        return this.$store.state.user.token
      }
    }
  }
}
</script>