<template>
    <div v-touch:swipe="swipeHandler"     class="image" 
    :style="{'background-image': 'url(' + (!this.images[0]? '' : this.images[counter-1].src) + ')'}">
       <input 
        type="file" 
        style="display:none" 
        ref="fileInput" 
        accept="image/*" 
        @change="addImage"
        multiple>
       <v-toolbar 
        flat
        dark
        dense
        class="actions"
        color="rgba(0, 0, 0, 0.2)">
        <v-btn icon @click="pickFile" :disabled="images.length > 3">         
          <v-icon>add_circle_outline</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon @click="showCropper" :disabled="!this.images[0]">
          <v-icon>crop_rotate</v-icon>
        </v-btn>
        <v-btn icon @click="deleteImage" :disabled="!this.images[0]">
          <v-icon>delete</v-icon>
        </v-btn>
        <v-btn icon @click="upload" :disabled="!this.images[0]">
          <v-icon>cloud_upload</v-icon>
        </v-btn>
      </v-toolbar>
      <v-toolbar
       class="nav"
        flat
        dark         
        dense
        color="rgba(0, 0, 0, 0)">
        <v-btn icon flat @click="counter-=1" :disabled="counter < 2">
          <v-icon>arrow_back_ios</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon flat @click="counter+=1" :disabled="counter > 3 || (images.length-1)<counter">
          <v-icon>arrow_forward_ios</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="dots">
        <span v-for="(image, imageIndex) in images"
          :key="imageIndex"
          v-bind:class="{ dotSelected:imageIndex+1==counter }" 
          class="dot"></span>
      </div>
      <v-dialog 
        v-model="dialog">
        <v-toolbar 
          flat
          dark
          dense
          class="croppernavup"
          color="rgba(0, 0, 0, 0.2)">
          <v-btn icon flat  @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn icon flat  @click="rotate">
            <v-icon>rotate_90_degrees_ccw</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn icon flat  @click="cropImage">
            OK
          </v-btn>
        </v-toolbar>
        <vue-cropper 
            class="cropperStyle"        
            ref='cropper'
            :guides="true"
            :view-mode="0"
            drag-mode="crop"
            :auto-crop-area="0.5"
            :background="false"
            :rotatable="true"
            :src="cropperImg"
            alt="Source Image"
            >
        </vue-cropper>
      </v-dialog> 
      <canvas ref="canvas" height="10" width="10" hidden ></canvas>
    </div>
