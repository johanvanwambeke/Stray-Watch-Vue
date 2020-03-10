<template>
  <v-layout rows wrap style="position:relative">
    <!-- filters -->
    <v-layout cols wrap>
      <v-flex xs4 pa-2>
        <v-select
          clearable
          dense
          flat
          solo
          hide-details
          v-model="animalFilter"
          :items="speciesList"
          label="Animal"
        ></v-select>
      </v-flex>
    </v-layout>
    <!-- map -->
    <v-flex xs12 pa-2>
      <v-card outlined style="overflow:hidden">
        <div class="mapcontainer">
          <v-skeleton-loader v-if="loadingMap" tile class="skeletonoverlay" type="image"></v-skeleton-loader>
          <div v-if="hintOnTwoFingers" class="overlay">
            <v-container fill-height fluid>
              <v-flex align="center" justify="center">
                <p>Use 2 fingers to move the map</p>
              </v-flex>
            </v-container>
          </div>
          <div id="map" ref="map" class="mapbox"></div>
        </div>
      </v-card>
    </v-flex>
    <!-- list of profiles -->
    <!-- skeleton  -->
    <v-layout v-if="loadingProfiles" wrap rows class="d-flex align-center">
      <div v-for="(w, g) in 4" :key="g" class="profileCard">
        <v-skeleton-loader rounded tile :key="g" class="mx-auto" type="card"></v-skeleton-loader>
      </div>
      <v-flex pa-2 xs12 class="d-flex align-center" style="color:#ccc">
        <p style="margin:0px;margin-right:10px">more then 3km away</p>
        <v-divider></v-divider>
      </v-flex>
      <div v-for="(j, i) in 12" :key="i+10" class="profileCard">
        <v-skeleton-loader rounded tile :key="i+10" class="mx-auto" type="card"></v-skeleton-loader>
      </div>
    </v-layout>
    <!-- actual profiles -->
    <v-layout xs12 v-if="!loadingProfiles" wrap rows class="d-flex align-center">
      <div
        v-for="(profile, i) in profiles.filter(profile=>profile.distance<=3)"
        :key="i+'f'"
        class="profileCard"
        @click="openProfile(profile.profileId)"
        style="cursor:pointer"
      >
        <v-btn v-if="$auth.loggedIn" @click="follow($event,profile)" text icon class="favoriteIcon">
          <v-icon v-if="!profile.follow" size="18px" color="gray">favorite_border</v-icon>
          <v-icon v-else size="18px" color="pink">favorite</v-icon>
        </v-btn>
        <v-layout v-ripple cols wrap flex align-center justify-center>
          <v-flex xs12 style="position:relative">
            <v-lazy>
              <div
                class="profileImage"
                style="text-align:center;background-size: cover;background-position: center;border-radius: 4px 4px 0px 0px"
                :style="{ backgroundImage: `url(${profile.pic})` }"
              ></div>
            </v-lazy>
          </v-flex>
          <v-flex xs12>
            <div class="profileDescription">
              <p style="font-size:15px;margin-bottom:4px">{{ profile.sentence }}</p>
              <p style="font-size:13px;color:light-grey">{{ profile.distance | twocomma }} Km</p>
            </div>
          </v-flex>
        </v-layout>
      </div>
      <!-- create new profile -->
      <div class="profileCard" @click="createProfile" style="cursor:pointer">
        <v-layout v-ripple cols wrap flex align-center justify-center>
          <v-flex xs12 style="position:relative">
            <v-lazy>
              <div
                class="profileImage"
                style="text-align:center;background-size: contain;background-position: center;border-radius: 4px 4px 0px 0px"
                :style="{ backgroundImage: `url(https://cdn2.iconfinder.com/data/icons/picons-basic-2/57/basic2-272_add_new_plus-512.png)` }"
              ></div>
            </v-lazy>
          </v-flex>
          <v-flex xs12>
            <div class="profileDescription">
              <p style="font-size:15px;margin-bottom:4px;text-align:center">Create a new profile</p>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </v-layout>
    <!-- further away -->
    <v-flex pa-2 xs12 class="d-flex align-center" style="color:#ccc">
      <p style="margin:0px;margin-right:10px">more then 3km away</p>
      <v-divider></v-divider>
    </v-flex>
    <v-layout xs12 v-if="!loadingProfiles" wrap rows class="d-flex align-center">
      <div
        v-for="(profile, i) in profiles.filter(profile=>profile.distance>3)"
        :key="i"
        class="profileCard"
        @click="openProfile(profile.profileId)"
        style="cursor:pointer"
      >
        <v-btn v-if="$auth.loggedIn" @click="follow($event,profile)" text icon class="favoriteIcon">
          <v-icon v-if="!profile.follow" size="18px" color="gray">favorite_border</v-icon>
          <v-icon v-else size="18px" color="pink">favorite</v-icon>
        </v-btn>
        <v-layout v-ripple cols wrap flex align-center justify-center>
          <v-flex xs12 style="position:relative">
            <v-lazy>
              <div
                class="profileImage"
                style="text-align:center;background-size: cover;background-position: center;border-radius: 4px 4px 0px 0px"
                :style="{ backgroundImage: `url(${profile.pic})` }"
              ></div>
            </v-lazy>
          </v-flex>
          <v-flex xs12>
            <div class="profileDescription">
              <p style="font-size:15px;margin-bottom:4px">{{ profile.sentence }}</p>
              <p style="font-size:13px;color:light-grey">{{ profile.distance | twocomma }} Km</p>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </v-layout>
  </v-layout>
