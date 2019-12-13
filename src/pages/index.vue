<template>
 <v-layout rows wrap>
  <v-layout cols wrap>
   <v-flex xs6 md4 pa-2>
    <v-select
     clearable
     box
     v-model="animalFilter"
     :items="animalLst"
     label="Animal"
    ></v-select>
   </v-flex>
   <v-flex xs6 md4 pa-2>
    <v-select
     clearable
     box
     v-model="needsFilter"
     :items="needsLst"
     label="Purpose"
    ></v-select>
   </v-flex>
   <v-flex xs6 md4 pa-2>
    <v-switch color="black" v-model="myProfiles" label="My animals"></v-switch>
   </v-flex>
  </v-layout>
  <v-flex cols xs12></v-flex>
  <v-flex xs12>
   <div v-for="(profile, i) in profiles" :key="i" class="d-flex justify-center">
    <v-layout pa-2>
     <v-flex md8 xs12 class="d-flex align-stretch">
      <div class="profileDescription">
       <h1>{{ profile.animal }}</h1>
       <h3>{{ profile.needs }}</h3>
       <p style="color:light-gray">{{ profile.distance | twocomma }} Km</p>
       <v-btn @click="openProfile(profile.animalProfileId)">more</v-btn>
      </div>
     </v-flex>
     <v-flex md4 xs12 class="d-flex align-stretch">
      <img height="200" width="200" :src="profile.pic" />
     </v-flex>
    </v-layout>
   </div>
  </v-flex>
 </v-layout>
</template>
<style>
.profileDescription {
 background-color: rgb(68, 68, 68);
 padding: 20px;
 padding-left: 30px;
 color: white;
}
</style>
<script>
export default {
 data() {
  return {
   profiles: [],
   myProfiles: false,
   animalFilter: '',
   needsFilter: '',
   animalLst: ['cat', 'dog'],
   needsLst: [
    'fosterhome',
    'funding',
    'adoption',
    'finding new owner',
    'medical',
    'feeding',
    'driver'
   ]
  }
 },
 filters: {
  twocomma: function(value) {
   return value.toFixed(2)
  }
 },
 watch: {
  animalFilter() {
   this.search()
  },
  needsFilter() {
   this.search()
  },
  myProfiles() {
   this.search()
  }
 },
 mounted() {
  this.search()
 },
 methods: {
  search() {
   navigator.geolocation.getCurrentPosition(success => {
    console.log(success.coords.longitude)
    console.log(success.coords.latitude)
    var payload = {
     animal: this.animalFilter,
     needs: this.needsFilter,
     deviceLong: success.coords.longitude,
     deviceLat: success.coords.latitude,
     myprofiles: this.myProfiles
    }
    console.log(payload)

    this.$store
     .dispatch('profiles/search', payload)
     .then(res => {
      console.log(res)
      this.profiles = res
     })
     .catch(err => {
      console.log(err)
     })
   })
  },
  openProfile(id) {
   this.$router.push({ path: `/profile/view/` + id })
  }
 }
}
</script>