</template>
<style scoped>
.image{
  background-repeat: no-repeat;
  background-position: center;
  background-size:contain;
  background-color: rgba(170, 172, 170, 0.664);
  border-radius: 10px;
  min-height: 300px;
  max-height: 400px;
  width: 100%;
  color:rgba(255, 217, 0, 0);
  margin-bottom: 20px;
  position: relative;
}
.v-toolbar.actions{
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.v-toolbar.nav{
  position: absolute;
  top: 50%;
}
.dots{
  width: 100%;
  text-align: center;
  position: absolute;
  top: 85%;
}
.dot {
  height: 12px;
  width: 12px;
  margin: 3px;
  border-radius: 50%;
  display: inline-block;
  background-color:rgb(255, 255, 255);
}
.dotSelected{
  background-color: #6FCDC7;
}
.cropperStyle{
  border-radius: 15px;
  height:100vh;
  border-style: none;
  position: relative;
  background-repeat: repeat-x;
  background-color: black;
  z-index: 9;
}
.croppernav{
  text-align: center;
  position:absolute;
  z-index: 10;
}

</style>
<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css';
export default {
  data(){
    return{
      counter:1,
      cropperImg:'',
      dialog:false,
    }
  },
  components: {
    VueCropper,
  },
  computed:{
    images () {
      return this.$store.getters['images/images']
    },
    imgCounter () {
      return this.$store.getters['images/counter']
    },
  },
  methods:{
    swipeHandler(e){
      var amountofimg = this.images.length
      if(e == 'left' && amountofimg > this.counter){
        this.counter +=1
      }
      if(e == 'right' && this.counter > 1){
        this.counter -=1
      }
    },
    deleteImage(){
      this.$store.dispatch('images/delete',this.counter-1)  
      this.counter = this.images.length
    },
    pickFile(){
      this.$refs.fileInput.click()
    },
    getImageInfo(file){
      return new Promise((resolve, reject)=>{
        EXIF.getData(file, function() {
          if(this.exifdata.GPSLatitude){
            var latitude = 
                (this.exifdata.GPSLatitude[0].numerator / this.exifdata.GPSLatitude[0].denominator)  +
              ((this.exifdata.GPSLatitude[1].numerator / this.exifdata.GPSLatitude[1].denominator) /60) +
              ((this.exifdata.GPSLatitude[2].numerator / this.exifdata.GPSLatitude[2].denominator) /3600)
            var Longtitude = 
                (this.exifdata.GPSLongitude[0].numerator / this.exifdata.GPSLongitude[0].denominator)  +
              ((this.exifdata.GPSLongitude[1].numerator / this.exifdata.GPSLongitude[1].denominator) /60) +
              ((this.exifdata.GPSLongitude[2].numerator / this.exifdata.GPSLongitude[2].denominator) /3600)
            if(this.exifdata.GPSLatitudeRef == "S")
              latitude *= -1
            if(this.exifdata.GPSLongitudeRef != "E")
              longitude *=-1
          }
          resolve( {latitude:latitude, longitude:Longtitude})
        })
      })
    },
    async addImage(e){
      var arraytemp = Array.from(e.target.files)
      if(this.images.length + arraytemp.length > 4){
        alert('no more then 4 images, only the  first '+ (4- this.images.length) +'will be added')
        arraytemp = arraytemp.slice(0,4 - this.images.length)
      }
      
      arraytemp.forEach(file => {
        this.addImageLooped(file)
      });
    },
    async addImageLooped(e) {

      const file =e;
      var self = this
      var imgcords = await this.getImageInfo(file);
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          var myimg = {
            src:event.target.result,
            uploaded:false,
            img:file,
            lat:imgcords.latitude,
            long: imgcords.longitude
          }
          this.$store.dispatch('images/add',myimg)
          self.counter = self.images.length
        };
        reader.readAsDataURL(file);
      } else {
        alert('Sorry, FileReader API not supported');
      }
    },
    showCropper(){
      this.dialog=true;
      this.cropperImg =this.images[this.counter-1].src
      try {
        this.$refs.cropper.replace(this.images[this.counter-1].src);
        console.log('replaced')
      } catch (error) {
        console.log('find a way to fix this #1')
      }
    },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.$store.dispatch('images/replace',{nr: this.counter-1, img:this.$refs.cropper.getCroppedCanvas().toDataURL()})
      this.dialog=false;      
    },
    rotate() {
      // guess what this does :)
      this.$refs.cropper.rotate(90);
    },
    loadImageObject(src){
       return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve({i:img,h:img.height, w:img.width})
        img.onerror = reject
        img.src = URL.createObjectURL(src)
      })
    },
    async upload(){
      //We schalen de afbeelding omlaag of naar een maximum aantal MB
      var myCanvas = this.$refs.canvas
      var ctx = myCanvas.getContext("2d");
      console.log(this.images[this.counter-1])
      var data = await this.loadImageObject(this.images[this.counter-1].img)

      console.log(data)


      var MAX_WIDTH = 600;
      var MAX_HEIGHT = 600;
      var width = data.w;
      var height = data.h;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      myCanvas.width = width;
      myCanvas.height = height;

      ctx.drawImage(data.i, 0, 0,width,height);
      
      var dataurl = myCanvas.toDataURL("image/jpg");
      await this.onFilePicked(dataurl);
    },
    async onFilePicked(image){
      console.log('startupload')
      let filename = image.name

      this.$axios.post(
        // 'https://localhost:44352/api/FileUpload/savefile',
        'https://stray-watch-api.azurewebsites.net/api/FileUpload/savefile',      
          {
            'imgString': image, 
            'type': filename
          },
          {
            onUploadProgress: uploadEvent=>{
              console.log('uploaded: '  + Math.round(uploadEvent.loaded / uploadEvent.total)*100 + '%')
            }
          }
      )  
      .then((response)=> {
        console.log(response.data.uri);
        console.log('laat zien dat ' + nr + ' is geupload');
      })
      .catch((error)=> {
        console.log(error);
      }); 
    },
  }
}
</script>