<template>
  <div
    v-touch:swipe="swipeHandler"
    class="image"
    :style="{'background-image': 'url(' + (!this.images[0]? '' : this.images[counter-1].src) + ')'}"
  >
    <input
      type="file"
      style="display:none"
      ref="fileInput"
      accept="image/*"
      @change="addImage"
      multiple
    >
    <v-toolbar flat dark dense class="actions" color="rgba(0, 0, 0, 0.0)">
      <v-btn class="imgIcon" icon @click="pickFile" :disabled="images.length > 3">
        <v-icon>add_a_photo</v-icon>
      </v-btn>
      <v-btn class="imgIcon" icon @click="setMain" :disabled="!this.images[0]">
        <v-icon v-if="(this.images.length == 0)">outlined_flag</v-icon>
        <v-icon v-if="(!this.images[0]? false :  !this.images[counter-1].main)">outlined_flag</v-icon>
        <v-icon v-if="(!this.images[0]? false :  this.images[counter-1].main)">flag</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn class="imgIcon" icon @click="showCropper" :disabled="!this.images[0]">
        <v-icon>crop_rotate</v-icon>
      </v-btn>
      <v-btn class="imgIcon" icon @click="deleteImage" :disabled="!this.images[0]">
        <v-icon>delete</v-icon>
      </v-btn>
      <!-- <v-btn icon @click="setCoords" >
          <v-icon>map</v-icon>
      </v-btn>-->
    </v-toolbar>
    <v-toolbar class="nav" flat dark dense color="rgba(0, 0, 0, 0)">
      <v-btn icon flat @click="counter-=1" :disabled="counter < 2">
        <v-icon>arrow_back_ios</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon flat @click="counter+=1" :disabled="counter > 3 || (images.length-1)<counter">
        <v-icon>arrow_forward_ios</v-icon>
      </v-btn>
    </v-toolbar>
    <div class="dots">
      <span
        v-for="(image, imageIndex) in images"
        :key="imageIndex"
        v-bind:class="{ dotSelected:imageIndex+1==counter }"
        class="dot"
      ></span>
    </div>
    <v-dialog v-model="dialog">
      <v-toolbar flat dark dense class="croppernavup" color="black">
        <v-btn icon flat @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn icon flat @click="rotate">
          <v-icon>rotate_90_degrees_ccw</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon flat @click="cropImage">OK</v-btn>
      </v-toolbar>
      <vue-cropper
        class="cropperStyle"
        ref="cropper"
        :guides="true"
        :view-mode="0"
        drag-mode="crop"
        :auto-crop-area="0.5"
        :background="false"
        :rotatable="true"
        :src="cropperImg"
        alt="Source Image"
      ></vue-cropper>
    </v-dialog>
    <canvas ref="canvas" height="10" width="10" hidden></canvas>
    <v-snackbar v-model="snackbar" bottom color="#E28B8A">
      <center>{{ snackmsg }}</center>
    </v-snackbar>
  </div>
</template>
<style scoped>
.imgIcon {
  background-color: rgba(27, 27, 27, 0.246);
  margin-top: 20px;
  padding: 10px;
  height: 42px;
  width: 42px;
  border-radius: 50%;
}
.image {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-color: rgba(170, 172, 170, 0);
  min-height: 300px;
  max-height: 390px;
  width: 100%;
  color: rgba(255, 217, 0, 0);
  position: relative;
}

