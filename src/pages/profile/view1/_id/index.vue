<template>
  <v-layout rows wrap>
    <!-- animal info -->
    <v-flex class="metaInfoCard" mt-0 xs12 pa-2 ma-2>
      <v-layout cols wrap style="position:relative">
        <v-flex xs12>
          <p style="font-size:16px">{{profile.sentence}}</p>
          <a :href="openMaps" style="font-size:13px;color:black">{{ placename }}</a>
        </v-flex>
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
          <client-only>
            <v-btn v-if="$auth.loggedIn" @click="follow" text icon>
              <v-icon v-if="!profile.follow" color="gray">favorite_border</v-icon>
              <v-icon v-else color="pink">favorite</v-icon>
            </v-btn>
          </client-only>
        </div>
      </v-layout>
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
<style lang="scss">
.metaInfoCard {
  height: 40px;
}
.actionsMenu {
  position: absolute;
  top: 0;
  right: 0;
}
.grow {
  transition: all 0.2s ease-in-out;
}
</style>
<script>
import { mapState, mapMutations } from 'vuex'
import ProfileMessages from '~/components/ProfileMessages.vue'
import ProfileForm from '~/components/ProfileForm.vue'
import MySwiper from '~/components/mySwiper.vue'
import MapBox from '~/components/MapBox.vue'

export default {
  beforeRouteLeave(to, from, next) {
    //call a method inside the profilemessage component
    this.disposeComponent = true
    next()
  },
  async asyncData({ params, store }) {
    await store.dispatch('profiles/getProfile', params.id)
    return store.dispatch('profiles/getMetaInfo', params.id).then(res => {
      return res
    })
  },
  data() {
    return {
      profileId: 10,
      editable: this.$auth.loggedIn,
      editing: false,
      disposeComponent: false,
      placename: '',
      facebookUrl1: `https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fapp.strayhero.com%2Fprofile%2Fview%2F`,
      facebookUrl2: `&layout=button_count&size=small&appId=1985973471691447&width=84&height=28`
    }
  },
  mounted() {
    this.$store
      .dispatch('profiles/getProfile', this.$route.params.id)
      .then(res => {
        var data = res
        console.log('mounted', data)
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
      ],
      link: [
        {
          href: 'https://api.mapbox.com/mapbox-gl-js/v1.6.0/mapbox-gl.css',
          rel: 'stylesheet'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      longLat: state => state.profiles.longLat,
      profile: state => state.profiles.profile
    }),
    mobileShare() {
      return process.client && navigator.share
    }
  },
  components: {
    ProfileMessages,
    ProfileForm,
    MySwiper,
    MapBox
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
            console.log(ress)
          })
          .catch(error => {
            console.log(error)
          })
      })
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
