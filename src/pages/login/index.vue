<template>
  <v-container>
    <v-layout col wrap align-center>
      <v-flex>
        <h1>Hi, login or register?</h1>
        <input v-model="email" placeholder="email" />
        <input v-model="password" type="password" placeholder="password" />
        <v-btn @click="login">Login</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      email: 'johan.van.wambeke@gmail.com',
      password: 'voetjes'
    }
  },
  methods: {
    login() {
      this.$store
        .dispatch('user/login', { email: this.email, password: this.password })
        .then(res => {
          alert.res
          this.$router.push('/user')
        })
        .catch(err => {
          alert.err
        })
    }
  }
}
</script>
