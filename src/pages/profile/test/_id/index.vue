<template>
  <v-layout rows wrap>
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
    ],
    meta: [
      {
        hid: 'og-title',
        property: 'og:title',
        content: `Stray Hero ${this.sentense}`
      },
      { hid: 'og-image', property: 'og:image', content: `${this.ogmImg}` }
    ]
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
      enabled: false,
      editingSlide: null,
      sentense: 'asd',
      loadingSlider: true,
      editable: true,
      editing: false
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
      })
  },
  computed: {
    ...mapState({
      longLat: state => state.profiles.longLat,
      imagelst: state => state.images.images
    })
  },
  components: {
    ProfileMessages,
    MapBox,
    ProfileForm,
    MySwiper
  },
  methods: {
    ...mapMutations({
      addImageToList: 'images/addImage'
    }),

    async updateProfile() {
      this.$store
        .dispatch('profiles/updateProfile')
        .then(profileId => {
          this.$router.push({ path: '/profile/view/' + this.$route.params.id })
        })
        .catch(error => {
          console.log(error)
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
