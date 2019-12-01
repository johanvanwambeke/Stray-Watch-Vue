<template>
 <v-layout>
  <v-flex>
   <div v-for="(profile, i) in profiles" :key="i">
    <p>{{ profile.animal }}</p>
    <p>{{ profile.age }}</p>
   </div>
  </v-flex>
 </v-layout>
</template>

<script>
export default {
 data() {
  return {
   profiles: []
  }
 },
 mounted() {
  this.$store
   .dispatch('profiles/search')
   .then(res => {
    console.log(res)
    this.profiles = res
   })
   .catch(err => {
    console.log(err)
   })
 },
 methods: {
  search() {}
 }
}
</script>
