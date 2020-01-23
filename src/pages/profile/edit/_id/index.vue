<template>
  <v-layout rows wrap>
    <!-- swiper -->
    <v-flex v-if="loadingSlider" xs12 pa-2 style="position:relative">
      <v-skeleton-loader class="skeletonoverlay" tile type="image,image,image,image"></v-skeleton-loader>
    </v-flex>
    <v-flex xs12 pa-2>
      <v-flex xs12>
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
        <!-- buttons -->
        <div class="buttonnav">
          <v-btn text @click="$refs.fileInput.click()">add</v-btn>
          <v-btn text @click="editSlide">edit</v-btn>
          <v-btn text @click="removeSlide()">remove</v-btn>
          <v-btn text @click="setMain">set main</v-btn>
        </div>
      </v-flex>
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
    <v-flex xs12 md6 pa-2>
      <!-- <MapBox /> -->
    </v-flex>
    <!-- animal profile form -->
    <v-flex xs12 pa-2>
      <AnimalProfileForm :editable="true" />
    </v-flex>
    <!-- bottom buttons -->
    <v-flex xs12 pl-2>
      <v-btn style="margin:0px" @click="updateProfile">Save</v-btn>
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
<style scoped>
.swiper-container {
  width: 100%;
  position: relative;
  overflow: hidden;
}
.skeletonoverlay {
  width: 100%;
  z-index: 10;
}
</style>
<style scoped>
.buttonnav {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<script>
import { DokaModal, toURL } from '~/vue-doka/'
import { mapState } from 'vuex'
import ProfileMessages from '~/components/ProfileMessages.vue'
// import ImageSlider from '~/components/ImageSlider.vue'
import MapBox from '~/components/MapBox.vue'
import AnimalProfileForm from '~/components/AnimalProfileForm.vue'
import Swiper from 'swiper'
var mySwiper = null
export default {
  head: {
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js' }
    ],
    link: [
      {
        href: 'https://api.mapbox.com/mapbox-gl-js/v1.6.0/mapbox-gl.css',
        rel: 'stylesheet'
      }
    ]
  },
  data() {
    return {
      profileId: null,
      imagelst: [],
      counter: 0,
      arraytemp: [],
      src: '',
      enabled: false,
      editingSlide: null,
      sentense: 'asd',
      loadingSlider: true
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
        this.loadingSlider = false
      })
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
                style="background-position: center;background-image: url(&quot;` +
          src +
          `&quot;); "></div>
            </div>
          </div>`
      ])
      this.imagelst.push(src)
    },
    removeSlide(number) {
      if (number == null) number = mySwiper.activeIndex
      console.log(this.imagelst)
      console.log(number)
      var obj = {
        AnimalProfileID: parseInt(this.$route.params.id),
        imgString: this.imagelst[number]
      }
      console.log(obj)
      this.$store.dispatch('images/deleteFs', obj).then(res => {
        //remove from they array
        this.imagelst.splice(this.imagelst[number], 1)
        mySwiper.removeSlide(number)
        console.log(this.imagelst)
      })

      // mySwiper.removeSlide(mySwiper.activeIndex)
    },
    setMain() {
      var obj = {
        AnimalProfileID: parseInt(this.$route.params.id),
        imgString: this.imagelst[mySwiper.activeIndex]
      }
      this.$store.dispatch('images/setMain', obj)
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
      var smallscreen =
        this.$vuetify.breakpoint.name == 'sm' ||
        this.$vuetify.breakpoint.name == 'xs'

      var spv = smallscreen ? 1 : 2

      mySwiper = new Swiper('.swiper-container', {
        // effect
        effect: smallscreen ? 'fade' : '',
        // grab cursor
        grabCursor: true,
        // Optional parameters
        direction: 'horizontal',

        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets'
        },
        slidesPerView: spv,

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

        chip: this.$store.getters['profiles/chip'],
        color: this.$store.getters['profiles/color'],
        captureStatus: this.$store.getters['profiles/captureStatus'],
        eartip: this.$store.getters['profiles/eartip'],
        vaccinated: this.$store.getters['profiles/vaccinated'],
        sterile: this.$store.getters['profiles/sterile'],
        healthCheck: this.$store.getters['profiles/healthCheck'],

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
.swiper-pagination-bullet {
  background-color: white;
}
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
