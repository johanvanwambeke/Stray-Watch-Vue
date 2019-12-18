<template>
 <div class="mapblock">
  <div id="map" ref="map" class="mapbox"></div>
 </div>
</template>
<style scoped>
.mapboxgl-ctrl-icon.mapboxgl-ctrl-geolocate {
 background-color: rgba(27, 27, 27, 0.246);
 margin-top: 20px;
 padding: 10px;
 height: 42px;
 width: 42px;
 border-radius: 50%;
}

.mapboxfull {
 width: 100vh;
 min-height: 100vh;
 z-index: 2;
}

.mapbox {
 width: 100%;
 padding-bottom: 75%;
 position: relative;
 height: 0;
}
</style>
<script>
import { mapState } from 'vuex'
var map = null
var marker = null
export default {
 watch: {
  longLat: function(val) {
   console.log('coord change')
   console.log(val)
   map.flyTo({ center: val })
   marker.setLngLat(val)
  }
 },
 data() {
  return {
   mapLongLat: [50, 50],
   dialog: false
  }
 },
 computed: {
  ...mapState({
   longLat: state => state.profiles.longLat
  })
 },
 mounted() {
  this.init()
 },
 methods: {
  init() {
   var self = this
   const mapboxgl = require('mapbox-gl/dist/mapbox-gl')
   const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
   // map1
   //////
   //////
   mapboxgl.accessToken = process.env.MAP_TOKEN
   map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [4.28, 50.3],
    zoom: 5,
    attributionControl: false
   })

   // Create the marker
   marker = new mapboxgl.Marker({
    draggable: true,
    color: '#66A39E'
   })
   marker.setLngLat([4.28, 50.3]).addTo(map)

   // Create marker Event
   function onDragEnd() {
    var lngLat = marker.getLngLat()
    self.$store.commit('profiles/setlongLat', [lngLat.lng, lngLat.lat])
   }
   marker.on('dragend', onDragEnd)

   map.on('click', function(e) {
    marker.setLngLat(e.lngLat)
    self.$store.commit('profiles/setlongLat', [e.lngLat.lng, e.lngLat.lat])
   })
   map.on('touch', function(e) {
    marker.setLngLat(e.lngLat)
    self.$store.commit('profiles/setlongLat', [e.lngLat.lng, e.lngLat.lat])
   })

   // Current location
   var currentLocation = new mapboxgl.GeolocateControl({
    positionOptions: {
     enableHighAccuracy: true
    },
    trackUserLocation: false,
    showUserLocation: false
   })
   map.addControl(currentLocation, 'top-left')
  }
 }
}
</script>
