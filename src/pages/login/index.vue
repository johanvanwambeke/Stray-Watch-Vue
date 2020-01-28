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
          <a href="/reset">forgot pasword</a>
          <v-btn @click="login">Login</v-btn>
          <v-btn @click="loginGoogle">With google</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  middleware: ['auth'],
  async mounted() {
    // console.log('loginpulled')
    // if (!this.$auth.loggedIn) {
    //   return
    // }
    // console.log('where logged in')
    // const auth = this.$auth
    // const authStrategy = auth.strategy.name
    // console.log(authStrategy)
    // if (authStrategy === 'facebook' || authStrategy === 'google') {
    //   const token = this.$auth.getToken(authStrategy).substr(7)
    //   console.log(this.$auth.getToken(authStrategy))
    //   await this.$store.dispatch('user/loginAsGoogle', token)
    // }
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn
    }
  },
  watch: {
    loggedIn: function(val) {}
  },
  methods: {
    login() {
      this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      })
    },
    async loginGoogle() {
      this.$auth.loginWith('google')
    }
  }
}
</script>
