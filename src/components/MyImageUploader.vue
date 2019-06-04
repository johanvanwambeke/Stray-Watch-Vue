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
      <v-btn @click="rotate" v-if="imgSrc != ''">Rotate</v-btn>  
    </v-dialog>   

    <v-container grid-list-md >
        <v-layout>          
          <v-flex v-for="(image, imageIndex) in images" :key="imageIndex" xs3 class="imageframe">
            <v-card >
              <img :src="image" v-bind:class="{ ImageSelected:image!='paw-white.svg' }" class="image" @click="onPickFile(imageIndex)"/>

              <v-card-actions v-if="image!='paw-white.svg'">
                  <v-btn icon flat @click="showCropper($event,imageIndex)"> 
                    <v-icon>crop</v-icon> 
                  </v-btn>
                  <v-btn icon flat @click="deleteImg(imageIndex)">
                    <v-icon>delete</v-icon>
                  </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
</template>
<style scoped>
.cropperStyle{
  margin-left: auto;
  margin-right: auto;
  height:70vh;
  width:80vh;
  border-style: none;
}
.btnMenu {
  
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
       'paw-white.svg',
       'paw-white.svg',
       'paw-white.svg',
       'paw-white.svg'
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
      this.imgSrc =this.images[nr]
      this.editingImage = nr;
      try {
          this.$refs.cropper.replace(this.images[nr]);
          console.log('replaced')
      } catch (error) {
        console.log('find a way to fix this #1')
      }
    },
     deleteImg(nr){
        this.images.splice(nr,1,'paw-white.svg')
     },
     setImage(e, nr) {
       console.log(nr)
      const file = e.target.files[0];
      if (!file.type.includes('image/')) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.images.splice(nr-1,1,event.target.result)
          // this.images.push(event.target.result)
          //Cropper !
          // rebuild cropperjs with the updated source
          // this.imgSrc = event.target.result;
          // this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Sorry, FileReader API not supported');
      }
    },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.images.splice(this.editingImage,1,this.$refs.cropper.getCroppedCanvas().toDataURL())
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
    editSave() {
      this.edit = false
      let oldFile = this.files[0]
      let binStr = atob(this.cropper.getCroppedCanvas().toDataURL(oldFile.type).split(',')[1])
      let arr = new Uint8Array(binStr.length)
      for (let i = 0; i < binStr.length; i++) {
        arr[i] = binStr.charCodeAt(i)
      }
      let file = new File([arr], oldFile.name, { type: oldFile.type })
      this.$refs.upload.update(oldFile.id, {
        file,
        type: file.type,
        size: file.size,
        active: true,
      })
    },
    alert(message) {
      alert(message)
    },
    inputFile(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        this.$nextTick(function () {
          this.edit = true
        })
      }
      if (!newFile && oldFile) {
        this.edit = false
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(gif|jpg|jpeg|png|webp)$/i.test(newFile.name)) {
          this.alert('Your choice is not a picture')
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file)
        }
      }
    }
  }
}
</script>