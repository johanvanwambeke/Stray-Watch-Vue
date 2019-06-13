<template>
    <div>
        <div class="mapblock">
            
            <div id="map" ref='map' class="mapbox"></div>
            <div id='geocoder' class='geocoder'></div>
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
            <v-btn icon flat  >
                <v-icon>rotate_90_degrees_ccw</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon flat  >
                OK
            </v-btn>
            </v-toolbar>           
            <div id="map2" ref='map2' class="mapboxFull"></div>
        </v-dialog> 
    </div>
</template>
<style>
.mapblock{
    position: relative;
}
.mapbox{
    width:100%;
    min-height:150px;    
    border-radius: 10px;
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

.my-custom-control {
  color: #f00;
  background: #000;
  padding: 8px;
  border-radius: 4px;
  margin: 8px;
}
.mapboxgl-ctrl-geocoder {
    width:70%;
    min-width:100px;
    background-color: rgba(255, 255, 255, 0.15);
}
.mapboxgl-ctrl-icon{
    background-color: rgba(255, 255, 255, 0.15);

}

</style>
<script>
import { mapState } from 'vuex'
var map = null;
var map2 = null;
var marker = null;
export default {
    watch:{
        longLat: function (val) {
            map.flyTo({center:val});
            marker.setLngLat(val)
        },
    },
    data(){
        return{
            cords:[50,50],
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
        fullScreen(){
            map.getContainer().requestFullscreen()
        },
        dosmth(){
            console.log(map.getContainer())
        },
        getstatus(){
          var status =  this.$store.state.profiles.longLat
          console.log('coords')
          console.log(status)
          map.flyTo({center:status});
        },
        init(){
            var self = this
            mapboxgl.accessToken = process.env.MAP_TOKEN;
            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: this.cords,
                zoom: 11
            });
            
            // Create the marker
            marker = new mapboxgl.Marker({
                draggable: true
            })
            marker.setLngLat(this.cords)
            .addTo(map);

            // Create marker Event
            function onDragEnd() {
                var lngLat = marker.getLngLat();      
                // self.$store.commit('profiles/setlongLat', lngLat)
            }            
            marker.on('dragend', onDragEnd);
            
            map.on('click',function(e){
                console.log(e)
                marker.setLngLat(e.lngLat)
                // map.flyTo({center:e.lngLat})
            })
            map.on('touch',function(e){
                console.log(e)
                marker.setLngLat(e.lngLat)
                map.flyTo({center:e.lngLat})
            })            
            // search
            var searchControl = new MapboxGeocoder({
                accessToken: process.env.MAP_TOKEN,
                mapboxgl: mapboxgl})
            map.addControl(searchControl,'top-right')
            // Full screen
            var fullScreen = new mapboxgl.FullscreenControl({
                position: 'top-left'
            })
            map.addControl(fullScreen, 'top-left');
            // Current location
            var currentLocation = new mapboxgl.GeolocateControl({
                positionOptions: {
                enableHighAccuracy: true
                },
                trackUserLocation: true,
            })
            map.addControl(currentLocation,'top-left');

        }
    },
    
   
}
</script>

