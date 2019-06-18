<template>
    <div> 
      <LoadingScreen :value="loading" progressColor="green" :message="loadingMessage" />
      <ImageSlider  class="mt-4" />
      <MapBox class="mt-4"/>
      <v-container class="mt-4">
        <h1 >{{sentense}}</h1>
        <v-flex>
            <v-select solo
              v-model="animal"
              :items="animalLst"
              label="Animal"
            ></v-select>
        </v-flex>
        <v-flex>
            <v-select solo
              v-model="age"
              :items="ageLst"
              label="age"
            ></v-select>
        </v-flex>
        <v-flex>
            <v-select solo
              v-model="needs"
              :items="needsLst"
              label="Purpose"
            ></v-select>
        </v-flex>
        <v-flex v-if="needs=='medical'">
          <v-select solo
            multiple
            chips
            v-model="medical"
            :items="medicalLst"
            label="Ailment"
          ></v-select>
        </v-flex>
        <v-flex>
            <v-select solo
              v-model="urgency"
              :items="urgencyLst"
              label="Urgency"
            ></v-select>
        </v-flex>     
        <v-flex>
            <v-select solo
              v-model="behavior"
              :items="behaviorLst"
              label="Behavior"
            ></v-select>
        </v-flex>
        <v-flex>
          <v-textarea
            solo
            label="More info"
            v-model="info"
          ></v-textarea>
        </v-flex>
        <!-- <p>Data{{dataOK}}</p>
        <p>IMg{{imageOK}}</p>
        <p>Nr Imgae{{images.length}}</p>
        <p>Location{{locationOK}}</p> -->
        <v-btn @click="saveProfile">Save profile</v-btn>
    </v-container>
  </div>
</template>
<style scoped>
.mapbox{
  padding: 15px;
  background-color:#E5897A;
  
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
</style>

<script>
import { mapState } from 'vuex'
import ImageSlider from "~/components/ImageSlider.vue";
import MapBox from "~/components/MapBox.vue";
import LoadingScreen from "~/components/LoadingScreen.vue";
export default {   
  head: {
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js' },
      // { src: 'https://api.mapbox.com/mapbox-gl-js/v1.0.0/mapbox-gl.js' },
      // { src:'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.3.0/mapbox-gl-geocoder.min.js' },
    ],
    link:[
      {href:'https://api.mapbox.com/mapbox-gl-js/v1.0.0/mapbox-gl.css', rel:'stylesheet'},
      {href:'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.3.0/mapbox-gl-geocoder.css', rel:'stylesheet', type:'text/css'},
      ]
  },
 data() {
    return {
      loadingMessage:'Saving profile',
      loading:false,
      imageUrl:'',
      image:null,
      email:'default@ce.com',
      animalLst:['cat', 'dog'],
      ageLst:['< 1 year', 'junior','adult','senior','unsure'],
      needsLst:['fosterhome','funding', 'adoption','finding new owner','medical', 'feeding','driver'],
      medicalLst:['skin condition','broken bones', 'bleeding','tumors'],
      urgencyLst:['immediatly ','in 1 day', 'in 2 days','1 to 3 weeks','in 1 month','longer'],
      behaviorLst:['shy','scared','happy','playfull','growl','agressive','unknown'],
      show: true,
			params: {
				token: '123456798',
				name: 'avatar'
			},
			headers: {
				smail: '*_~'
			},
			imgDataUrl: '' // the datebase64 url of created image

    }
  },
  components: {
    ImageSlider,
    MapBox,
    LoadingScreen
  },
  computed:{
    ...mapState({
      imageOK: state => state.profiles.imageOK,
      locationOK: state => state.profiles.locationOK,
      dataOK: state => state.profiles.dataOK,
      images: state => state.images.images
    }),
    animal: {
      get () {
        return this.$store.state.profiles.animal
      },
      set (value) {
        this.$store.commit('profiles/animal', value)
      }
    },
    age: {
      get () {
        return this.$store.state.profiles.age
      },
      set (value) {
        this.$store.commit('profiles/age', value)
      }
    },
    needs: {
      get () {
        return this.$store.state.profiles.needs
      },
      set (value) {
        this.$store.commit('profiles/needs', value)
      }
    },
    medical: {
      get () {
        return this.$store.state.profiles.medical
      },
      set (value) {
        this.$store.commit('profiles/medical', value)
      }
    },
    urgency: {
      get () {
        return this.$store.state.profiles.urgency
      },
      set (value) {
        this.$store.commit('profiles/urgency', value)
      }
    },
    behavior: {
      get () {
        return this.$store.state.profiles.behavior
      },
      set (value) {
        this.$store.commit('profiles/behavior', value)
      }
    },
    info: {
      get () {
        return this.$store.state.profiles.info
      },
      set (value) {
        this.$store.commit('profiles/setinfo', value)
      }
    },
    longLat: {
      get () {
        return this.$store.state.profiles.longLat
      },
      set (value) {
        this.$store.commit('profiles/setlongLat', value)
      }
    },
    sentense(){
      if(this.animalType === '') return 'Please fill in the profile';
      return this.healthStatus + ' ' + this.animalType + ' needs ' + this.purpose + ' ' + this.urgency;
    },
  },
  methods:{
    async saveProfile(){
      this.loading= true
      //I will wrap the form data in 1 object and send it to the backend to save
      //It returns the ID of the profile
      //I navigate to the profile ID
      var imagesb64 = this.images.map(a => a.src)

      var profile =           
      {   'location':this.longLat,
          'Animal':this.animal,
          'Age':this.age,
          'needs':this.needs,
          'medical':this.medical,
          'Urgency':this.urgency,
          'Behavior':this.behavior,
          'Info':this.info,
          'images64':imagesb64
          }

      this.$store.dispatch('profiles/saveProfile',profile)
        .then(profileId=>{
          console.log(profileId)
          this.$router.push({ path: `/profile/${profileId}` })
        })
        .catch((error)=> {console.log(error);});
    },
  },
  created() {
    if (process.browser) {

    }
  }
}

  
</script>
