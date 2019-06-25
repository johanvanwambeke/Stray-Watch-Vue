<template>
  <div>
    <ImageSlider class="mt-4"/>
    <!-- <MapBox class="mt-4"/> -->
    <AnimalProfileForm></AnimalProfileForm>
    <v-btn @click="loadProfile"></v-btn>
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
  </div>
</template>

<script>
import AnimalProfileForm from '~/components/AnimalProfileForm.vue'
import ImageSlider from '~/components/ImageSlider.vue'
import MapBox from '~/components/MapBox.vue'
export default {
  async asyncData({ app, params, store }) {
    // console.log(params.id)
    // store.dispatch('profiles/getProfile', params.id)
  },
  head() {
    return {
      title: this.sentense,
      meta: [
        {
          property: 'og:title'
          // 'content':  `${this.sentense}`,
        },
        {
          property: 'og:description'
          // 'content': `${this.profile.info}`.replace(/<\/?[^>]+(>|$)/g, ""),
        },
        {
          property: 'og:image'
          // 'content': `${!this.profile.url?'':this.profile.url[0]}`
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
      animalTypes: ['cat', 'dog'],
      purposes: [
        'fosterhome',
        'funding',
        'adoption',
        'new owner',
        'Medical assistance',
        'feeding'
      ],
      urgencies: [
        'immediatly ',
        'in 1 day',
        'in 2 days',
        'in 1 week',
        'in 1 month '
      ],
      healthStatuses: ['healthy ', 'in treatment', 'untreated']
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
    loadProfile() {}
  },
  created() {
    if (process.browser) {
    }
  }
}
</script>
