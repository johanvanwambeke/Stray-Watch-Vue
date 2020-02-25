
<template>
  <h1>Authenticating facebook</h1>
</template>
<script>
export default {
  async asyncData({ params, store }) {
    store.dispatch('user/loginAsGoogle', null).then(res => {
      console.log('login google done')
    })
  },
  async mounted() {
    var token = this.$route.query.access_token
    console.log(this.$route)
    // if (authStrategy === 'google') {
    //   var url = `api/users/googleauthenticate?token=${token}`
    //   console.log('google token <-> local token')
    // }
    // if (authStrategy === 'facebook') {
    url = `api/users/FacebookAuthenticate?token=${token}`
    console.log('fb token <-> local token')
    // }

    try {
      app.$axios.$post(url, null).then(res => {
        auth.setToken('local', 'Bearer ' + res.token)
        setTimeout(async () => {
          auth.setStrategy('local')
          console.log(auth.user)
          setTimeout(async () => {
            await auth.fetchUser()
            console.log(auth.user)
          })
        })
      })
    } catch (e) {
      console.log(e)
    }
  },
  watch: {
    $route() {
      console.log('Watching route')
      console.log(this.$route.params)
      //do something with the url params set
      //http://localhost:3000/callback#
      // state=smjAb_w5kscL3XbK1P26n&
      // access_token=ya29.Il-7B9oslk_FuG_a3HrVinjrDF57s4PrOzc8tUMJKO3N9Q7nz0W31al728HM-M_-fP8BfQX2eYoDQtyh2eeqw3fx-F14bxXmgC3ObBZcQsnA1S_JQfILxVdsaZSUdymSMw&
      // token_type=Bearer&
      // expires_in=3599&
      // scope=email%20profile%20openid%20
      // https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email&authuser=0&prompt=consent&session_state=34107af59ece17a0ed683efb0c5b1268e67c6394..0d93
    }
  }
}
</script>