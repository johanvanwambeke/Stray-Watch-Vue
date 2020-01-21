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
   <!-- <v-layout wrap rows class>
        <div class="nav-button d-flex justify-center" v-for="an in 5">
          <div class="text-center">
            <v-icon>pets</v-icon>
            <p style="font-size:10px">Animals</p>
          </div>
        </div>
      </v-layout>-->
   <v-layout cols wrap mb-2 pa-2>
    <v-flex xs3>
     <v-btn small text to="/">Animals</v-btn>
    </v-flex>
    <v-flex xs3>
     <v-btn small text @click="create">Create</v-btn>
    </v-flex>
    <!-- <v-flex xs3>
          <v-btn small text to="/donate">Donate</v-btn>
        </v-flex>-->
    <client-only>
     <!-- alert -->
     <v-flex xs3 v-if="alerts.length > 0">
      <v-menu offset-y>
       <template v-slot:activator="{ on }">
        <v-btn small text v-on="on">
         alerts {{ alerts.length }}
         <v-icon>expand_more</v-icon>
        </v-btn>
       </template>

       <v-flex style="background-color:white">
        <v-flex v-for="(alert, i) in alerts" :key="i" xs12>
         <v-btn small text @click="gotoProfile(alert.profileID)"
          >#{{ alert.profileID }} has new messages</v-btn
         >
        </v-flex>
       </v-flex>
      </v-menu>
     </v-flex>
     <!-- user -->
     <v-flex xs3 v-bind:class="{ 'offset-sm3': alerts.length === 0 }">
      <v-menu offset-y>
       <template v-slot:activator="{ on }">
        <v-btn small text v-on="on">
         {{ $auth.loggedIn ? username : 'Log in' }}
         <v-icon>expand_more</v-icon>
        </v-btn>
       </template>

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
   <v-divider
    style="margin-left:8px;margin-right:8px;padding-bottom:8px;"
   ></v-divider>

   <nuxt />
  </v-container>
 </v-app>
</template>
<style scoped>
.nav-button {
 width: calc(100% / 5);
 height: 50px;
 position: relative;
}
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
  username() {
   var value = this.$auth.user.email
   if (!value) return ''
   value = value.toString()
   if (value.length > 9) {
    return value.substring(0, 9) + '..'
   } else {
    return value
   }
  },
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
