<template>
 <v-app light>
  <v-container>
   <!-- snackbar -->
   <v-snackbar v-model="snackbar" bottom color="black">
    <center>
     <p style="color:red">{{ snackmsg }}</p>
    </center>
   </v-snackbar>
   <!-- navigatie -->
   <v-layout cols wrap mb-3>
    <v-flex xs4 sm2> <v-btn small flat to="/">List</v-btn> </v-flex>
    <v-flex xs4 sm2> <v-btn small flat @click="create">Create</v-btn> </v-flex>
    <v-flex xs4 sm2>
     <v-btn small flat to="/donate">Donate</v-btn>
    </v-flex>
    <v-flex xs4 offset-xs4 sm2 offset-sm2>
     <v-btn small flat v-if="loggedIn" to="/user">User</v-btn>
    </v-flex>
    <v-flex xs4 sm2>
     <v-btn small flat v-if="loggedIn" @click="logout">Logout</v-btn>
    </v-flex>
    <v-flex xs4 sm2>
     <v-btn small flat v-if="!loggedIn" to="/register">Register</v-btn>
    </v-flex>
    <v-flex xs4 sm2>
     <v-btn small flat v-if="!loggedIn" to="/login">Log in</v-btn>
    </v-flex>
   </v-layout>
   <v-divider style="margin-bottom:20px;"></v-divider>
   <nuxt />
  </v-container>
 </v-app>
</template>
<style scoped>
.align-right {
 display: flex;
 justify-content: flex-end;
}
.align-left {
 display: flex;
 justify-content: flex-start;
}
.underline {
 text-decoration: underline;
}
h1 {
 font-family: 'Playfair Display', serif;
}
.v-btn {
 color: rgb(41, 41, 41) !important;
 font-size: 14px;
 padding: 0px 25px;
}
.v-btn:hover {
 color: rgb(107, 107, 107) !important;
 font-size: 14px;
 /* border-bottom: 5px solid rgb(107, 107, 107); */
}
.v-btn--active {
 color: rgb(107, 107, 107) !important;
 font-size: 14px;
 /* border-bottom: 5px solid rgb(107, 107, 107); */
 background-color: transparent !important;
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
  return { snackbar: false }
 },
 computed: {
  loggedIn() {
   return this.$store.state.user.token
  },
  snackmsg() {
   var message = this.$store.state.utils.snackmsg
   if (message != '') this.snackbar = true
   return message
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
    this.$store
     .dispatch('profiles/create')
     .then(x => {
      this.$router.push('/profile/edit/' + x)
     })
     .catch(err => {})
   })
  }
 }
}
</script>
