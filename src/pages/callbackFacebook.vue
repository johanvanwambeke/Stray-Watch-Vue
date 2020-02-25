
<template>
  <div>
    <h1>Authenticating facebook</h1>
    <v-progress-circular v-model="loading" indeterminate color="primary"></v-progress-circular>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: true
    }
  },
  async mounted() {
    console.log('fb calback')
    if (process.server === false) {
      console.log('client side calback')
      this.loginFacebook()
    }
  },
  methods: {
    loginFacebook() {
      var token = this.$route.hash
        .split('&data_access')[0]
        .replace('#access_token=', '')
      console.log(token)
      var url = `api/users/FacebookAuthenticate?token=${token}`
      console.log('fb token <-> local token')

      try {
        this.$axios.defaults.headers.common['Authorization'] = null
        this.$axios.$post(url, null).then(res => {
          this.$auth.setToken('local', 'Bearer ' + res.token)
          setTimeout(async () => {
            this.$auth.setStrategy('local')
            setTimeout(async () => {
              await this.$auth.fetchUser()
              // this.$auth.setToken('local', 'Bearer ' + res.token)
              console.log(this.$auth.user)
              this.loading = false
            })
          })
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>