</template>
<style>
.v-input .v-label {
  font-size: 12px !important;
}
</style>
<style scoped>
.favoriteIcon {
  height: 25px;
  width: 25px;
  position: absolute;
  top: 15px;
  left: calc(100% - 40px);
  z-index: 150;
  background-color: rgba(255, 255, 255, 0.8);
}
.profileCard {
  width: calc(100% / 4);
  height: 265px;
  position: relative;
  padding: 8px;
}

@media screen and (max-width: 850px) {
  .profileCard {
    width: calc(100% / 3);
  }
}

@media screen and (max-width: 700px) {
  .profileCard {
    width: calc(100% / 2);
  }
}

@media screen and (max-width: 400px) {
  .profileCard {
    width: calc(100%);
  }
}

.profileImage {
  height: 200px;
  width: auto;
}

.profileDescription {
  height: 20%;
  padding-top: 10px;
  color: black;
}

.mapcontainer {
  position: relative;
}
.overlay {
  pointer-events: none;
  background-color: rgba(112, 112, 112, 0.432);
  text-align: center;
  font-size: 24px;
  color: white;
}
.mapbox {
  width: 100%;
  height: 200px;
  z-index: 2;
}

.skeletonoverlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 300px !important;
  width: 100%;
  z-index: 10;
}

