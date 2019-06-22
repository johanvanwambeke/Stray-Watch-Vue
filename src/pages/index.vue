<template>
  <iframe src="https://stray-watch.com"></iframe>
</template>
<style scoped>
iframe {
  width: 100%;
  height: 100%;
}
</style>

<script>
export default {
  head: {
    // script: [
    //   { src: 'https://unpkg.com/vue-picture-input' },
    //   { src: 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js' },
    // ],
    // link: [
    //   { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto' }
    // ]
  },
  data() {
    return {
      search: ''
    }
  },
  methods: {
    submit(event) {
      this.$router.push(`profile/${this.search}`)
    },
    onChange(image) {
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
  }
}
</script>
