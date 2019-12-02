<template>
  <div class="container">
    <ImageSlider :hideTopNav="true" class="imageSlider" />
    <!-- <vue-flux :options="fluxOptions" :images="images" :transitions="fluxTransitions" ref="slider"></vue-flux> -->

    <button @click="$refs.slider.showImage('next')">NEXT</button>

    <v-layout class="text-xs-center" row wrap>
      <v-flex xs12 ma-2 mt-4>
        <h2>Hello friend, they call me Max</h2>
      </v-flex>
      <v-flex xs12 ma-1>
        <h4>And I need your help because</h4>
      </v-flex>
      <v-flex xs6 mt-2>
        <v-icon style="color:white">check_circle_outline</v-icon>Funding
      </v-flex>

      <v-flex xs6 mt-2>
        <v-icon style="color:white">check_circle_outline</v-icon>Medical
      </v-flex>
      <v-flex
        xs12
        mt-2
        mb-4
      >Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima laborum dolor, eius possimus illo quis. Neque saepe cumque placeat illum.</v-flex>
      <v-layout class="infoblok" row wrap mb-4>
        <v-flex xs3 pa-3>
          <p style="font-weight:bold">Age</p>
          <p style="margin-bottom:0px;">Adult</p>
        </v-flex>
        <v-flex xs3 pa-3>
          <p style="font-weight:bold">Age</p>
          <p style="margin-bottom:0px;">Adult</p>
        </v-flex>
        <v-flex xs3 pa-3>
          <p style="font-weight:bold">Age</p>
          <p style="margin-bottom:0px;">Adult</p>
        </v-flex>
        <v-flex xs3 pa-3>
          <p style="font-weight:bold">Age</p>
          <p style="margin-bottom:0px;">Adult</p>
        </v-flex>
      </v-layout>
      <v-flex xs12>
        <v-btn class="mainButton" block depressed>Share profile</v-btn>
      </v-flex>
      <v-flex xs12>
        <v-btn @click="openMaps">Open in google maps</v-btn>
      </v-flex>
      <iframe
        :src="`https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fapp.stray-watch.com%2Fprofile%2F${$route.params.id}&layout=button_count&size=large&appId=1985973471691447&width=84&height=28`"
        style="border:none;overflow:hidden"
        scrolling="no"
        frameborder="0"
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
      <v-text-field
        append-icon="file_copy"
        ref="copyUrl"
        :value="`https://app.straywatch/profiles/${$route.params.id}`"
        @click:append="copyText"
      ></v-text-field>
    </v-layout>
  </div>
</template>
<style scoped>
.container {
  background-color: #297fca;
  color: white;
  min-height: 100vh;
}
.imageSlider {
  /* max-height: 50vh;
  width: 100vw;
  position: relative;
  margin-left: -50vw;
  left: 50%; */
}
.infoblok {
  background-color: white;
  color: #297fca;
}
.mainButton {
  background-color: #3db549 !important;
  color: white;
  border-radius: 10px;
  height: 40px;
}
</style>

<script>
// import { VueFlux, Transitions } from 'vue-flux'
// import 'vue-flux/dist/vue-flux.css'
import AnimalProfileForm from '~/components/AnimalProfileForm.vue'
import ImageSlider from '~/components/ImageSlider.vue'
import MapBox from '~/components/MapBox.vue'
export default {
  async asyncData({ app, params, store }) {
    console.log(params)
    let data = await store.dispatch('profiles/getProfile', params.id)
    return {
      profile: data,
      sentense:
        data.behavior +
        ' ' +
        data.age +
        ' ' +
        data.animal +
        ' needs ' +
        data.needs
    }
  },
  head() {
    return {
      title: this.sentense,
      meta: [
        {
          property: 'og:title',
          content: `${this.sentense}`
        },
        {
          property: 'og:description',
          content: `${this.profile.info}`.replace(/<\/?[^>]+(>|$)/g, '')
        },
        {
          property: 'og:image',
          content: `${!this.profile.url ? '' : this.profile.url[0]}`
        }
      ],
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
    }
  },
  data() {
    return {
      // fluxOptions: {
      //   autoplay: true
      // },
      // fluxTransitions: {
      //   transitionTurn3d: Transitions.transitionTurn3d
      // }
    }
  },
  created() {
    console.log(this.$route.params.id)
  },
  mounted() {
    this.$store.dispatch('profiles/getProfile', this.$route.params.id)
  },
  components: {
    AnimalProfileForm,
    ImageSlider
  },
  computed: {
    images() {
      return this.$store.getters['images/images']
    }
  },
  methods: {
    copyText() {
      // this.$refs.copyUrl.select()
      // document.execCommand('copy')
    },
    openMaps() {
      // return
      var latitude = 10
      var longitude = 10
      var ll = JSON.parse(this.profile.longLat)
      console.log(ll)

      if (ll) {
        latitude = ll[1]
        longitude = ll[0]
      }
      window.open(
        `https://maps.google.com/maps?daddr=${latitude},${longitude}&amp;ll=`
      )
      // var uri = String.format(Locale.ENGLISH, 'geo:%f,%f', latitude, longitude)
      // var intent = new Intent(Intent.ACTION_VIEW, Uri.parse(uri))
      // context.startActivity(intent)
    }
  },
  created() {
    if (process.browser) {
    }
  }
}
</script>
