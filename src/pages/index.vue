<template>
 <v-layout rows wrap>
  <!-- filters -->
  <v-layout cols wrap>
   <v-flex xs4 md4 pa-2>
    <v-select
     clearable
     filled
     v-model="animalFilter"
     :items="animalLst"
     label="Animal"
    ></v-select>
   </v-flex>
   <v-flex xs4 md4 pa-2>
    <v-select
     clearable
     filled
     v-model="needsFilter"
     :items="needsLst"
     label="Purpose"
    ></v-select>
   </v-flex>
   <v-flex xs4 md4 pa-2>
    <v-switch color="black" v-model="myProfiles" label="My animals"></v-switch>
   </v-flex>
  </v-layout>
  <!-- map -->
  <v-flex xs12 pa-2>
   <div class="mapcontainer">
    <div v-if="hintOnTwoFingers" class="overlay">
     <v-container fill-height fluid>
      <v-flex align="center" justify="center">
       <p>Use 2 fingers to move the map</p>
      </v-flex>
     </v-container>
    </div>
    <div id="map" ref="map" class="mapbox"></div>
   </div>
  </v-flex>
  <!-- list of profiles -->
  <v-layout wrap rows class="d-flex align-stretch">
   <div v-for="(profile, i) in profiles" :key="i" class="d-flex align-center">
    <v-lazy transition="fade-transition">
     <div
      class="profileCard"
      @click="openProfile(profile.animalProfileId)"
      style="cursor:pointer"
      v-ripple
     >
      <v-layout cols wrap flex align-center justify-center>
       <v-flex xs12>
        <div
         class="profileImage"
         style="text-align:center;background-size: cover;background-position: center;"
         :style="{ backgroundImage: `url(${profile.pic})` }"
        ></div>
       </v-flex>
       <v-flex xs12>
        <div class="profileDescription">
         <h4>{{ profile.animal }}</h4>
         <p style="color:light-grey">{{ profile.distance | twocomma }} Km</p>
        </div>
       </v-flex>
      </v-layout>
     </div>
    </v-lazy>
   </div>
  </v-layout>
 </v-layout>
</template>
<style scoped>
.profileCard {
 min-width: 100px;
 width: calc(100vw / 6);
 height: calc(100vh / 3.5);
 margin: 8px;
}

.profileImage {
 height: calc(100vh / 5);
}

@media screen and (max-width: 900px) {
 .profileCard {
  min-width: 100px;
  width: calc(100vw / 4);
  height: calc(100vh / 3.5);
  margin: 5px;
 }
 .profileImage {
  height: calc(100vh / 5);
 }
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

 position: absolute;
 top: 0;
 left: 0;
 height: 100%;
 width: 100%;
 z-index: 10;
}
.mapbox {
 width: 100%;
 height: 300px;
 z-index: 2;
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
   hintOnTwoFingers: false,
   myProfiles: false,
   animalFilter: '',
   needsFilter: '',
   animalLst: ['cat', 'dog'],
   needsLst: [
    'capture',
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