.popup {
  padding: 20px;
}
</style>
<script>
import { mapState, mapMutations } from 'vuex'
var map = null
var marker = null
var currentMarkers = []
export default {
  data() {
    return {
      // profiles: [],
      hintOnTwoFingers: false,
      myProfiles: false,
      animalFilter: '',
      needsFilter: '',
      needsLst: [],
      location: {},
      loadingProfiles: true,
      loadingMap: true
    }
  },
  head: {
    link: [
      {
        href: 'https://api.mapbox.com/mapbox-gl-js/v1.6.0/mapbox-gl.css',
        rel: 'stylesheet'
      }
    ]
  },
  filters: {
    twocomma: function(value) {
      return value.toFixed(2)
    }
  },
  watch: {
    animalFilter() {
      this.search()
    },
    needsFilter() {
      this.search()
    },
    myProfiles() {
      this.search()
    }
  },
  computed: {
    ...mapState({
      speciesList: state => state.profiles.speciesList,
      profiles: state => state.profiles.profiles
    })
  },
  async mounted() {
    console.log(this.$auth.user)
    navigator.geolocation.getCurrentPosition(success => {
      this.location.long = success.coords.longitude
      this.location.lat = success.coords.latitude
      this.createMap()
      this.search()
    })
  },
  methods: {
    ...mapMutations({
      setFollowInList: 'profiles/setFollowInList'
    }),
    createProfile() {
      this.$store
        .dispatch('profiles/create')
        .then(x => {
          this.$router.push('/profile/view/' + x + '?edit=true')
        })
        .catch(err => {})
    },
    search() {
      this.loadingProfiles = true
      var payload = {
        species: this.animalFilter,
        needs: this.needsFilter,
        deviceLong: this.location.long,
        deviceLat: this.location.lat,
        myprofiles: this.myProfiles,
        onlyFollow: this.onlyFollow
      }
      this.$store
        .dispatch('profiles/search', payload)
        .then(res => {
          // console.log(res)
          // this.profiles = res
          this.placeMapMarkers()
          this.loadingProfiles = false
        })
        .catch(err => {
          console.log(err)
          this.loadingProfiles = false
        })
    },
    createMap() {
      this.loadingMap = true
      var self = this
      const mapboxgl = require('mapbox-gl/dist/mapbox-gl')
      const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')

      console.log([this.location.long, this.location.lat])

      // generate mapbox
      mapboxgl.accessToken = process.env.MAP_TOKEN
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [this.location.long, this.location.lat],
        zoom: 10,
        attributionControl: false
      })

      //  map.addControl(new MultiTouch())
      map.on('dragstart', event => {
        console.log('dragstart')
        const isTouchScreenDevice =
          event.originalEvent && 'touches' in event.originalEvent
        if (isTouchScreenDevice) {
          const isTwoFingerTouch = event.originalEvent.touches.length >= 2
          if (!isTwoFingerTouch) {
            this.hintOnTwoFingers = true
            map.dragPan.disable()
          }
        }
      })

      map.on('touchstart', event => {
        console.log('dragstart')
        const isTouchScreenDevice =
          event.originalEvent && 'touches' in event.originalEvent
        if (isTouchScreenDevice) {
          const isTwoFingerTouch = event.originalEvent.touches.length >= 2
          if (isTwoFingerTouch) {
            this.hintOnTwoFingers = false
            map.dragPan.enable()
          }
        }
      })

      // geoLocateControl
      var geoLocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserLocation: true
      })
      map.addControl(geoLocateControl, 'top-left')
      this.loadingMap = false
    },
    placeMapMarkers() {
      const mapboxgl = require('mapbox-gl/dist/mapbox-gl')
      // remove markers
      if (currentMarkers !== null) {
        for (var i = currentMarkers.length - 1; i >= 0; i--) {
          currentMarkers[i].remove()
        }
      }
      // Create map--markers
      this.profiles.forEach(profile => {
        var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          '<div class="popup">' +
            '<h2>' +
            profile.species +
            '</h2>' +
            '<a href="profile/view/' +
            profile.profileId +
            '">profiel</a>' +
            '</div>'
        )

        var marker = new mapboxgl.Marker({
          color: profile.species == 'Cat' ? '#660000' : '#66A39E'
        })
          .setLngLat([profile.long, profile.lat])
          .setPopup(popup)
          .addTo(map)
        currentMarkers.push(marker)
      })
    },
    openProfile(id) {
      this.$router.push({ path: `/profile/view/` + id })
    },
    follow(event, profile) {
      event.stopPropagation()
      //update animalList

      this.$store
        .dispatch('user/follow', {
          profileId: profile.profileId,
          userID: this.$auth.user.userID,
          follow: profile.follow
        })
        .then(res => {
          this.setFollowInList({
            profileId: profile.profileId,
            follow: !profile.follow
          })
        })
    }
  }
}
</script>
