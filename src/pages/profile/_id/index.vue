<template>
  <div class="container">
    <AnimalProfileForm></AnimalProfileForm>
    <ImageSlider :hideTopNav="true" class="mt-4 imageSlider" />
    <!-- <MapBox class="mt-4"/> -->
    <v-btn @click="openMaps">Open in google maps</v-btn>
    <iframe
      :src="`https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fapp.stray-watch.com%2Fprofile%2F${$route.params.id}&layout=button_count&size=large&appId=1985973471691447&width=84&height=28`"
      width="84"
      height="28"
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
  </div>
</template>
<style scoped>
.imageSlider {
  /* border-radius: 10px; */
}
</style>

<script>
import AnimalProfileForm from '~/components/AnimalProfileForm.vue'
import ImageSlider from '~/components/ImageSlider.vue'
import MapBox from '~/components/MapBox.vue'
export default {
  async asyncData({ app, params, store }) {
    let data = await store.dispatch('profiles/getProfile', params.id)
    return {
      profile: data,
      sentense:
        data.behavior.trim() +
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
      // profile: {}
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
  computed: {},
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
