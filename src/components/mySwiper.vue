<template>
 <v-layout cols wrap>
  <v-flex xs12 style="position:relative;background-color:gray">
   <v-btn class="edit-button" icon @click="edit = !edit"
    ><v-icon color="white">edit</v-icon></v-btn
   >
   <!-- Slider main container -->
   <div class="swiper-container">
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper">
     <!-- Slides -->
     <div v-for="(image, i) in imagelst" :key="i" class="swiper-slide">
      <div class="swiper-slide-container">
       <div
        class="blur-background"
        :style="`background-image: url(${image.url}); `"
       ></div>
       <div
        class="swiper-slide-image"
        :style="`background-image: url(${image.url}); `"
       ></div>
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
  <v-flex xs12 v-if="edit">
   <input
    style="display:none"
    type="file"
    ref="fileInput"
    accept="image/*"
    @change="addPictures"
    multiple
   />
   <v-btn text @click="$refs.fileInput.click()">add</v-btn>
   <v-btn text @click="removeImage()">remove</v-btn>
   <v-btn text @click="editSlide">edit slide</v-btn>
  </v-flex>
  <v-flex>
   <!-- crop-aspect-ratio="0.75" -->
   <!-- doka modal  -->
   <DokaModal
    :src="src"
    v-if="enabled"
    outputQuality="80"
    outputWidth="600"
    outputStripImageHead="false"
    @confirm="handleDokaConfirm"
    @close="enabled = false"
    ref="dokaEditor"
   />
  </v-flex>
 </v-layout>
</template>
<style>
@import '@/node_modules/swiper/css/swiper.css';
.edit-button {
 position: absolute;
 top: 10px;
 right: 10px;
 z-index: 100;
 background-color: rgba(0, 0, 0, 0.733);
}
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
.blur-background {
 filter: blur(10px);
 -webkit-filter: blur(10px);

 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;

 background-size: cover;
 background-position: center;
 overflow: hidden;
}
.swiper-slide-image {
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 z-index: 5;
 background-size: contain;
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
import moment from 'moment'
import { DokaModal, toURL } from '~/vue-doka/'
import { mapState, mapMutations } from 'vuex'
var cusSwiper = null

export default {
 props: { profileID: null },
 head: {
  script: [
   { src: 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js' }
  ]
 },
 data() {
  return {
   counter: 0,
   arraytemp: [],
   src: '',
   enabled: false,
   editingSlide: null,
   edit: false
  }
 },
 mounted() {
  this.initialiseSwiper()
  console.log('get profileid?', this.profileID)
 },
 components: {
  DokaModal
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
  ...mapMutations({
   addImage: 'images/addImage',
   deleteImage: 'images/removeImage',
   updateImageId: 'images/updateImageId'
  }),
  editSlide() {
   this.editingSlide = cusSwiper.activeIndex
   this.src = this.imagelst[this.editingSlide].url
   this.enabled = true
   console.log('here?')
  },
  removeImage() {
   var index = cusSwiper.activeIndex
   console.log('myguid', index, this.imagelst[index].myGuid)
   var prepImage = {
    profileId: this.profileID,
    myGuid: this.imagelst[index].myGuid
   }
   console.log('prepimg', prepImage)
   this.$store.dispatch('images/deleteFs', prepImage)
   this.deleteImage(index)
  },
  addPictures(e) {
   //clear editing slide to prevent deleting smth wrong
   this.editingSlide = null
   //put pictures in a list.
   this.counter = 0
   this.arraytemp = e.target.files
   //Add the coords of these pictures to there long lat fields (subtle dots)
   //last picture sets the coords of this profile
   Array.from(this.arraytemp).forEach(file => {
    this.getImageInfo(file).then(res => {
     if (res != null) {
      file.long = res.long
      file.lat = res.lat
      file.photoCreated = res.photoCreated
     }
    })
   })

   //all pictures run true the doka to be resized
   this.src = this.arraytemp[0]
   this.enabled = true
  },
  toBase64(file) {
   return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
   })
  },
  getImageInfo(file) {
   var self = this
   return new Promise((resolve, reject) => {
    EXIF.getData(file, function() {
     var dateTimeOriginal = EXIF.getTag(this, 'DateTimeOriginal')
     if (this.exifdata.GPSLatitude) {
      var latitude =
       this.exifdata.GPSLatitude[0].numerator /
        this.exifdata.GPSLatitude[0].denominator +
       this.exifdata.GPSLatitude[1].numerator /
        this.exifdata.GPSLatitude[1].denominator /
        60 +
       this.exifdata.GPSLatitude[2].numerator /
        this.exifdata.GPSLatitude[2].denominator /
        3600
      var Longtitude =
       this.exifdata.GPSLongitude[0].numerator /
        this.exifdata.GPSLongitude[0].denominator +
       this.exifdata.GPSLongitude[1].numerator /
        this.exifdata.GPSLongitude[1].denominator /
        60 +
       this.exifdata.GPSLongitude[2].numerator /
        this.exifdata.GPSLongitude[2].denominator /
        3600
      if (this.exifdata.GPSLatitudeRef == 'S') latitude *= -1
      if (this.exifdata.GPSLongitudeRef != 'E') longitude *= -1
     }

     if (latitude != '' && latitude != null) {
      self.$store.commit('profiles/setlongLat', [Longtitude, latitude])
      resolve({
       lat: latitude,
       long: Longtitude,
       photoCreated: dateTimeOriginal
      })
     } else {
      resolve()
     }
    })
   })
  },
  async handleDokaConfirm(output) {
   console.log('doka confirm')
   //delete the slide we changed
   var file = this.arraytemp[this.counter]
   if (this.editingSlide != null) {
    file = this.imagelst[this.editingSlide]
    this.removeImage()
    console.log('editing slide', file)
   }
   console.log(this.editingSlide, file)
   var isodate = moment(file.photoCreated, 'YYYY:MM:DD hh:mm:ss').toISOString()
   var prepImage = {
    url: toURL(output.file),
    long: file.long,
    lat: file.lat,
    photoCreated: isodate,
    profileId: parseInt(this.profileID),
    myGuid: this.generateUUID()
   }
   this.addImage(prepImage)

   //launch next image
   this.counter += 1
   if (this.arraytemp != null && this.counter < this.arraytemp.length) {
    console.log('next', this.counter)
    this.src = this.arraytemp[this.counter]
    this.enabled = true
   }

   this.toBase64(output.file).then(res => {
    prepImage.base64 = res
    this.$store.dispatch('images/uploadImage', prepImage).then(res => {
     console.log('returnval', res)
     // this.updateImageId(res)
    })
   })
  },
  generateUUID() {
   // Public Domain/MIT
   var d = new Date().getTime() //Timestamp
   var d2 = (performance && performance.now && performance.now() * 1000) || 0 //Time in microseconds since page-load or 0 if unsupported
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 //random number between 0 and 16
    if (d > 0) {
     //Use timestamp until depleted
     r = (d + r) % 16 | 0
     d = Math.floor(d / 16)
    } else {
     //Use microseconds since page-load if supported
     r = (d2 + r) % 16 | 0
     d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
   })
  },
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
    slidesPerView: 1,

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
