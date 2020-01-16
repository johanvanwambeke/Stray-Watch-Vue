<template>
  <v-container>
    <v-layout rows wrap align-center>
      <v-flex>
        <v-form>
          <h2>Please log in</h2>
          <v-text-field v-model="email" placeholder="email"></v-text-field>
          <v-text-field
            @keyup.enter.native="login"
            v-model="password"
            type="password"
            placeholder="password"
          ></v-text-field>
          <v-btn @click="login">Login</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      })
    }
  }
}
</script>
