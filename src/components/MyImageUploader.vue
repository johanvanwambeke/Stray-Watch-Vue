<template>
  <div class="example-avatar">
    <input type="file" style="display:none" ref="fileInput1" accept="image/*" @change="setImage($event,1)">
    <input type="file" style="display:none" ref="fileInput2" accept="image/*" @change="setImage($event,2)">
    <input type="file" style="display:none" ref="fileInput3" accept="image/*" @change="setImage($event,3)">
    <input type="file" style="display:none" ref="fileInput4" accept="image/*" @change="setImage($event,4)">
    <v-dialog 
      v-model="dialog">
      <v-btn icon dark @click="dialog = false">
      <v-icon>close</v-icon>
      </v-btn>
      <vue-cropper class="cropperStyle"        
          ref='cropper'
          :guides="true"
          :view-mode="0"
          drag-mode="crop"
          :auto-crop-area="0.5"
          :background="true"
          :rotatable="true"
          :src="imgSrc"
          alt="Source Image"
          >
      </vue-cropper>
      <v-btn @click="cropImage" >Crop</v-btn>
      <v-btn @click="rotate">Rotate</v-btn>  
    </v-dialog>   

    <v-container grid-list-md >
        <v-layout>          
          <v-flex v-for="(image, imageIndex) in images" :key="imageIndex" xs3 class="imageframe">
            <v-card >
              <img :src="image.src" v-bind:class="{ ImageSelected:image!='paw-white.svg' }" class="image" @click="onPickFile(imageIndex)"/>
              <v-card-actions v-if="image.src!='paw-white.svg'">
                  <v-btn icon flat @click="showCropper($event,imageIndex)"> 
                    <v-icon>crop</v-icon> 
                  </v-btn>
                  <v-btn icon flat @click="deleteImg(imageIndex)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                  <v-btn icon flat @click="upload(imageIndex)" v-if="!image.uploaded">
                    <v-icon>save</v-icon>
                  </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          
        </v-layout>
      </v-container>
      <canvas ref="canvas" height="0" width="0" style="display: none;"></canvas>
    </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css';
export default {
  components: {
    VueCropper
  },
  data() {
    return {
      dialog:false,
      staticFile:'paw-white.svg',
      images: [
       {src:'paw-white.svg'},
       {src:'paw-white.svg'},
       {src:'paw-white.svg'},
       {src:'paw-white.svg'},
      ],
      editingImage:0,
      index: null,
      imgSrc: '',
      cropImg: '',
      edit: false,
      cropper: false,
    }
  },
  mounted(){
  },
  methods: {
    showCropper(e,nr){
      this.dialog=true;
      this.imgSrc =this.images[nr].src
      this.editingImage = nr;
      try {
          this.$refs.cropper.replace(this.images[nr].src);
          console.log('replaced')
      } catch (error) {
        console.log('find a way to fix this #1')
      }
    },
     deleteImg(nr){
        this.images.splice(nr,1,{src:'paw-white.svg',uploaded:false})
     },
     setImage(e, nr) {
      const file = e.target.files[0];
      if (!file.type.includes('image/')) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.images.splice(nr-1,1,{src:event.target.result, uploaded:false,img:e.target.files[0]})
        };
        reader.readAsDataURL(file);
      } else {
        alert('Sorry, FileReader API not supported');
      }
    },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.images.splice(this.editingImage,1,{src:this.$refs.cropper.getCroppedCanvas().toDataURL(), uploaded:false})
      this.dialog=false;      
    },
    rotate() {
      // guess what this does :)
      this.$refs.cropper.rotate(90);
    },
    onPickFile(e){
      if(e==0)
       this.$refs.fileInput1.click()
      if(e==1)
       this.$refs.fileInput2.click()
      if(e==2)
       this.$refs.fileInput3.click()
      if(e==3)
       this.$refs.fileInput4.click()
    },
    loadImageObject(src){
       return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve({i:img,h:img.height, w:img.width})
        img.onerror = reject
        img.src = URL.createObjectURL(src)
      })
    },
    async upload(nr){
      //We schalen de afbeelding omlaag of naar een maximum aantal MB
      var myCanvas = this.$refs.canvas
      var ctx = myCanvas.getContext("2d");
      var data = await this.loadImageObject(this.images[nr].img)

      console.log(data)


      var MAX_WIDTH = 200;
      var MAX_HEIGHT = 200;
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

      dataurl = myCanvas.toDataURL("image/jpg");
      await this.onFilePicked(dataurl,nr);
    },
    async onFilePicked(image,nr){

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
        this.images[nr].uploaded=true
      })
      .catch((error)=> {
        console.log(error);
      }); 
    },
  }
}
</script>

<style scoped>
.cropperStyle{
  margin-left: auto;
  margin-right: auto;
  height:70vh;
  width:80vh;
  border-style: none;
}
.image {
	width: 100%;
	height: auto;
  max-height: 50vh;
  border-style: dashed;
  border-width: 7px;
  border-color: gray;
  background-color: rgb(221, 221, 221);
}
.ImageSelected{
  width: 100%;
	height: auto;
  max-height: 50vh;
  border-style: solid;
  border-width: 0px;
  border-color: rgb(120, 179, 115);
  background-color: rgb(221, 221, 221);
}


.image:hover{
  cursor: pointer;
}

</style>