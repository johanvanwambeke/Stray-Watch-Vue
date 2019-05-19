<template>
    
    <v-form
    ref="form"
  >
  <h1>Create a sharable profile</h1>

    <v-flex xs12 sm6 offset-3>
      <v-btn raised class="primary" @click="onPickFile">upload image</v-btn>
      <input type="file" style="display:none" ref="fileInput" accept="image/*" @change="onFilePicked">
    </v-flex>


    <v-flex>
      <img :src="imageUrl" alt="" width="300">
    </v-flex>


    <v-flex>
        <v-select
          :items="purpose"
          label="Purpose"
        ></v-select>
    </v-flex>

    <v-flex>
        <v-select
          :items="urgency"
          label="Urgency"
        ></v-select>
    </v-flex>
    <v-flex>
      <v-select
        :items="health"
        label="Health"
      ></v-select>
    </v-flex>
    <v-flex>
      <v-textarea
        outline
        label="More info"
      ></v-textarea>
    </v-flex>
    <!-- <div id="fb-root"></div>
    <div class="fb-share-button" data-href="https://stray-watch-vue.azurewebsites.net/" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fstray-watch-vue.azurewebsites.net%2F&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Delen</a></div> -->
	<!-- <my-upload field="img"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
        v-model="show"
		:width="300"
		:height="300"
		url="/upload"
		:params="params"
		:headers="headers"
		img-format="png"></my-upload>
	<img :src="imgDataUrl"> -->


  </v-form>
</template>

<script>
export default {
  head () {
      return {
        meta: [{
          'og:title':'test',
          'og:description': 'tests'
        }]
      }
    },
 data() {
    return {
      imageUrl:'',
      image:null,
      email:'default@ce.com',
      purpose:['fosterhome','funding', 'adoption','finding owner','Medical assistance', 'feeding'],
      urgency:['immediate ','1 day', '2 days','week','month ', 'longer'],
      health:['healthy ','in treatment', 'untreated'],
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
      // 'my-upload': myUpload
  },
  methods:{
    toggleShow() {
				this.show = !this.show;
			},
            /**
			 * crop success
			 *
			 * [param] imgDataUrl
			 * [param] field
			 */
			cropSuccess(imgDataUrl, field){
				console.log('-------- crop success --------');
				this.imgDataUrl = imgDataUrl;
			},
			/**
			 * upload success
			 *
			 * [param] jsonData  server api return data, already json encode
			 * [param] field
			 */
			cropUploadSuccess(jsonData, field){
				console.log('-------- upload success --------');
				console.log(jsonData);
				console.log('field: ' + field);
			},
			/**
			 * upload fail
			 *
			 * [param] status    server api return error status, like 500
			 * [param] field
			 */
			cropUploadFail(status, field){
				console.log('-------- upload fail --------');
				console.log(status);
				console.log('field: ' + field);
			},
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
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js')
      document.body.appendChild(recaptchaScript)
    }
    // let ckeditor = document.createElement('script');    
    // ckeditor.setAttribute('src',"https://connect.facebook.net/nl_NL/sdk.js#xfbml=1&version=v3.3&appId=1985973471691447&autoLogAppEvents=1");
    // ckeditor.setAttribute('crossorigin',"anonymous");
    // document.head.appendChild(ckeditor);
  }
}

  
</script>
