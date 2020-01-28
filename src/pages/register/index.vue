<template>
  <v-layout color="FFFFFF">
    <v-flex>
      <h2>Join your fellow Stray Heroes</h2>
      <ul>
        <li>Create new profiles</li>
        <li>Edit existing profiles</li>
      </ul>
    </v-flex>
    <!-- <div class="onesignal-customlink-container"></div> -->
    <v-flex>
      <v-form>
        <v-text-field v-model="firstName" label="firstname" required></v-text-field>
        <v-text-field v-model="lastName" label="lastname" required></v-text-field>
        <v-text-field v-model="email" label="email" required></v-text-field>
        <v-text-field type="password" v-model="password" label="password" required></v-text-field>
        <v-btn @click="register">Register</v-btn>
      </v-form>

      <v-btn @click="registerWithGoogle">Register With Google</v-btn>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data: () => ({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  }),
  methods: {
    register() {
      var obj = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      }
      this.$store
        .dispatch('user/create', obj)
        .then(res => {
          alert(res)
        })
        .catch(err => {
          alert(err)
        })
    },
    registerWithGoogle() {
      this.$auth.loginWith('google').then(res => {
        console.log(res)
        // var obj = {
        //   firstName: this.firstName,
        //   lastName: this.lastName,
        //   email: this.email,
        //   password: this.password
        // }
        // this.$store
        //   .dispatch('user/create', obj)
        //   .then(res => {
        //     alert(res)
        //   })
        //   .catch(err => {
        //     alert(err)
        //   })
      })
    },
    onsignal() {
      var output = document.getElementById('out')
      navigator.geolocation.getCurrentPosition(
        success => {
          var latitude = position.coords.latitude
          var longitude = position.coords.longitude
          console.log(
            'Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°'
          )

          OneSignal.push(function() {
            OneSignal.sendTags({
              latitude: latitude,
              long: longitude
            })
          })
        },
        error => {
          alert('fail')
        }
      )

      // Inside page components
      this.$OneSignal.push(() => {
        this.$OneSignal.isPushNotificationsEnabled(isEnabled => {
          if (isEnabled) {
            console.log('Push notifications are enabled!')
          } else {
            console.log('Push notifications are not enabled yet.')
          }
        })
      })

      // Using window and array form
      window.$OneSignal.push([
        'addListenerForNotificationOpened',
        data => {
          console.log('Received NotificationOpened:', data)
        }
      ])
    }
  },
  mounted() {}
}
</script>
