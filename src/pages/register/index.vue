<template>
  <v-layout color="FFFFFF">
    <v-flex>
      <h1>Join your fellow Stray Heroes</h1>
      <ul>
        <li>Create new profiles</li>
        <li>Edit existing profiles</li>
        <li>Get phone notifications</li>
      </ul>
      <v-text-field aria-placeholder="Email"></v-text-field>

      <div class="onesignal-customlink-container"></div>

      <v-form>
        <v-text-field v-model="firstName" label="firstname" required></v-text-field>
        <v-text-field v-model="lastName" label="lastname" required></v-text-field>
        <v-text-field v-model="email" label="email" required></v-text-field>
        <v-text-field v-model="password" label="password" required></v-text-field>
        <v-btn @click="register">Register</v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data: () => ({
    firstName: 'Johan',
    lastName: 'Van Wambeke',
    email: 'johan.van.wambeke@gmail.com',
    password: 'secret'
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
      // var img = new Image();
      // img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
      // output.appendChild(img);

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