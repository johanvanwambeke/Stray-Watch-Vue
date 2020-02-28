<template>
  <v-layout rows wrap>
    <!-- animal info -->
    <v-flex xs12 pa-2>
      <v-card outlined style="overflow:hidden">
        <v-layout ma-2 cols wrap style="position:relative">
          <v-flex xs6>
            <p style="font-size:16px">#{{$route.params.id}}</p>
            <a
              @click="openMaps"
              style="font-size:13px;color:black;text-decoration:underline"
            >{{ placename }}</a>
            <!-- created by -->
            <p style="font-size:9px;margin:0px">created by {{ profile.createdBy }}</p>
            <!-- created on -->
            <p style="font-size:9px;margin:0px">{{ createdFormat }}</p>
          </v-flex>

          <v-spacer></v-spacer>
          <client-only>
            <div class="actionsMenu">
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
                    :src="facebookUrl1 + $route.params.id + facebookUrl2"
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
              <v-btn v-if="$auth.loggedIn" @click="follow" text icon>
                <v-icon v-if="!profile.follow" color="gray">favorite_border</v-icon>
                <v-icon v-else color="pink">favorite</v-icon>
              </v-btn>
            </div>
          </client-only>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- images -->
    <v-flex xs12 pa-2>
      <v-card outlined style="overflow:hidden">
        <MySwiper :profileID="$route.params.id" :edit="editable"></MySwiper>
      </v-card>
    </v-flex>
    <!-- form -->
    <v-flex xs12 pa-2>
      <v-card outlined>
        <ProfileForm :editable="editable" :editing="editing" />
      </v-card>
    </v-flex>
    <!-- location map -->
    <v-flex xs12 pa-2>
      <v-card outlined style="overflow:hidden">
        <client-only>
          <MapBox />
        </client-only>
      </v-card>
    </v-flex>
    <!-- messages  -->
    <v-flex xs12 pa-2>
      <v-card outlined>
        <client-only>
          <ProfileMessages :dispose="disposeComponent" />
        </client-only>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<style scoped>
.addImage {
  cursor: pointer;
  background-color: greenyellow;
  width: 100%;
  min-height: 400px;
  max-height: 400px;
  overflow: hidden;
}

.skeletontop {
  cursor: pointer;
  width: 100%;
  min-height: 400px;
  max-height: 400px;
  overflow: hidden;
}
.buttonsCard {
  /* border: solid rgb(160, 160, 160); */
  border: solid rgb(0, 0, 0, 0.12);
  border-width: 0px 1px 1px 1px;
  background-color: whitesmoke;
  margin-top: -16px;
}
.skeletonoverlay {
  width: 100%;
  z-index: 10;
}
.buttonnav {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<script>
import { mapState, mapMutations } from 'vuex'
import ProfileMessages from '~/components/ProfileMessages.vue'
import ProfileForm from '~/components/ProfileForm.vue'
import MySwiper from '~/components/mySwiper.vue'
import MapBox from '~/components/MapBox.vue'
import moment from 'moment'

export default {
  head() {
    return {
      meta: [
        {
          hid: 'og-title',
          property: 'og:title',
          content: `Stray Hero ${this.sentense}`
        },
        { hid: 'og-image', property: 'og:image', content: `${this.ogmImg}` }
      ],
      script: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js' }
      ],
      link: [
        {
          rel: 'preload',
          as: 'style',
          href: 'https://api.mapbox.com/mapbox-gl-js/v1.6.0/mapbox-gl.css'
        }
      ]
    }
  },
  async asyncData({ params, store }) {
    return store.dispatch('profiles/getMetaInfo', params.id).then(res => {
      return res
    })
  },
  data() {
    return {
      profileId: null,
      counter: 0,
      arraytemp: [],
      src: '',
      disposeComponent: false,
      enabled: false,
      editingSlide: null,
      sentense: 'asd',
      loadingSlider: true,
      editable: true,
      editing: false,
      placename: '',
      facebookUrl1: `https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fapp.strayhero.com%2Fprofile%2Fview%2F`,
      facebookUrl2: `&layout=button_count&size=small&appId=1985973471691447&width=84&height=28`
    }
  },
  mounted() {
    this.$store
      .dispatch('profiles/getProfile', this.$route.params.id)
      .then(res => {
        //We willen slechts 1 'get profile'
        //Deze moet hier worden opgeroepen en zo alles in de store goed zetten
        this.imagelst.forEach(element => {})
        this.loadingSlider = false
        this.getLocation()
      })
  },
  computed: {
    ...mapState({
      imagelst: state => state.images.images,
      profile: state => state.profiles.profile
    }),
    mobileShare() {
      return process.client && navigator.share
    },
    createdFormat() {
      return moment(this.profile.created).format('LLLL')
    }
  },
  components: {
    ProfileMessages,
    MapBox,
    ProfileForm,
    MySwiper
  },
  methods: {
    ...mapMutations({
      addImageToList: 'images/addImage',
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
    async updateProfile() {
      this.$store
        .dispatch('profiles/updateProfile')
        .then(profileId => {
          this.$router.push({ path: '/profile/view/' + this.$route.params.id })
          getLocation()
        })
        .catch(error => {
          console.log(error)
        })
    },
    follow() {
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
    getLocation() {
      if (!this.profile.long) return
      var url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/
      ${this.profile.long},${this.profile.lat}
      .json?access_token=` + process.env.MAP_TOKEN

      console.log('getlcation', url)
      this.$axios
        .get(url)
        .then(ress => {
          this.placename = ress.data.features[0].place_name
          console.log('placename', ress)
        })
        .catch(error => {
          console.log(error)
        })
    },
    openMaps() {
      window.open(
        `https://maps.google.com/` //maps?daddr=${this.profile.lat},${this.profile.long}&amp;ll=`
      )
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
  max-height: 400px;
  position: relative;
  overflow: hidden;
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
