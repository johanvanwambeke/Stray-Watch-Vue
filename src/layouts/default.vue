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
    <v-flex xs4 sm2>
     <v-btn small text to="/">List</v-btn>
    </v-flex>
    <v-flex xs4 sm2>
     <v-btn small text @click="create">Create</v-btn>
    </v-flex>
    <v-flex xs4 sm2>
     <v-btn small text to="/donate">Donate</v-btn>
    </v-flex>
    <client-only>
     <v-flex xs4 sm2 offset-sm2>
      <v-menu offset-y v-if="alerts.length > 0">
       <v-btn small text v-slot:activator="{ on }">
        alerts {{ alerts.length }}
        <v-icon>expand_more</v-icon>
       </v-btn>
       <v-flex style="background-color:white">
        <v-flex v-for="(alert, i) in alerts" :key="i" xs12>
         <v-btn small flat @click="gotoProfile(alert.profileID)"
          >#{{ alert.profileID }} has new messages</v-btn
         >
        </v-flex>
       </v-flex>
      </v-menu>
     </v-flex>
     <v-flex xs4 sm2>
      <v-menu offset-y>
       <v-btn small text slot="activator">
        User
        <v-icon>expand_more</v-icon>
       </v-btn>
       <v-flex style="background-color:white">
        <v-flex xs12 v-if="$auth.loggedIn">
         <v-btn small text to="/user">User</v-btn>
        </v-flex>
        <v-flex xs12 v-if="$auth.loggedIn">
         <v-btn small text @click="logout">Logout</v-btn>
        </v-flex>
        <v-flex xs12 v-if="!$auth.loggedIn">
         <v-btn small text to="/register">Register</v-btn>
        </v-flex>
        <v-flex xs12 v-if="!$auth.loggedIn">
         <v-btn small text to="/login">Log in</v-btn>
        </v-flex>
       </v-flex>
      </v-menu>
     </v-flex>
    </client-only>
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
import { mapState } from 'vuex'
export default {
 middleware: 'authGuard',
 methods: {
  goTo(link) {
   this.$router.push({ path: `/` + link })
  }
 },
 data() {
  return { snackbar: false }
 },
 computed: {
  snackmsg() {
   var message = this.$store.state.utils.snackmsg
   if (message != '') this.snackbar = true
   return message
  },
  ...mapState({
   alerts: state => state.user.userfollowsAlert
  })
 },
 methods: {
  logout() {
   this.$auth.logout()
  },
  gotoProfile(profileID) {
   this.$store.dispatch('user/removeAlert', { profileID })
   this.$router.push('/profile/view/' + profileID)
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
