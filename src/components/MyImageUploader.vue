<template>
  <div class="example-avatar">
    <v-btn raised class="primary" @click="onPickFile">upload image</v-btn>
    <input type="file" style="display:none" ref="fileInput" accept="image/*" @change="setImage">

    <!-- <input type="file" name="image" accept="image/*" @change="setImage" /> -->
    <div v-if="imgSrc != ''" 
      style="width: 400px; height:300px; border: 1px solid gray; display: inline-block;">
      <vue-cropper            
          ref='cropper'
          :guides="true"
          :view-mode="2"
          drag-mode="crop"
          aspectRatio= "1"
          :auto-crop-area="0.5"
          :min-container-width="250"
          :min-container-height="180"
          :background="true"
          :rotatable="true"
          :src="imgSrc"
          alt="Source Image"
          :img-style="{ 'width': '100%' }">
      </vue-cropper>
    </div>

    <v-btn @click="cropImage" v-if="imgSrc != ''" >Crop</v-btn>
    <v-btn @click="rotate" v-if="imgSrc != ''">Rotate</v-btn>   

    <div>
      <img
        v-for="(image, imageIndex) in images"
        :key="imageIndex"
        :src="image"/>
    </div>


  </div>
</template>
<style scoped>
.image {
  float: left;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border: 1px solid #ebebeb;
  padding: 5px;
  width:"25%"
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
      images: [
      ],
      index: null,
      imgSrc: '',
      cropImg: '',
      edit: false,
      cropper: false,
    }
  },
  mounted(){
    // this.$refs.cropper.rotate(45);
        //  this.imgSrc= ''
  },
  watch: {
    edit(value) {
      console.log(value)
      if (value) {
        this.$nextTick(function () {
          if (!this.$refs.editImage) {
            return
          }
          let cropper = new Cropper(this.$refs.editImage, {
            aspectRatio: 1 / 1,
            viewMode: 1,
          })
          this.cropper = cropper
        })
      } else {
        if (this.cropper) {
          this.cropper.destroy()
          this.cropper = false
        }
      }
    }
  },
  methods: {
     setImage(e) {
      const file = e.target.files[0];
      if (!file.type.includes('image/')) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Sorry, FileReader API not supported');
      }
    },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.images.push(this.$refs.cropper.getCroppedCanvas().toDataURL());
    },
    rotate() {
      // guess what this does :)
      this.$refs.cropper.rotate(90);
    },
    onFilePicked(event){

      const files = event.target.files
      const fileReader = new FileReader()
      fileReader.addEventListener('load',()=>{
        console.log('loaded')
        this.cropper.destroy();
        var base64result = fileReader.result//.split(',')[1];
        this.imgSrc = base64result;
        fileReader.src = base64result;
        this.cropper = new Cropper(base64result)
      })
      fileReader.readAsDataURL(files[0]) 
    },
    onPickFile(){
      this.$refs.fileInput.click()
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