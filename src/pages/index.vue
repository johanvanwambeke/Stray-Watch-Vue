<template>
 <v-layout rows wrap>
  <!-- filters -->
  <v-layout cols wrap>
   <v-flex xs6 md4 pa-2>
    <v-select
     clearable
     box
     v-model="animalFilter"
     :items="animalLst"
     label="Animal"
    ></v-select>
   </v-flex>
   <v-flex xs6 md4 pa-2>
    <v-select
     clearable
     box
     v-model="needsFilter"
     :items="needsLst"
     label="Purpose"
    ></v-select>
   </v-flex>
   <v-flex xs6 md4 pa-2>
    <v-switch color="black" v-model="myProfiles" label="My animals"></v-switch>
   </v-flex>
  </v-layout>
  <!-- map -->
  <v-flex xs12 pa-2> <div id="map" ref="map" class="mapbox"></div></v-flex>
  <!-- list of profiles -->
  <v-flex xs12>
   <div v-for="(profile, i) in profiles" :key="i" class="d-flex justify-center">
    <v-layout pa-2>
     <v-flex md8 xs12 class="d-flex align-stretch">
      <div class="profileDescription">
       <h1>{{ profile.animal }}</h1>
       <h3>{{ profile.needs }}</h3>
       <p style="color:light-gray">{{ profile.distance | twocomma }} Km</p>
       <v-btn @click="openProfile(profile.animalProfileId)">more</v-btn>
      </div>
     </v-flex>
     <v-flex md4 xs12 class="d-flex align-stretch">
      <img height="200" width="200" :src="profile.pic" />
     </v-flex>
    </v-layout>
   </div>
  </v-flex>
 </v-layout>
</template>
<style scoped>
.mapbox {
 width: 100%;
 height: 300px;
 z-index: 2;
}
.profileDescription {
 background-color: rgb(68, 68, 68);
 padding: 20px;
 padding-left: 30px;
 color: white;
}
.popup {
 padding: 20px;
}
</style>
<script>
var map = null
var marker = null
var currentMarkers = []
export default {
 head: {
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
   profiles: [],
   myProfiles: false,
   animalFilter: '',
   needsFilter: '',
   animalLst: ['cat', 'dog'],
   needsLst: [
    'fosterhome',
    'funding',
    'adoption',
    'finding new owner',
    'medical',
    'feeding',
    'driver'
   ],
   location: {}
  }
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
 mounted() {
  navigator.geolocation.getCurrentPosition(success => {
   this.location.long = success.coords.longitude
   this.location.lat = success.coords.latitude
   this.createMap()
   this.search()
  })
 },
 methods: {
  search() {
   var payload = {
    animal: this.animalFilter,
    needs: this.needsFilter,
    deviceLong: this.location.long,
    deviceLat: this.location.lat,
    myprofiles: this.myProfiles
   }
   this.$store
    .dispatch('profiles/search', payload)
    .then(res => {
     console.log(res)
     this.profiles = res
     this.placeMapMarkers()
    })
    .catch(err => {
     console.log(err)
    })
  },
  createMap() {
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

   // geoLocateControl
   var geoLocateControl = new mapboxgl.GeolocateControl({
    positionOptions: {
     enableHighAccuracy: true
    },
    trackUserLocation: false,
    showUserLocation: false
   })
   map.addControl(geoLocateControl, 'top-left')
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
      profile.animal +
      '</h2>' +
      '<a href="profile/view/' +
      profile.animalProfileId +
      '">profiel</a>' +
      '</div>'
    )

    var marker = new mapboxgl.Marker({
     color: profile.animal == 'cat' ? '#660000' : '#66A39E'
    })
     .setLngLat([profile.long, profile.lat])
     .setPopup(popup)
     .addTo(map)
    currentMarkers.push(marker)
   })
  },
  openProfile(id) {
   this.$router.push({ path: `/profile/view/` + id })
  }
 }
}
</script>
