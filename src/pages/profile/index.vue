<template>
  <div class="maindiv">
    <LoadingScreen :value="loading" progressColor="green" :message="loadingMessage"/>
    <v-stepper non-linear v-model="stepCount">
      <v-stepper-header class="sticky">
        <v-stepper-step editable step="1">Pictures</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step editable step="2">Location</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step editable step="3">Crusial info</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <h1>Picture time</h1>
          <TipSpinner class="mt-3"></TipSpinner>
          <ImageSlider class="imageSlider"/>
          <ul>
            <li>
              <v-icon>add_a_photo</v-icon>This allows you to add a picture
            </li>
            <li>
              <v-icon>crop_rotate</v-icon>Cut off some part? Use this button
            </li>
            <li>
              <v-icon>outlined_flag</v-icon>Press the flag on your favorite image
            </li>
            <li>
              <v-icon>delete</v-icon>Ooops wrong image, delete!
            </li>
          </ul>
          <p>Chose or take up to 4 pictures.</p>
          <p>encourage while uploading somehow...? Show good examples</p>
          <p>You have no images ? Continue without adding any images ?</p>
          <p>You have 4 images, nice! Next step :)</p>
          <v-btn @click="stepCount = 2">Continue</v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <h1>Where ?!</h1>
          <p>You can move the map around and place the pin to indicate the location.</p>
          <p>X images with location tracking, i placed X pins on the map.</p>

          <div
            v-for="i in images"
            :style="{'background-image': 'url(' + (i.src) + ')'}"
            class="locationImages grow"
            @click="setLocation(i.longlat)"
          >
            <!-- <img style="width:100px;height:100px;float:left" :src="i.src"> -->
          </div>
          {{longLat}}
          <MapBox class="mt-4"/>
          <p>This is amaizing, we know what he/she looks like! And where to find it.</p>
          <p>Now let's find out if it is in fact a He or a She.</p>
          <v-btn @click="stepCount =3">Continue</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <AnimalProfileForm/>
          <p>This was the last step, now save and you get a unique profile, sharable anywhere and everywhere.</p>
          <v-btn @click="saveProfile">Complete</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>
<style scoped>
.maindiv {
  font-family: 'Source Sans Pro', sans-serif;
  /* font-family: 'Playfair Display', serif; */
  font-size: 25;
}
h1 {
  font-family: 'Playfair Display', serif;
}
.locationImages {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-color: black;
  width: 50px;
  height: 50px;
  cursor: pointer;
  border-radius: 50%;
}
.grow {
  transition: all 0.2s ease-in-out;
}

.grow:hover {
  transform: scale(1.1);
}
ul {
  margin-top: 20px;
  margin-bottom: 20px;
}
li {
  list-style-type: none;
  margin-left: -20px;
}
li .v-icon {
  margin-right: 10px;
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
.imageSlider {
  border-radius: 10px;
}
</style>
<script>
import { mapState } from 'vuex'
import ImageSlider from '~/components/ImageSlider.vue'
import MapBox from '~/components/MapBox.vue'
import LoadingScreen from '~/components/LoadingScreen.vue'
import AnimalProfileForm from '~/components/AnimalProfileForm.vue'
import TipSpinner from '~/components/TipSpinner.vue'
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
      loading: false,
      stepCount: 1
    }
  },
  components: {
    ImageSlider,
    MapBox,
    LoadingScreen,
    AnimalProfileForm,
    TipSpinner
  },
  computed: {
    ...mapState({
      imageOK: state => state.profiles.imageOK,
      locationOK: state => state.profiles.locationOK,
      dataOK: state => state.profiles.dataOK,
      images: state => state.images.imagesWithLoc,
      longLat: state => state.profiles.longLat
    })
  },
  methods: {
    setLocation(payload) {
      console.log(payload)
      if (payload && payload.longitude)
        this.$store.commit('profiles/setlongLat', [
          payload.longitude,
          payload.latitude
        ])
    },
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
