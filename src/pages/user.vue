<template>
  <v-layout rows wrap>
    <v-flex xs12>
      <h1>This is you</h1>
      <p>{{user.firstname}}</p>
      <p>{{user.lastname}}</p>
      <p>{{user.phoneNumber}}</p>
      <p>{{user.email}}</p>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('user/me').then(res => {
      this.user = res
      console.log(res)
    })
  },
  data() {
    return {
      email: '',
      user: ''
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