<template>
  <v-layout row wrap>
    <!-- <v-flex>
      <ogImage />
    </v-flex>-->
    <!-- <v-flex>
      <v-btn @click="addpic">add</v-btn>
    </v-flex>-->
    <!-- titel en edit button -->
    <v-flex xs12>
      <v-layout cols wrap>
        <h1>Dit is de titel van het profiel</h1>
        <v-btn @click="editProfile" fab small color="gray">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <iframe
          :src="
      `https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fapp.stray-watch.com%2Fprofile%2Fview%2F${$route.params.id}&layout=button_count&size=small&appId=1985973471691447&width=84&height=28`
     "
          style="border:none;overflow:hidden;position:relative;right:0px;"
          scrolling="no"
          frameborder="0"
          allowtransparency="true"
          allow="encrypted-media"
          height="20px;"
          width="80px"
        ></iframe>
      </v-layout>
    </v-flex>
    <!-- Slider -->
    <v-flex xs12 md6 pa-2>
      <!-- Slider main container -->
      <div class="swiper-container">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <div v-for="(url, i) in imagelst" :key="i" class="swiper-slide">
            <!-- <div class="swiper-zoom-container"> -->
            <!-- <img :src="url.src" alt /> -->
            <div
              data-v-c28cb864
              class="swiper-slide swiper-slide"
              :style="`background-image: url(${url.src}); `"
            ></div>
            <!-- </div> -->
          </div>
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination"></div>
        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </v-flex>
    <!-- locatie -->
    <v-flex xs12 md6 pa-2>
      <div class="imgcontainer">
        <img class="locationImg" alt="Animal location" :src="mapUrl" />
        <div class="overlay" @click="openMaps">
          <div class="text">open in Google</div>
        </div>
      </div>
    </v-flex>
    <!-- form -->
    <v-flex xs12 md6 pa-2>
      <AnimalProfileForm :editable="false" />
    </v-flex>
    <!-- messages  -->
    <v-flex xs12 md6 pa-2>
      <ProfileMessages />
    </v-flex>
  </v-layout>
</template>
<style scoped>
@import '@/node_modules/swiper/css/swiper.css';
.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.5s ease;
  background-color: #5353535e;
  cursor: pointer;
}
.imgcontainer:hover .overlay {
  opacity: 1;
}
.text {
  color: white;
  font-size: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
}
.imgcontainer {
  position: relative;
  margin-top: auto;
  margin-bottom: auto;
}

.locationImg {
  width: 100%;
}
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
var mySwiper = null
export default {
  data() {
    return {
      profileId: 10,
      thisIsMine: true,
      urls: [],
      mapUrl: ''
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
        this.getMapUrl()
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
      imagelst: state => state.images.images,
      long: state => state.profiles.long,
      lat: state => state.profiles.lat
    })
  },
  components: {
    ProfileMessages,
    MapBox,
    AnimalProfileForm,
    ogImage
  },
  methods: {
    addpic() {
      this.$store.dispatch('images/add', this.imagelst[2])
      mySwiper.update()
    },
    getMapUrl() {
      console.log('mapurl')
      console.log(this.long)
      if (!this.long) return

      console.log(this.long)
      // let marker =
      this.mapUrl =
        `https://api.mapbox.com/styles/v1/mapbox/` +
        `streets-v11/static/` +
        `pin-l-veterinary+482(${this.long},${this.lat})/` +
        `${this.long},${this.lat},9,0,0/900x600?` +
        // `-77.0397,38.8974,7,0,0/300x200?` +
        `access_token=` +
        process.env.MAP_TOKEN
    },
    initialiseSwiper() {
      mySwiper = new Swiper('.swiper-container', {
        // grab cursor
        grabCursor: true,
        // zoom into image
        zoom: true,
        // Optional parameters
        direction: 'horizontal',
        // loop: true,

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
    },
    editProfile() {
      this.$router.push('/profile/edit/' + this.$route.params.id)
    },
    openMaps() {
      console.log(this.lat)
      console.log(this.long)

      window.open(
        `https://maps.google.com/maps?daddr=${this.lat},${this.long}&amp;ll=`
      )
    }
  }
}
</script>
