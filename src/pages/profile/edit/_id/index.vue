<template>
  <v-layout row wrap>
    <!-- swiper -->
    <v-flex xs12 md6 pa-4>
      <!-- <ImageSlider class="imageSlider" /> -->
      <v-flex xs12 pa-2>
        <!-- Slider main container -->
        <div ref="swipy" class="swiper-container">
          <!-- Additional required wrapper -->
          <div class="swiper-wrapper">
            <!-- Slides -->
          </div>
          <!-- If we need pagination -->
          <div class="swiper-pagination"></div>
          <!-- If we need navigation buttons -->
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </v-flex>
      <div>
        <v-btn @click="$refs.fileInput.click()">add</v-btn>
        <v-btn @click="editSlide">edit</v-btn>
        <v-btn @click="removeSlide">remove</v-btn>
      </div>
      <input
        style="display:none"
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="addPictures"
        multiple
      />
    </v-flex>
    <!-- location map -->
    <v-flex xs12 md6 pa-4>
      <h1>Location</h1>
      <!-- <div
        v-for="i in images.filter(x=>x.longlat != null)"
        :style="{'background-image': 'url(' + (i.src) + ')'}"
        class="locationImages grow"
        @click="setLocation(i.longlat)"
      ></div>
      <p>{{longLat}}</p>-->
      <MapBox class="mt-4" />
    </v-flex>
    <!-- animal profile form -->
    <v-flex xs12 pa-4>
      <AnimalProfileForm :editable="true" />
    </v-flex>
    <!-- bottom buttons -->
    <v-flex xs12>
      <v-btn @click="updateProfile">Save</v-btn>
    </v-flex>
    <!-- doka modal -->
    <DokaModal
      crop-aspect-ratio="0.75"
      :src="src"
      v-if="enabled"
      outputQuality="80"
      outputWidth="600"
      outputStripImageHead="false"
      @confirm="handleDokaConfirm"
      @close="enabled = false"
      ref="dokaEditor"
    />
  </v-layout>
</template>

