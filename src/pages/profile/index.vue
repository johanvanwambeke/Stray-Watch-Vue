<template>
  <div>
    <LoadingScreen :value="loading" progressColor="green" :message="loadingMessage"/>
    <v-stepper non-linear>
      <v-stepper-header>
        <v-stepper-step editable step="1">Pictures</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step editable step="2">Location</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step editable step="3">Crusial info</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <ImageSlider class="mt-4"/>
        </v-stepper-content>
        <v-stepper-content step="2">
          <MapBox class="mt-4"/>
        </v-stepper-content>
        <v-stepper-content step="3">
          <AnimalProfileForm/>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-container class="mt-4">
      <v-btn @click="saveProfile">Save profile</v-btn>
    </v-container>
  </div>
</template>
<style scoped>
.v-stepper:not(.v-stepper--vertical) .v-stepper__label {
  display: none !important;
}

.v-stepper__label {
  display: block !important;
}
.v-stepper-step {
  background-color: green;
}
.mapbox {
  padding: 15px;
  background-color: #e5897a;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
</style>

<script>
import { mapState } from 'vuex'
import ImageSlider from '~/components/ImageSlider.vue'
import MapBox from '~/components/MapBox.vue'
import LoadingScreen from '~/components/LoadingScreen.vue'
import AnimalProfileForm from '~/components/AnimalProfileForm.vue'
export default {
  head: {
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js' }
    ],
    link: [
      {
        href: 'https://api.mapbox.com/mapbox-gl-js/v1.0.0/mapbox-gl.css',
        rel: 'stylesheet'
      },
      {
        href:
          'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.3.0/mapbox-gl-geocoder.css',
        rel: 'stylesheet',
        type: 'text/css'
      }
    ]
  },
  data() {
    return {
      loadingMessage: 'Saving profile',
      loading: false
    }
  },
  components: {
    ImageSlider,
    MapBox,
    LoadingScreen,
    AnimalProfileForm
  },
  computed: {
    ...mapState({
      imageOK: state => state.profiles.imageOK,
      locationOK: state => state.profiles.locationOK,
      dataOK: state => state.profiles.dataOK,
      images: state => state.images.images
    })
  },
  methods: {
    async saveProfile() {
      this.loading = true
      //I will wrap the form data in 1 object and send it to the backend to save
      //It returns the ID of the profile
      //I navigate to the profile ID
      var imagesb64 = this.images.map(a => a.src)
      var profile = this.$store.getters['profiles/profile']
      console.log(profile)
      profile = {
        ...profile,
        // 'location':this.longLat ? '' : this.longLat.tostring(),
        images64: imagesb64
      }
      console.log(profile)

      this.$store
        .dispatch('profiles/saveProfile', profile)
        .then(profileId => {
          console.log(profileId)
          this.$router.push({ path: `/profile/${profileId}` })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
