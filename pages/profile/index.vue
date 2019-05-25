<template>
    <v-container> 
      <h1>{{sentense}}</h1>
      <v-flex xs12 sm6 offset-3>
        <v-btn raised class="primary" @click="onPickFile">upload image</v-btn>
        <input type="file" style="display:none" ref="fileInput" accept="image/*" @change="onFilePicked">
      </v-flex>
      <v-flex>
        <img :src="imageUrl" alt="" width="300">
      </v-flex>
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
      <v-btn @click="saveProfile">Save profile</v-btn>
    </v-container>
</template>

<script>
export default {
 data() {
    return {
      info:'',
      imageUrl:'',
      image:null,
      email:'default@ce.com',
      animalTypes:['cat', 'dog'],
      animalType:'',
      purposes:['fosterhome','funding', 'adoption','new owner','Medical assistance', 'feeding'],
      purpose:'',
      urgencies:['immediatly ','in 1 day', 'in 2 days','in 1 week','in 1 month '],
      urgency:'',
      healthStatuses:['healthy ','in treatment', 'untreated'],
      healthStatus:'',
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
    // GoogleMap
  },
  computed:{
    sentense(){
      if(this.animalType === '') return 'Please fill in the profile';
      return this.healthStatus + ' ' + this.animalType + ' needs ' + this.purpose + ' ' + this.urgency;
    }
  },
  methods:{
    async saveProfile(){
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
