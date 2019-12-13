<template>
 <v-app light>
  <notifications group="foo" position="bottom right" />
  <v-container style="max-height:50px;">
   <v-layout rows wrap>
    <v-flex xs12>
     <nuxt-link to="/">List</nuxt-link>
     <a @click="create" class="underline">Create</a>
     <nuxt-link to="/donate">Donate</nuxt-link>
     <div style="float:right">
      <nuxt-link v-if="loggedIn" to="/user">User</nuxt-link>
      <nuxt-link v-if="loggedIn" to="/login" @click.native="logout"
       >Logout</nuxt-link
      >
      <nuxt-link v-if="!loggedIn" to="/register">Register</nuxt-link>
      <nuxt-link v-if="!loggedIn" to="/login">Log in</nuxt-link>
     </div>
    </v-flex>
    <v-flex xs12 pt-3> <v-divider></v-divider></v-flex>
   </v-layout>
  </v-container>

  <v-content>
   <v-container>
    <nuxt />
   </v-container>
  </v-content>
 </v-app>
</template>
<style scoped>
.underline {
 text-decoration: underline;
}
h1 {
 font-family: 'Playfair Display', serif;
}
.v-btn {
 color: rgb(255, 255, 255) !important;
 font-size: 14px;
 padding: 0px 25px;
}
.v-btn:hover {
 color: rgb(107, 107, 107) !important;
 font-size: 14px;
 border-bottom: 5px solid rgb(107, 107, 107);
}
.v-btn--active {
 color: rgb(107, 107, 107) !important;
 font-size: 14px;
 border-bottom: 5px solid rgb(107, 107, 107);
}

.appcss {
 background-image: linear-gradient(
  to bottom,
  #ffffff 0%,
  #d2d2d2 100%
 ) !important;
}
</style>

<script>
export default {
 middleware: 'authGuard',
 methods: {
  goTo(link) {
   this.$router.push({ path: `/` + link })
  }
 },
 head: {
  link: [
   {
    rel: 'stylesheet',
    href:
     'https://fonts.googleapis.com/css?family=Playfair+Display|Source+Sans+Pro:300,400&display=swap'
   }
  ]
 },
 data() {
  return {}
 },
 computed: {
  loggedIn() {
   return this.$store.state.user.token
  }
 },
 methods: {
  logout() {
   this.$cookies.remove('token')
   this.$store.commit('user/token', null)
  },
  create() {
   //create a new profile
   this.$store.dispatch('profiles/clear').then(x => {
    this.$store.dispatch('profiles/create').then(x => {
     this.$router.push('/profile/edit/' + x)
    })
   })
  }
 }
}
</script>
