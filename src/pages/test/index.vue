<template>
  <v-layout rows wrap>
    <v-flex></v-flex>
    <v-flex>
      <v-btn
        @click="addslide('https://images.unsplash.com/photo-1576306686882-c3cb97a70366?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80')"
      >AddSlide</v-btn>
    </v-flex>
    <v-flex xs12 pa-2>
      <!-- Slider main container -->
      <div ref="swipy" class="swiper-container">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <!-- <div
            v-for="(url, i) in imagelst"
            v-if="imagelst.length>0"
            :key="i"
            class="swiper-slide"
            :style="'background-image:url('+url+')'"
          ></div>-->
          <!-- <div
            class="swiper-slide"
            style="background-image:url(https://images.unsplash.com/photo-1558981420-87aa9dad1c89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80)"
          ></div>-->
        </div>
        <!-- If we need pagination -->
        <div class="swiper-pagination">
          <v-btn fab>edit</v-btn>
        </div>
        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
      <v-btn fab class="sliderbutton" @click="editSlide">edit</v-btn>
    </v-flex>
    <v-flex xs12>
      <input type="file" ref="fileInput" accept="image/*" @change="addImage" multiple />
    </v-flex>
    <div id="demo-modal">
      <h2>Doka Modal</h2>

      <button @click="enabled = true">Show Modal</button>

      <DokaModal
        crop-aspect-ratio="0.75"
        :src="src"
        v-if="enabled"
        outputQuality="100"
        outputWidth="800"
        outputStripImageHead="false"
        @confirm="handleDokaConfirm"
        @cancel="handleDokaCancel"
        @close="enabled = false"
        ref="dokaEditor"
      />

      <img v-if="result" :src="result" alt />
    </div>
  </v-layout>
</template>
<style>
.sliderbutton {
  float: left;
  background-color: transparent;
  z-index: 100;
  margin-top: -50px;
  margin-right: auto;
  margin-left: auto;
}
</style>
<script>
import { DokaModal, toURL } from '~/vue-doka/'
import Swiper from 'swiper'
var mySwiper = null
export default {
  name: 'demo-modal',
  components: { DokaModal },
  computed: {},
  mounted() {
    this.initialiseSwiper()
    this.$store.dispatch('profiles/getProfile', 195).then(res => {
      var data = res
      this.imagelst = data.url
      console.log(data.url)
      data.url.forEach(element => {
        this.addslide(element)
        // this.imagelst.push({ src: element })
      })
    })
  },
  data() {
    return {
      enabled: false,
      src: '',
      result: null,
      counter: 0,
      arraytemp: [],
      imagelst: []
    }
  },
  methods: {
    editSlide() {
      console.log(this.imagelst[mySwiper.activeIndex])
      this.src =
        'https://cors-anywhere.herokuapp.com/' +
        this.imagelst[mySwiper.activeIndex]
      this.enabled = true
    },
    addslide(src) {
      mySwiper.appendSlide([
        `<div data-v-c28cb864="" class="swiper-slide swiper-slide" style="background-image: url(&quot;` +
          src +
          `&quot;); width: 307px;"></div>`
      ])
    },
    initialiseSwiper() {
      mySwiper = new Swiper('.swiper-container', {
        // grab cursor
        grabCursor: true,
        // zoom into image
        // zoom: true,
        // Optional parameters
        direction: 'horizontal',

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
    handleDokaConfirm(output) {
      console.log('Confirm crop!', output)
      this.addToSlider(output)
      // saveImage(output.file)

      //launch next image
      this.counter += 1
      if (this.counter < this.arraytemp.length) {
        console.log('next', this.counter)
        this.src = this.arraytemp[this.counter]
        this.enabled = true
      }
    },
    addToSlider(output) {
      this.addslide(toURL(output.file))
    },
    handleDokaCancel() {
      console.log('Cancel crop!')
    },
    async addImage(e) {
      this.counter = 0
      this.arraytemp = e.target.files
      console.log(this.arraytemp.length)
      this.src = this.arraytemp[0]
      this.enabled = true
    }
  }
}
</script>
<style scoped>
@import '@/node_modules/swiper/css/swiper.css';
.swiper-container {
  width: 100%;
  height: 30vh;
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
.swiper-slide {
  background-position: center;
  background-size: cover;
}
</style>
