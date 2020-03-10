<template>
  <div>
    <div class="mapblock">
      <div id="map" ref="map" class="mapbox"></div>
      <div class="floating-images" v-if="editing">
        <div
          class="image-thumbnail"
          @click="setLocation(img.long, img.lat)"
          v-for="(img,i) in images.filter(x=> x.long!=0 && x.long!=undefined)"
          :key="i"
        >
          <img class="image-style" height="35px" width="35px" :src="img.url" />
        </div>
      </div>
    </div>
    <div style="padding:8px">
      <a
        @click="openMaps"
        style="font-size:13px;color:black;text-decoration:underline"
      >{{ placename }}</a>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import 'https://api.mapbox.com/mapbox-gl-js/v1.6.0/mapbox-gl.css';
</style>
<script>
import { mapState } from 'vuex'
var map = null
var marker = null
export default {
  watch: {
    long: function(val) {
      console.log(val)
      var longlat = [this.long, this.lat]
      map.flyTo({ center: longlat })
      marker.setLngLat(longlat)
      this.getLocation()
    }
  },
  props: {
    editing: false
  },
  data() {
    return {
      dialog: false,
      placename: ''
    }
  },
  computed: {
    ...mapState({
      long: state => state.profiles.profile.long,
      lat: state => state.profiles.profile.lat,
      images: state => state.images.images
    })
  },
  mounted() {
    this.init()
    console.log(this.long, this.lat)
  },
  methods: {
    openMaps() {
      window.open(
        `https://maps.google.com/maps?daddr=${this.lat},${this.long}&amp;ll=`
      )
    },
    getLocation() {
      if (!this.long) return
      var url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/
      ${this.long},${this.lat}
      .json?access_token=` + process.env.MAP_TOKEN

      console.log('getlcation', url)
      this.$axios
        .get(url)
        .then(ress => {
          this.placename = ress.data.features[0].place_name
          console.log('placename', ress)
        })
        .catch(error => {
          console.log(error)
        })
    },
    init() {
      var self = this
      const mapboxgl = require('mapbox-gl/dist/mapbox-gl')
      const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
      // map1
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
        if (self.editing) {
          marker.setLngLat(e.lngLat)
          self.$store.commit('profiles/setlongLat', [
            e.lngLat.lng,
            e.lngLat.lat
          ])
        }
      })
      map.on('touch', function(e) {
        if (self.editing) {
          marker.setLngLat(e.lngLat)
          self.$store.commit('profiles/setlongLat', [
            e.lngLat.lng,
            e.lngLat.lat
          ])
        }
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
    },
    setLocation(long, lat) {
      this.$store.commit('profiles/setlongLat', [long, lat])
    }
  }
}
</script>
<style scoped>
.image-style {
  object-fit: cover;
  border-radius: 5px;
  border: solid white 1px;
}
.floating-images {
  position: absolute;
  top: 00px;
  left: 00px;
  /* background: rgba(255, 255, 255, 0.685); */
  border-radius: 5px;
  padding-top: 50px;
  width: 50px;
}
.image-thumbnail {
  margin: 10px;
  cursor: pointer;
}
.mapboxgl-ctrl-icon.mapboxgl-ctrl-geolocate {
  background-color: rgba(27, 27, 27, 0.246);
  margin-top: 20px;
  padding: 10px;
  height: 42px;
  width: 42px;
  border-radius: 50%;
}

.mapbox {
  width: 100%;
  height: 300px;
  position: relative;
}
</style>