<script>
import { DokaModal, toURL } from '~/vue-doka/'
import { mapState } from 'vuex'
// import FileUploader from '~/components/FileUploader.vue'
import ProfileMessages from '~/components/ProfileMessages.vue'
// import ImageSlider from '~/components/ImageSlider.vue'
import MapBox from '~/components/MapBox.vue'
import AnimalProfileForm from '~/components/AnimalProfileForm.vue'
import Swiper from 'swiper'
var mySwiper = null
export default {
  data() {
    return {
      profileId: null,
      imagelst: [],
      counter: 0,
      arraytemp: [],
      src: '',
      enabled: false,
      editingSlide: null
    }
  },
  mounted() {
    this.initialiseSwiper()
    this.$store.dispatch('images/clear')
    this.$store.dispatch('profiles/clear')
    this.$store
      .dispatch('profiles/getProfile', this.$route.params.id)
      .then(res => {
        var data = res
        console.log(data)
        data.url.forEach(element => {
          this.addSlide(element)
        })
      })
  },
  head: {
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js' }
    ],
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
      longLat: state => state.profiles.longLat
    })
  },
  components: {
    ProfileMessages,
    MapBox,
    AnimalProfileForm,
    DokaModal
  },
  methods: {
    editSlide() {
      console.log(this.imagelst[mySwiper.activeIndex])
      this.src = this.imagelst[mySwiper.activeIndex]
      this.enabled = true
      this.editingSlide = mySwiper.activeIndex
      //this needs to also remove the edited slide
      //pref. add this one in the spot where it was removed :/
    },
    addSlide(src) {
      mySwiper.appendSlide([
        `   <div class="swiper-slide" data-v-c28cb864="" >
            <div class="swiper-slide-container">
              <div
                class="swiper-slide-image"
                style="background-image: url(&quot;` +
          src +
          `&quot;); "></div>
            </div>
          </div>`
      ])
      this.imagelst.push(src)
    },
    removeSlide() {
      console.log(this.imagelst)
      if (this.editingSlide != null) {
        this.$store.dispatch('images/delete', {
          animalprofileid: this.$route.params.id,
          uri: imagelst[this.editingSlide]
        })
        //remove from they array
        imagelst.pop(imagelst[this.editingSlide])
        mySwiper.removeSlide(this.editingSlide)
        console.log(this.imagelst)
      }

      // mySwiper.removeSlide(mySwiper.activeIndex)
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    async handleDokaConfirm(output) {
      //delete the slide we changed
      if (this.editingSlide != null) {
        mySwiper.removeSlide(this.editingSlide)
        console.log(this.imagelst)
        // this.$store.dispatch('images/delete',{animalprofileid: this.$route.params.id, imageid:})
      }

      this.toBase64(output.file).then(res => {
        //they keep there coordinates info
        var currentUrl = toURL(output.file)
        console.log(currentUrl)
        this.addSlide(currentUrl)
        //they are saved and url-replaced
        this.$store
          .dispatch('images/uploadImage', {
            src: res,
            image: output.file,
            AnimalProfileID: this.$route.params.id
          })
          .then(res => {
            //replace
            var index = this.imagelst.indexOf(currentUrl)

            if (index !== -1) {
              this.imagelst[index] = res.uri
            }

            console.log(res.uri)
          })

        //launch next image
        this.counter += 1
        if (this.arraytemp != null && this.counter < this.arraytemp.length) {
          console.log('next', this.counter)
          this.src = this.arraytemp[this.counter]
          this.enabled = true
        }
      })
    },

    initialiseSwiper() {
      mySwiper = new Swiper('.swiper-container', {
        // grab cursor
        grabCursor: true,
        // Optional parameters
        direction: 'horizontal',

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
    setLocation(payload) {
      console.log(payload)
      if (payload && payload.longitude)
        this.$store.commit('profiles/setlongLat', [
          payload.longitude,
          payload.latitude
        ])
    },
    async updateProfile() {
      //I will wrap the form data in 1 object and send it to the backend to save
      //It returns the ID of the profile
      //I navigate to the profile ID
      var mylonlat = this.$store.getters['profiles/longLat']
      var imagesb64arr = this.$store.state.images.images.map(
        a => a.imgForUpload
      )

      var profile = {
        animal: this.$store.getters['profiles/animal'],
        age: this.$store.getters['profiles/age'],
        needs: this.$store.getters['profiles/needs'],
        medical: this.$store.getters['profiles/medical'],
        urgency: this.$store.getters['profiles/urgency'],
        behavior: this.$store.getters['profiles/behavior'],
        info: this.$store.getters['profiles/info'],
        animalProfileId: this.$store.getters['profiles/profileId'],
        longLat: '[' + mylonlat[0] + ', ' + mylonlat[1] + ']',
        images64: imagesb64arr
      }

      console.log(profile)

      this.$store
        .dispatch('profiles/updateProfile', profile)
        .then(profileId => {
          console.log(profileId)
          this.$router.push({ path: '/profile/view/' + this.$route.params.id })
        })
        .catch(error => {
          console.log(error)
        })
    },
    addPictures(e) {
      //clear editing slide to prevent deleting smth wrong
      this.editingSlide = null
      //put pictures in a list.
      this.counter = 0
      this.arraytemp = e.target.files
      //Add the coords of these pictures to the map (subtle dots)
      //last picture sets the coords of this profile
      Array.from(this.arraytemp).forEach(file => {
        this.getImageInfo(file).then(res => {
          console.log(res)
        })
      })

      //all pictures run true the doka to be resized
      this.src = this.arraytemp[0]
      this.enabled = true
    },
    getImageInfo(file) {
      var self = this
      return new Promise((resolve, reject) => {
        EXIF.getData(file, function() {
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
            resolve({ latitude: latitude, longitude: Longtitude })
          } else {
            resolve()
          }
        })
      })
    }
  }
}
</script>
<style>
.locationImages {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-color: black;
  width: 50px;
  height: 50px;
  cursor: pointer;
  border-radius: 50%;
}
.grow {
  transition: all 0.2s ease-in-out;
}
</style>
<style>
@import '@/node_modules/swiper/css/swiper.css';
.swiper-slide-container {
  width: 100%;
  padding-bottom: 75%;
  position: relative;
  height: 0;
}
.swiper-slide-image {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: cover;
}
.swiper-container {
  width: 100%;
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
  background-size: contain;
}
</style>
