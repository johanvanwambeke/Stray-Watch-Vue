<template>
 <div id="demo-modal">
  <h2>Doka Modal</h2>

  <button @click="enabled = true">Show Modal</button>

  <DokaModal
   crop-aspect-ratio="1"
   :src="src"
   v-if="enabled"
   @confirm="handleDokaConfirm"
   @cancel="handleDokaCancel"
   @close="enabled = false"
  />

  <img v-if="result" :src="result" alt="" />
 </div>
</template>

<script>
import { DokaModal, toURL } from '~/vue-doka/'

export default {
 name: 'demo-modal',
 components: { DokaModal },
 data() {
  return {
   enabled: false,
   src:
    'https://images.unsplash.com/photo-1562887284-eb863165ebc8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
   result: null
  }
 },
 methods: {
  handleDokaConfirm(output) {
   console.log('Confirm crop!', output)
   this.src = toURL(output.file)
   this.result = toURL(output.file)
  },
  handleDokaCancel() {
   console.log('Cancel crop!')
  }
 }
}
</script>
