<template>
  <div>
    <!-- Slider main container -->
    <div class="swiper-container">
      <!-- Additional required wrapper -->
      <div class="swiper-wrapper">
        <!-- Slides -->
        <div v-for="(image, i) in imagelst" :key="i" class="swiper-slide">
          <div class="swiper-slide-container">
            <div class="swiper-slide-image" :style="`background-image: url(${image.url}); `"></div>
          </div>
        </div>
      </div>
      <!-- If we need pagination -->
      <div class="swiper-pagination"></div>
      <!-- If we need navigation buttons -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

    <v-btn ref="initslider" @click="doit">addimg</v-btn>
  </div>
</template>
<style>
@import '@/node_modules/swiper/css/swiper.css';
.swiper-container {
  position: relative;
  overflow: hidden;
  max-height: 400px;
}
.swiper-pagination-bullet {
  background-color: white;
}

.swiper-slide-container {
  width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden;
}
.swiper-slide-image {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
.swiper-button-prev {
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px !important;
  /* background-color: rgba(114, 114, 114, 0.15); */
  margin-top: -20px;
  padding: 10px 20px 10px 20px;
}
.swiper-button-next {
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px !important;
  /* background-color: rgba(114, 114, 114, 0.15); */
  margin-top: -20px;
  padding: 10px 20px 10px 20px;
}
</style>
<script>
import Swiper from 'swiper'
import { mapState, mapMutations } from 'vuex'
var cusSwiper = null

export default {
  data() {
    return {}
  },
  mounted() {
    this.initialiseSwiper()
  },
  watch: {
    imagelst: {
      handler(newVal, oldVal) {
        if (cusSwiper != null) {
          console.log('listchanged')
          this.$nextTick(() => {
            cusSwiper.update()
          })
        }
      }
    }
  },
  computed: {
    ...mapState({
      imagelst: state => state.images.images
    })
  },
  methods: {
    doit() {
      this.addImage({
        url:
          'https://cdn.pixabay.com/photo/2012/03/01/00/55/flowers-19830_1280.jpg'
      })
    },
    ...mapMutations({
      addImage: 'images/addImage'
    }),
    initialiseSwiper() {
      console.log(this.$vuetify.breakpoint.name)
      //xs :1
      //sm: 2
      var smallscreen =
        this.$vuetify.breakpoint.name == 'sm' ||
        this.$vuetify.breakpoint.name == 'xs'

      var spv = smallscreen ? 1 : 2
      // var spv = !smallscreen && imagelst.length > 1 ? 2 : 1

      cusSwiper = new Swiper('.swiper-container', {
        // effect
        effect: smallscreen ? 'fade' : '',
        // grab cursor
        grabCursor: true,
        // zoom into image
        zoom: true,
        // Optional parameters
        direction: 'horizontal',
        // loop: true,

        //auto play
        autoplay: {
          delay: 4000,
          disableOnInteraction: true
        },
        slidesPerView: spv,

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
    }
  }
}
</script>