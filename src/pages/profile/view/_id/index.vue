<template>
  <v-layout rows wrap>
    <v-flex v-if="loadingSlider" xs12 pa-2 pb-0 style="position:relative">
      <v-skeleton-loader class="skeletonoverlay" tile type="image,image,image,image"></v-skeleton-loader>
    </v-flex>
    <v-flex xs12 pa-2 pb-0>
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
    </v-flex>

    <!-- animal info -->
    <v-flex class="metaInfoCard" mt-0 xs12 pa-2 ma-2>
      <v-layout cols wrap style="position:relative">
        <v-flex xs12>
          <p style="font-size:16px">{{ sentense }}</p>
          <a :href="openMaps" style="font-size:13px;color:black">{{placename}}</a>
        </v-flex>
        <div class="actionsMenu">
          <v-btn @click="editProfile" text icon>
            <v-icon color="gray">edit</v-icon>
          </v-btn>
          <v-btn v-if="mobileShare" text icon @click="nativeShare">
            <v-icon color="#3b5999">share</v-icon>
          </v-btn>
          <v-menu v-if="!mobileShare" offset-y>
            <template v-slot:activator="{ on }">
              <v-btn text icon v-on="on">
                <v-icon color="#3b5999">share</v-icon>
              </v-btn>
            </template>

            <v-flex style="background-color:white" pa-4>
              <iframe
                :src="facebookUrl1+ $route.params.id+facebookUrl2"
                style="border:none;overflow:hidden;position:relative;right:0px;"
                scrolling="no"
                frameborder="0"
                allowtransparency="true"
                allow="encrypted-media"
                height="20px;"
                width="80px"
              ></iframe>
            </v-flex>
          </v-menu>
          <client-only>
            <v-btn v-if="$auth.loggedIn" @click="follow" text icon>
              <v-icon v-if="!profile.follow" color="gray">favorite_border</v-icon>
              <v-icon v-else color="pink">favorite</v-icon>
            </v-btn>
          </client-only>
        </div>
      </v-layout>
    </v-flex>

    <!-- form -->
    <v-flex xs12 md6 pa-2>
      <ProfileForm :editable="false" />
      <!-- map -->
      <div class="imgcontainer">
        <img class="locationImg" alt="Animal location" :src="mapUrl" />
        <div class="overlay" @click="openMaps">
          <div class="text">open in Google</div>
        </div>
      </div>
    </v-flex>
    <!-- divider -->

    <!-- messages  -->
    <v-flex xs12 md6 pa-2>
      <ProfileMessages :dispose="disposeComponent" />
    </v-flex>
  </v-layout>
</template>
<style scoped>
.skeletonoverlay {
  width: 100%;
  height: 50vh;
  z-index: 10;
}
</style>
<style lang="scss">
@import '@/node_modules/swiper/css/swiper.css';

.metaInfoCard {
  /* border: solid rgb(160, 160, 160); */
  border: solid rgb(0, 0, 0, 0.12);
  border-width: 0px 1px 1px 1px;
  background-color: whitesmoke;
}
.actionsMenu {
  position: absolute;
  top: 0;
  right: 0;
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
.swiper-slide-image {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
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
.grow {
  transition: all 0.2s ease-in-out;
}
</style>
<script>
import Swiper from 'swiper'
import { mapState, mapMutations } from 'vuex'
import ProfileMessages from '~/components/ProfileMessages.vue'
import ProfileForm from '~/components/ProfileForm.vue'

var mySwiper = null
export default {
  beforeRouteLeave(to, from, next) {
    //call a method inside the profilemessage component
    this.disposeComponent = true
    next()
  },
  asyncData({ params, store }) {
    return store.dispatch('profiles/getMetaInfo', params.id).then(res => {
      return res
    })
  },
  data() {
    return {
      profileId: 10,
      thisIsMine: true,
      mapUrl: '',
      disposeComponent: false,
      placename: '',
      loadingSlider: true,
      facebookUrl1: `https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fapp.strayhero.com%2Fprofile%2Fview%2F`,
      facebookUrl2: `&layout=button_count&size=small&appId=1985973471691447&width=84&height=28`
    }
  },
  mounted() {
    this.$store
      .dispatch('profiles/getProfile', this.$route.params.id)
      .then(res => {
        var data = res
        this.initialiseSwiper()
        this.getMapUrl()
        this.getLocation()
      })
  },
  head() {
    return {
      meta: [
        {
          hid: 'og-title',
          property: 'og:title',
          content: `Stray Hero ${this.sentense}`
        },
        { hid: 'og-image', property: 'og:image', content: `${this.ogmImg}` }
      ]
    }
  },
  computed: {
    ...mapState({
      imagelst: state => state.images.images,
      long: state => state.profiles.profile.long,
      lat: state => state.profiles.profile.lat,
      profile: state => state.profiles.profile
    }),
    mobileShare() {
      return process.client && navigator.share
    }
  },
  components: {
    ProfileMessages,
    ProfileForm
  },
  methods: {
    ...mapMutations({
      setFollow: 'profiles/setFollow'
    }),
    nativeShare(event) {
      if (navigator.share) {
        event.stopPropagation()
        // Web Share API is supported
        navigator
          .share({
            title: 'WebShare API Demo',
            url: 'https://app.strayhero.com' + this.$route.fullPath
          })
          .then(() => {
            console.log('Thanks for sharing!')
          })
          .catch(console.error)
      } else {
        // Fallback
      }
    },
    getLocation() {
      if (!this.long) return
      var url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/
      ${this.long},${this.lat}
      .json?access_token=` + process.env.MAP_TOKEN

      return new Promise((resolve, reject) => {
        this.$axios
          .get(url)
          .then(ress => {
            this.placename = ress.data.features[0].place_name
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    getMapUrl() {
      if (!this.long) return

      this.mapUrl =
        `https://api.mapbox.com/styles/v1/mapbox/` +
        `streets-v11/static/` +
        `pin-l-veterinary+482(${this.long},${this.lat})/` +
        `${this.long},${this.lat},9,0,0/900x675?` +
        `access_token=` +
        process.env.MAP_TOKEN
    },
    initialiseSwiper() {
      this.loadingSlider = true
      console.log(this.$vuetify.breakpoint.name)
      //xs :1
      //sm: 2
      var smallscreen =
        this.$vuetify.breakpoint.name == 'sm' ||
        this.$vuetify.breakpoint.name == 'xs'

      var spv = smallscreen ? 1 : 2
      // var spv = !smallscreen && imagelst.length > 1 ? 2 : 1

      mySwiper = new Swiper('.swiper-container', {
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

      this.loadingSlider = false
    },
    editProfile() {
      //If loged in
      if (!this.$auth.loggedIn) {
        this.$store.dispatch(
          'utils/showMessage',
          'You have to log in to edit profiles'
        )
        return
      }
      //only if the user owns this profile, he/she can alter it
      if (this.$auth.user.userID != this.$store.state.profiles.profile.userID) {
        this.$store.dispatch(
          'utils/showMessage',
          'For now, you can only edit profiles you created'
        )
        return
      }
      this.$router.push('/profile/edit/' + this.$route.params.id)
    },
    follow() {
      return
      this.$store
        .dispatch('user/follow', {
          profileID: parseInt(this.$route.params.id),
          userID: this.$auth.user.userID,
          follow: this.follow
        })
        .then(res => {
          setFollow(!this.follow)
        })
    },
    openMaps() {
      window.open(
        `https://maps.google.com/maps?daddr=${this.lat},${this.long}&amp;ll=`
      )
    }
  }
}
</script>