.v-toolbar.nav {
  position: absolute;
  top: 85%;
  z-index: 15;
}
.selected {
  color: black;
}
.dots {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 90%;
}
.dot {
  height: 10px;
  width: 10px;
  margin: 3px;
  border-radius: 50%;
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.7);
}
.dotSelected {
  background-color: #6fcdc7;
}
.cropperStyle {
  height: 100vh;
  border-style: none;
  position: relative;
  background-repeat: repeat-x;
  background-color: black;
  z-index: 9;
}
.croppernav {
  text-align: center;
  position: absolute;
  z-index: 10;
}
.vue-notification {
  z-index: 12;
  padding: 10px;
  margin: 0 5px 5px;

  font-size: 12px;

  color: #ffffff;
  background: #44a4fc;
  border-left: 5px solid #187fe7;
}
</style>
<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
export default {
  data() {
    return {
      counter: 1,
      cropperImg: '',
      dialog: false,
      snackmsg: '',
      snackbar: false
    }
  },
  components: {
    VueCropper
  },
  computed: {
    images() {
      return this.$store.getters['images/images']
    },
    imgCounter() {
      return this.$store.getters['images/counter']
    }
  },
  methods: {
    // setCoords(){
    //   this.$store.commit('profiles/setlongLat', [70.123123, 10.12312])
    // },
    swipeHandler(e) {
      var amountofimg = this.images.length
      if (e == 'left' && amountofimg > this.counter) {
        this.counter += 1
      }
      if (e == 'right' && this.counter > 1) {
        this.counter -= 1
      }
    },
    setMain() {
      if (this.images[this.counter - 1].main == true) return
      this.$store.dispatch('images/setMain', this.counter - 1)
      this.snackmsg = 'Set as main image'
      this.snackbar = true
    },
    deleteImage() {
      this.$store.dispatch('images/delete', this.counter - 1)
      this.counter = this.images.length
    },
    pickFile() {
      this.$refs.fileInput.click()
    },
    getImageInfo(file) {
      var self = this
      return new Promise((resolve, reject) => {
        EXIF.getData(file, function() {
          if (this.exifdata.GPSLatitude) {
            var latitude =
              this.exifdata.GPSLatitude[0].numerator /
                this.exifdata.GPSLatitude[0].denominator +
              this.exifdata.GPSLatitude[1].numerator /
                this.exifdata.GPSLatitude[1].denominator /
                60 +
              this.exifdata.GPSLatitude[2].numerator /
                this.exifdata.GPSLatitude[2].denominator /
                3600
            var Longtitude =
              this.exifdata.GPSLongitude[0].numerator /
                this.exifdata.GPSLongitude[0].denominator +
              this.exifdata.GPSLongitude[1].numerator /
                this.exifdata.GPSLongitude[1].denominator /
                60 +
              this.exifdata.GPSLongitude[2].numerator /
                this.exifdata.GPSLongitude[2].denominator /
                3600
            if (this.exifdata.GPSLatitudeRef == 'S') latitude *= -1
            if (this.exifdata.GPSLongitudeRef != 'E') longitude *= -1
          }
          if (latitude != '' && latitude != null) {
            self.$store.commit('profiles/setlongLat', [Longtitude, latitude])
            resolve({ latitude: latitude, longitude: Longtitude })
          } else {
            resolve()
          }
        })
      })
    },
    async addImage(e) {
      var arraytemp = Array.from(e.target.files)

      if (this.images.length + arraytemp.length > 4) {
        this.snackmsg = 'Max 4 images'
        this.snackbar = true
        arraytemp = arraytemp.slice(0, 4 - this.images.length)
      }
      arraytemp.forEach(file => {
        this.addImageLooped(file)
      })
    },
    async addImageLooped(file) {
      var self = this
      //Get the mata-data image info
      var imgInfo = await this.getImageInfo(file)
      console.log('resized')

      //resize the image
      var imgResized = await this.resizeImg(file, 1000)
      console.log('resized')
      //resize the image for upload
      var imgResizedUpload = await this.resizeImg(file, 600)
      console.log('resized for upload')
      //If this is the first image, set it as main
      var myimg = {
        src: imgResized,
        uploaded: false,
        img: imgResized,
        imgForUpload: imgResizedUpload,
        longlat: imgInfo,
        main: this.images.length == 0 ? true : false
      }
      console.log('object created')
      console.log(myimg)
      this.$store.dispatch('images/add', myimg)
      this.counter = this.images.length
    },
    showCropper() {
      this.dialog = true
      this.cropperImg = this.images[this.counter - 1].src
      try {
        this.$refs.cropper.replace(this.images[this.counter - 1].src)
        console.log('replaced')
      } catch (error) {
        console.log('find a way to fix this #1')
      }
    },
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.$store.dispatch('images/replace', {
        nr: this.counter - 1,
        imgForUpload: this.$refs.cropper.getCroppedCanvas().toDataURL()
      })
      this.dialog = false
    },
    rotate() {
      // guess what this does :)
      this.$refs.cropper.rotate(90)
    },
    loadImageObject(src) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = () => resolve({ i: img, h: img.height, w: img.width })
        img.onerror = reject
        img.src = URL.createObjectURL(src)
      })
    },
    async resizeImg(img, max) {
      //We schalen de afbeelding omlaag of naar een maximum aantal MB
      var myCanvas = this.$refs.canvas
      var ctx = myCanvas.getContext('2d')
      var data = await this.loadImageObject(img)

      var MAX_WIDTH = max
      var MAX_HEIGHT = max
      var width = data.w
      var height = data.h

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }
      myCanvas.width = width
      myCanvas.height = height

      ctx.drawImage(data.i, 0, 0, width, height)

      var dataurl = myCanvas.toDataURL()
      return dataurl
    },
    async upload() {
      var dataurl = this.resizeImg(this.images[this.counter - 1].img, 600)
      await this.onFilePicked(dataurl)
    },
    async onFilePicked(image) {
      console.log('startupload')
      let filename = image.name
      // await this.$store.dispatch('images/uploadImage',image,nr)
      // console.log(this.$store.images.images)
      this.$axios
        .post(
          // 'https://localhost:44352/api/FileUpload/savefile',
          'https://stray-watch-api.azurewebsites.net/api/FileUpload/savefile',
          {
            imgString: image,
            type: filename
          },
          {
            onUploadProgress: uploadEvent => {
              console.log(
                'uploaded: ' +
                  Math.round(uploadEvent.loaded / uploadEvent.total) * 100 +
                  '%'
              )
            }
          }
        )
        .then(response => {
          console.log(response.data.uri)
          console.log('laat zien dat ' + nr + ' is geupload')
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>