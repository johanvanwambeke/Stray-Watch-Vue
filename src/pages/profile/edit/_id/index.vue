<template>
 <v-layout row wrap>
     <v-flex xs12 pa-4>
         <div ><v-btn @click="save">save</v-btn></div>
     </v-flex>
  <v-flex xs12 lg6 pa-4>
      <!-- <FileUploader></FileUploader> -->
   <ImageSlider class="imageSlider" />
  </v-flex>
  <v-flex xs12 lg6 pa-4>
   <h1>Location</h1>
      <div
        v-for="i in images.filter(x=>x.longlat != null)"
        :style="{'background-image': 'url(' + (i.src) + ')'}"
        class="locationImages grow"
        @click="setLocation(i.longlat)"
      ></div>
      {{longLat}}
   <MapBox class="mt-4" />
  </v-flex>
  <v-flex xs12 lg6 pa-4>
   <AnimalProfileForm :editable="true" />
  </v-flex xs12 lg6 pa-4>
  <ProfileMessages></ProfileMessages>
 </v-layout>
</template>
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
<script>
import { mapState } from 'vuex'
import FileUploader from '~/components/FileUploader.vue'
import ProfileMessages from '~/components/ProfileMessages.vue'
import ImageSlider from '~/components/ImageSlider.vue'
import MapBox from '~/components/MapBox.vue'
import AnimalProfileForm from '~/components/AnimalProfileForm.vue'
export default {
  data(){
    return{
    }
  },
 async asyncData({ app, params, store }) {
    store.commit('profiles/profileId',params.id)
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
 computed:{
    ...mapState({
      imageOK: state => state.profiles.imageOK,
      locationOK: state => state.profiles.locationOK,
      dataOK: state => state.profiles.dataOK,
      images: state => state.images.imagesWithLoc,
      longLat: state => state.profiles.longLat
    }),
 },
 components: {
  FileUploader,
  ProfileMessages,
  ImageSlider,
  MapBox,
  AnimalProfileForm
 },
 methods:{
     setLocation(payload) {
      console.log(payload)
      if (payload && payload.longitude)
        this.$store.commit('profiles/setlongLat', [
          payload.longitude,
          payload.latitude
        ])
    },
      async save() {
      //I will wrap the form data in 1 object and send it to the backend to save
      //It returns the ID of the profile
      //I navigate to the profile ID
      var mylonlat = this.$store.getters['profiles/longLat']      
      var imagesb64arr = this.$store.state.images.images.map(a => a.imgForUpload)      

      var profile = {
        animal: this.$store.getters['profiles/animal'],
        age: this.$store.getters['profiles/age'],
        needs: this.$store.getters['profiles/needs'],
        medical: this.$store.getters['profiles/medical'],
        urgency: this.$store.getters['profiles/urgency'],
        behavior: this.$store.getters['profiles/behavior'],
        info: this.$store.getters['profiles/info'],
        longLat: '[' + mylonlat[0] + ', ' + mylonlat[1] + ']',
        images64: imagesb64arr
      }

      console.log(profile)

      this.$store
        .dispatch('profiles/saveProfile', profile)
        .then(profileId => {
          console.log(profileId)
          this.$router.push({ path: '/list' })
        })
        .catch(error => {
          console.log(error)
        })
    }
 }
}
</script>
