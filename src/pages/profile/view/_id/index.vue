<template>
 <v-layout row wrap>
  <!-- <v-flex>
      <ogImage />
    </v-flex>-->

  <v-flex xs12>
   <v-btn v-if="thisIsMine" @click="editProfile">edit</v-btn>
  </v-flex>
  <v-flex xs12 lg6 pa-4>
   <!-- Slider main container -->
   <div class="swiper-container">
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper">
     <!-- Slides -->
     <div v-for="(url, i) in imagelst" :key="i" class="swiper-slide">
      <div class="swiper-zoom-container">
       <img :src="url.src" alt="" />
      </div>
     </div>
    </div>

    <!-- If we need pagination -->
    <div class="swiper-pagination"></div>

    <!-- If we need navigation buttons -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
   </div>
  </v-flex>
   <MapBox class="mt-4" />
  </v-flex>
  <v-flex xs12 pa-4>
   <AnimalProfileForm :editable="true" />
  </v-flex>
  <ProfileMessages />
 </v-layout>
</template>
<style scoped>
@import '@/node_modules/swiper/css/swiper.css';
.swiper-container {
 width: 100%;
 height: 40vh;
}
.swiper-button-prev {
 color: rgba(255, 255, 255, 0.7);
 font-size: 25px;
 background-color: rgba(114, 114, 114, 0.15);
 border-radius: 50px;
 margin-top: -20px;
 padding: 10px 20px 10px 20px;
}
.swiper-button-next {
 color: rgba(255, 255, 255, 0.7);
 font-size: 25px;
 background-color: rgba(114, 114, 114, 0.15);
 border-radius: 50px;
 margin-top: -20px;
 padding: 10px 20px 10px 20px;
}

.grow {
 transition: all 0.2s ease-in-out;
}
</style>
<script>
import Swiper from 'swiper'
import { mapState } from 'vuex'
import ProfileMessages from '~/components/ProfileMessages.vue'
import MapBox from '~/components/MapBox.vue'
import AnimalProfileForm from '~/components/AnimalProfileForm.vue'
import ogImage from '~/components/ogImage.vue'
export default {
 data() {
  return {
   profileId: 10,
   thisIsMine: true,
   urls: []
  }
 },
 mounted() {
  this.$store
   .dispatch('profiles/getProfile', this.$route.params.id)
   .then(res => {
    var data = res
    console.log(data)
    this.urls = data.url
    this.initialiseSwiper()
    mySwiper.init()
   })
 },
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
 computed: {
  ...mapState({
   images: state => state.images.imagesWithLoc,
   longLat: state => state.profiles.longLat,
   imagelst: state => state.images.images
  })
 },
 components: {
  ProfileMessages,
  MapBox,
  AnimalProfileForm,
  ogImage
 },
 methods: {
  initialiseSwiper() {
   var mySwiper = new Swiper('.swiper-container', {
    // grab cursor
    grabCursor: true,
    // zoom into image
    zoom: true,
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    //auto play
    autoplay: {
     delay: 2500,
     disableOnInteraction: true
    },

    // If we need pagination
    pagination: {
     el: '.swiper-pagination',
     type: 'bullets'
    },

    // Navigation arrows
    navigation: {
     nextEl: '.swiper-button-next',
     prevEl: '.swiper-button-prev'
    }
   })
   mySwiper.pagination.render()
   mySwiper.pagination.update()
  },

 }
}
</script>
