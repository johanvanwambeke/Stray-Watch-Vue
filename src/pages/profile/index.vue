<template>
    <div> 
      <no-ssr placeholder="Loading...">
      </no-ssr>
      <ImageSlider/>
      <div class="mapbox mt-4">
        <MapBox/>
      </div>
      <h1 class="mt-4">{{sentense}}</h1>
      <v-flex>
        <v-select
          v-model="healthStatus"
          :items="healthStatuses"
          label="Health"
        ></v-select>
      </v-flex>
       <v-flex>
          <v-select
            v-model="animalType"
            :items="animalTypes"
            label="Animal"
          ></v-select>
      </v-flex>
      <v-flex>
          <v-select
            v-model="purpose"
            :items="purposes"
            label="Purpose"
          ></v-select>
      </v-flex>
      <v-flex>
          <v-select
            v-model="urgency"
            :items="urgencies"
            label="Urgency"
          ></v-select>
      </v-flex>
      <v-flex>
        <v-textarea
          outline
          label="More info"
          v-model="info"
        ></v-textarea>
      </v-flex>
      <p>Data{{dataOK}}</p>
      <p>IMg{{imageOK}}</p>
      <p>Nr Imgae{{images.length}}</p>
      <v-btn @click="saveProfile">Save profile</v-btn>
      <!-- {{imageOK}}
      {{locationOK}} -->
    </div>
</template>
<style scoped>
.mapbox{
  /* position: absolute;
  left: 0;
  width: 100%;
  display: inline-block; */

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
export default {   
  head: {
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js' },
      { src: 'https://api.mapbox.com/mapbox-gl-js/v1.0.0/mapbox-gl.js' },
      { src:'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.3.0/mapbox-gl-geocoder.min.js' },
    ],
    link:[
      {href:'https://api.mapbox.com/mapbox-gl-js/v1.0.0/mapbox-gl.css', rel:'stylesheet'},
      {href:'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.3.0/mapbox-gl-geocoder.css', rel:'stylesheet', type:'text/css'}
      ]
  },
 data() {
    return {
      imageUrl:'',
      image:null,
      email:'default@ce.com',
      animalTypes:['cat', 'dog'],
      purposes:['fosterhome','funding', 'adoption','new owner','Medical assistance', 'feeding'],
      urgencies:['immediatly ','in 1 day', 'in 2 days','in 1 week','in 1 month '],
      healthStatuses:['healthy ','in treatment', 'untreated'],
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
    MapBox
  },
  computed:{
    ...mapState({
      imageOK: state => state.profiles.imageOK,
      locationOK: state => state.profiles.locationOK,
      dataOK: state => state.profiles.dataOK,
      images: state => state.images.images
    }),
    healthStatus: {
      get () {
        return this.$store.state.profiles.healthStatus
      },
      set (value) {
        this.$store.commit('profiles/sethealthStatus', value)
      }
    },
    animalType: {
      get () {
        return this.$store.state.profiles.animalType
      },
      set (value) {
        this.$store.commit('profiles/setanimalType', value)
      }
    },
    purpose: {
      get () {
        return this.$store.state.profiles.purpose
      },
      set (value) {
        this.$store.commit('profiles/setpurpose', value)
      }
    },
    urgency: {
      get () {
        return this.$store.state.profiles.urgency
      },
      set (value) {
        this.$store.commit('profiles/seturgency', value)
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
      //save each file, receiving URL
      //Try to do it async so all files go at the same time
      this.images.forEach((image,i) => {        
        console.log(image.imgForUpload)
        this.$store.dispatch('images/uploadImage',{image:image.imgForUpload,nr:i})
      });
      //      	                      
      return



      //I will wrap the form data in 1 object and send it to the backend to save
      //It returns the ID of the profile
      //I navigate to the profile ID
      this.$axios.post(
      // 'https://localhost:44352/api/AnimalProfile/Create',
      'https://stray-watch-api.azurewebsites.net/api/AnimalProfile/Create',      
        {
          'ImageUrl':this.imageUrl,
          'Health':this.healthStatus,
          'Animal':this.animalType,
          'Purpose':this.purpose,
          'Urgency':this.urgency,
          'Info':this.info,
        })  

      .then((response)=> {
        console.log(response.data.id);
        this.$router.push({ path: `/profile/${response.data.id}` })
      })
      .catch((error)=> {
        console.log(error);
      }); 
    },
    onPickFile(){
      this.$refs.fileInput.click()
    },
    async onFilePicked(event){
     
      const files = event.target.files
      let filename = files[0].name
      console.log(files[0])

      var headers = {
            'Content-Type': 'multipart/form-data',
      }

      if(filename.lastIndexOf('.')<=0){
        return alert('Please ad a valid file!')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load',()=>{
        this.$axios.post(
        // 'https://localhost:44352/api/FileUpload/savefile',
        'https://stray-watch-api.azurewebsites.net/api/FileUpload/savefile',
        
          {'imgString': fileReader.result, 
            'type':files[0].type},
          )  
        .then((response)=> {
          console.log(response.data.uri);
          this.imageUrl = response.data.uri;
        })
        .catch((error)=> {
          console.log(error);
        }); 
      })
      fileReader.readAsDataURL(files[0]) 
    },
  },
  created() {
    if (process.browser) {

    }
  }
}

  
</script>
