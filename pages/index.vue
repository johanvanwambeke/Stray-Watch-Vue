<template>
    <v-container> 

      <h1>{{sentense}}</h1>

      <!-- <v-flex xs12 sm6 offset-3>
        <v-btn raised class="primary" @click="onPickFile">upload image</v-btn>
        <input type="file" style="display:none" ref="fileInput" accept="image/*" @change="onFilePicked">
      </v-flex>
      <v-flex>
        <img :src="imageUrl" alt="" width="300">
      </v-flex> -->
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
          v-model="description"
        ></v-textarea>
      </v-flex>

      <iframe src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fapp.stray-watch.com%2F&layout=button&size=small&appId=350257052296222&width=59&height=20" width="59" height="20" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>
    </v-container>
</template>

<script>
export default {
  head () {
      return {
        title:'Customisable PageTitle Bobbies profile',
        meta: [
            {'property':'og:title', 'content': this.sentense},
            {'property':'og:description', 'content':this.description},
            {'property':'og:image', 'content':'https://stray-watch.com/wp-content/uploads/elementor/thumbs/anoir-chafik-37957-unsplash-1-min-o7ncybi3vo5ziv13y2h6bdaa5cjhq6fzdqgilntxfs.jpg'},
            {'property':'og:url', 'content':'https://app.stray-watch.com/'},
            {'property':'og:type', 'content':'Charity'},
          ]
      }
    },
 data() {
    return {
      description:'this is a small tekst',
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
    onPickFile(){
      this.$refs.fileInput.click()
    },
    onFilePicked(event){
      const files = event.target.files
      let filename = files[0].name
      if(filename.lastIndexOf('.')<=0){
        return alert('Please ad a valid file!')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load',()=>{
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    }
  },
  created() {
    if (process.browser) {

    }
  }
}

  
</script>
