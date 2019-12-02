<template>
 <v-layout>
  <v-flex>
   <h1>FileIploader</h1>
   <file-pond
    name="test"
    ref="pond"
    class-name="my-pond"
    maxFiles="3"
    label-idle="Drop files here..."
    allow-multiple="true"
    accepted-file-types="image/jpeg, image/png"
    v-bind:files="myFiles"
    v-on:init="handleFilePondInit"
    instantUpload="true"
   />
  </v-flex>
 </v-layout>
</template>
<style>
.filepond--item {
 width: calc(50% - 0.5em);
}
/* the text color of the drop label*/
.filepond--drop-label {
 color: #555;
}
</style>
<script>
// Import FilePond
import vueFilePond, { setOptions } from 'vue-filepond'

// Import plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js'

// Import styles
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
const FilePond = vueFilePond(
 FilePondPluginFileValidateType,
 FilePondPluginImagePreview
)

setOptions({
 imageResizeTargetWidth: 150,
 imageResizeTargetHeight: 150,
 server: {
  url: 'https://localhost:44352',
  timeout: 7000,
  process: (
   fieldName,
   file,
   metadata,
   load,
   error,
   progress,
   abort,
   transfer,
   options
  ) => {},
  revert: './revert',
  restore: './restore/',
  load: './load/',
  fetch: './fetch/'
 }
})

export default {
 name: 'app',
 data: function() {
  return { myFiles: [] }
 },
 methods: {
  handleFilePondInit: function() {
   console.log('FilePond has initialized')

   // example of instance method call on pond reference
   this.$refs.pond.getFiles()
  }
 },
 components: {
  FilePond
 }
}
</script>
