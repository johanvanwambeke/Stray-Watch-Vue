<template>
    <div>
        <div class="mapblock">
            <!-- <div ref="btnBig" class="btnBigMap" @click="fullScreen"><v-icon>search</v-icon></div> -->
            <div id="map" ref='map' class="mapbox"></div>
        </div>   
          <v-dialog 
        v-model="dialog">
        <v-toolbar 
          flat
          dark
          dense
          class="croppernavup"
          color="black">
          <v-btn icon flat  @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon flat  @click="resizeMap">
            OK
          </v-btn>
        </v-toolbar>
        <div id="map2" ref='map2' class="mapboxfull" ></div>        
      </v-dialog> 
    </div>
</template>
<style scoped>
.mapboxgl-ctrl-icon.mapboxgl-ctrl-geolocate{
  background-color:rgba(27, 27, 27, 0.246);
  margin-top: 20px;
  /* background-color: #66A39D; */
  padding:10px;
  height:42px;
  width:42px;
  border-radius:50%;

}
.btnBigMap{
    background-color: rgb(241, 241, 241);
    padding: 5px;
    z-index: 3;
    position: absolute;
    top:10px;
    left:10px;
}

.mapboxfull{
    width:100vh;
    min-height:100vh;    
    z-index: 2;
}

.mapblock{
    position: relative;
}
.mapbox{
    width:100%;
    min-height:150px;    
    z-index: 2;
}
.overlay{
    border-radius: 10px;
    width:100%;
    height: 100%;
    background-color: rgba(66, 66, 66, 0.315);
    position: absolute;
    top:0px;
    left:0px;
    z-index: 3;
}




</style>
<script>
import { mapState } from 'vuex'
var map = null;
var map2 = null;
var marker = null;
var marker2 = null;
export default {
    watch:{
        longLat: function (val) {
            map.flyTo({center:val});
            // map2.flyTo({center:val});
            marker.setLngLat(val)
            // marker2.setLngLat(val)
            console.log('úpdated')
        },
    },
    data(){
        return{
            mapLongLat:[50,50],
            dialog:false,
        }
    },
    computed:{
        ...mapState({
            longLat: state => state.profiles.longLat,
            })
    },
    mounted(){
        this.init()
    },
    methods:{
        resizeMap(){
            map2.resize()
        },
        fullScreen(){
            this.dialog=true
            // map2.getContainer().requestFullscreen()
            // this.$refs.map2.style.height = '100%'
            map2.resize()
        },
        getstatus(){
          var status =  this.$store.state.profiles.longLat
          console.log('coords')
          console.log(status)
          map.flyTo({center:status});
        },
        init(){
            var self = this
            const mapboxgl = require('mapbox-gl/dist/mapbox-gl')
            const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
            // map1
            //////
            //////
            mapboxgl.accessToken = process.env.MAP_TOKEN;
            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: this.cords,
                zoom: 9,
                attributionControl: false
            });
            
            // Create the marker
            marker = new mapboxgl.Marker({
                draggable: true,
                color:'#66A39E'
            })
            marker.setLngLat([4.28,50.30])
            .addTo(map);

            // Create marker Event
            function onDragEnd() {
                var lngLat = marker.getLngLat();
                // marker2.setLngLat(e.lngLat)
                // map2.flyTo({center:val});
            }            
            marker.on('dragend', onDragEnd);
            
            map.on('click',function(e){
                marker.setLngLat(e.lngLat)
                // marker2.setLngLat(e.lngLat)
                // map2.flyTo({center:e.lngLat})
            })
            map.on('touch',function(e){
                marker.setLngLat(e.lngLat)
                // marker2.setLngLat(e.lngLat)
                // map2.flyTo({center:e.lngLat});
            })            

            // Current location
            var currentLocation = new mapboxgl.GeolocateControl({
                positionOptions: {
                enableHighAccuracy: true
                },
                trackUserLocation: false,
                showUserLocation: false
            })
            map.addControl(currentLocation,'top-left');

        },
        createMap2(){
            mapboxgl.accessToken = process.env.MAP_TOKEN;
            map2 = new mapboxgl.Map({
                container: 'map2',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: this.cords,
                zoom: 11
            });
             // search
            var searchControl = new MapboxGeocoder({
                accessToken: process.env.MAP_TOKEN,
                mapboxgl: mapboxgl})
            map2.addControl(searchControl,'top-left')

             // Create the marker
            marker2 = new mapboxgl.Marker({
                draggable: true,
                color:'#66A39E'
            })
            marker2.setLngLat(this.longLat)
            .addTo(map2);

            // Create marker Event
            function onDragEnd2() {
                var lngLat = marker2.getLngLat(); 
                marker.setLngLat(lngLat)
                map.flyTo({center:lngLat})
                console.log('draged it 2')
            }            
            marker2.on('dragend', onDragEnd2);
            
            map2.on('click',function(e){
                marker2.setLngLat(e.lngLat)
                marker.setLngLat(e.lngLat)
                map.flyTo({center:e.lngLat});
            })
            map2.on('touch',function(e){
                marker2.setLngLat(e.lngLat)
                marker.setLngLat(e.lngLat)
                map.flyTo({center:e.lngLat});
            })            
        }
    },
    
   
}


</script>

