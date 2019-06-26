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
        <v-divider></v-divider>
        <v-stepper-step editable step="4">Share</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <h1>Picture time</h1>
          <TipSpinner class="mt-3"></TipSpinner>
          <ImageSlider class="imageSlider"/>
          <ul>
            <li>
              <v-icon>add_a_photo</v-icon>This allows you to add a picture.
            </li>
            <li>
              <v-icon>crop_rotate</v-icon>Cut off some part? Use this button.
            </li>
            <li>
              <v-icon>outlined_flag</v-icon>Flagged image wil be used as the main image when sharing.
            </li>
            <li>
              <v-icon>delete</v-icon>Ooops wrong image, delete!
            </li>
            <li>
              <v-icon>fullscreen</v-icon>Make it bigger!
            </li>
          </ul>
          <v-btn @click="stepCount = 2">Continue</v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <h1>Location</h1>
          <p>Either for finding the animal to help, or to know where to place it back after helping, a location is a crusial starting point.</p>
          <div
            v-for="i in images.filter(x=>x.longlat != null)"
            :style="{'background-image': 'url(' + (i.src) + ')'}"
            class="locationImages grow"
            @click="setLocation(i.longlat)"
          ></div>
          {{longLat}}
          <MapBox class="mt-4"/>
          <v-btn @click="stepCount =3">Continue</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <AnimalProfileForm :editable="true"/>
          <v-btn @click="stepCount =4">Continue</v-btn>
        </v-stepper-content>
        <v-stepper-content step="4">
          <AnimalProfileForm :editable="false"/>
          <div
            class="imagediv"
            v-if="images.length>0"
            :style="{'background-image': 'url(' + (images.filter(x=>x.main === true)[0].src) + ')'}"
          ></div>
          <p>Location: {{longLat}}</p>
          <v-btn @click="saveProfile">Complete</v-btn>
          <v-text-field
            append-icon="file_copy"
            ref="copyUrl"
            value="https://app.straywatch/profiles/..."
            @click:append="copyText"
          ></v-text-field>
          <iframe
            :src="`https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fapp.stray-watch.com%2Fprofile%2F${10}&layout=button_count&size=large&appId=1985973471691447&width=84&height=28`"
            width="84"
            height="28"
            style="border:none;overflow:hidden"
            scrolling="no"
            frameborder="0"
            allowtransparency="true"
            allow="encrypted-media"
          ></iframe>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>
<style scoped>
.imagediv {
  width: 100%;
  height: 300px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
.maindiv {
  font-family: 'Source Sans Pro', sans-serif;
  /* font-family: 'Playfair Display', serif; */
  font-size: 25;
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
    copyText() {
      this.$refs.copyUrl.select()
      document.execCommand('copy')
    },
    async saveProfile() {
      this.loading = true
      //I will wrap the form data in 1 object and send it to the backend to save
      //It returns the ID of the profile
      //I navigate to the profile ID
      var imagesb64 = this.images.map(a => a.src)
      var profile = {
        animal: this.$store.getters['profiles/animal'],
        age: this.$store.getters['profiles/age'],
        needs: this.$store.getters['profiles/needs'],
        medical: this.$store.getters['profiles/medical'],
        urgency: this.$store.getters['profiles/urgency'],
        behavior: this.$store.getters['profiles/behavior'],
        info: this.$store.getters['profiles/info'],
        longLat: this.$store.getters['profiles/longLat']
      }
      // console.log(profile)
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
