<template>
    <div>
        <div class="mapblock">
            <div  class="btnBigMap" @click="fullScreen"><v-icon>search</v-icon></div>
            <div id="map" ref='map' class="mapbox"></div>
            <div id="map2" ref='map2' class="mapboxFull"></div>
        </div>   
    </div>
</template>
<style scoped>
.btnBigMap{
    background-color: rgb(241, 241, 241);
    border-radius: 10px;
    padding: 5px;
    z-index: 3;
    position: absolute;
    top:10px;
    left:10px;
}
.btnBigMap:hover{
    background-color: rgb(241, 241, 241);
    border-radius: 10px;
    border:solid gray 1px;
    padding: 5px;
    z-index: 3;
    position: absolute;
    top:10px;
    left:10px;
}

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

.mapboxFull{
    z-index: 10;
}

.my-custom-control {
  color: #f00;
  background: #000;
  padding: 8px;
  border-radius: 4px;
  margin: 8px;
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
            map2.flyTo({center:val});
            marker.setLngLat(val)
            marker2.setLngLat(val)
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
        fullScreen(){
            map2.getContainer().requestFullscreen()
        },
        getstatus(){
          var status =  this.$store.state.profiles.longLat
          console.log('coords')
          console.log(status)
          map.flyTo({center:status});
        },
        init(){
            var self = this
            this.createMap2()
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
                marker2.setLngLat(e.lngLat)
                map2.flyTo({center:val});
            }            
            marker.on('dragend', onDragEnd);
            
            map.on('click',function(e){
                marker.setLngLat(e.lngLat)
                marker2.setLngLat(e.lngLat)
                map2.flyTo({center:e.lngLat})
            })
            map.on('touch',function(e){
                marker.setLngLat(e.lngLat)
                marker2.setLngLat(e.lngLat)
                map2.flyTo({center:e.lngLat});
            })            
           

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
            map2.addControl(searchControl,'top-right')
            // fullscreen
            var fullscreenControl  = new mapboxgl.FullscreenControl()
            map2.addControl(fullscreenControl, 'top-left');
            // Current location
            var currentLocation = new mapboxgl.GeolocateControl({
                positionOptions: {
                enableHighAccuracy: true
                },
                trackUserLocation: true,
            })
            map2.addControl(currentLocation,'top-left');

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

