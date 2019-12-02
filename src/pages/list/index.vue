<template>
 <v-layout rows wrap>
  <v-flex xs12>
   <nuxt-link to="profile/edit">Create</nuxt-link>
  </v-flex>
  <v-flex xs12>
   <div v-for="(profile, i) in profiles" :key="i">
    <v-card>
     <v-flex>
      <p>{{ profile.animal }}</p>
      <p>{{ profile.distance }}</p>
      <img height="200" width="200" :src="profile.pic" />
      <v-btn @click="openProfile(profile.animalProfileId)">more</v-btn>
     </v-flex>
    </v-card>
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
  search() {},
  openProfile(id) {
   this.$router.push({ path: `/profile/` + id })
  }
 }
}
</script>
