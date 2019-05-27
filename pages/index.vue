<template>
  <v-layout>
    <v-flex text-xs-center>
      <img
        src="/v.png"
        alt="Vuetify.js"
        class="mb-5"
      >
      <form @submit.prevent="submit" >
        <v-text-field placeholder="diercode" 
                autofocus
                v-model="search">
        </v-text-field>
      </form>
      <h1>Hallo</h1>
      
      <!-- <div class="hello">    
        <picture-input 
          ref="pictureInput"
          width="600" 
          height="600" 
          margin="16" 
          accept="image/jpeg,image/png" 
          size="10" 
          button-class="btn"
          :custom-strings="{
            upload: '<h1>Bummer!</h1>',
            drag: 'Drag a 😺 GIF or GTFO'
          }"
          @change="onChange">
        </picture-input>
      </div> -->
      <blockquote class="blockquote">
        &#8220;We are raising funds for a <b>global</b> solution connecting stray <b>animals</b> in need with <b>caregivers</b> and <b>capital</b>.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>      
    </v-flex>
  </v-layout>
</template>
<script>

export default {

  head:{
    // script: [
    //   { src: 'https://unpkg.com/vue-picture-input' },
    //   { src: 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js' },
    // ],     
    // link: [
    //   { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto' }
    // ]
 
  },
  data(){
    return{
      search:''
    }
  },
  methods:{
    submit(event){
      this.$router.push(`profile/${this.search}`)
    },
    onChange (image) {
        console.log('onChange!')
        if (image) {
            EXIF.getData(this.$refs.pictureInput.file, function() {
                console.log('image info', this)
                console.log('exif data', this.exifdata)
            })
        } else {
            console.log(`it's not image`)
        }
    }
  },
  components: {
    // PictureInput
    // 'picture-input': PictureInput
  },
}
</script>
