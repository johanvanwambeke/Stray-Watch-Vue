<template>
  <v-layout rows wrap>
    <v-flex xs12>
      <div v-for="(profile, i) in profiles" :key="i" class="d-flex justify-center">
        <v-layout pa-2>
          <v-flex md8 xs12 class="d-flex align-stretch">
            <div class="profileDescription">
              <h1>{{ profile.age }} {{ profile.animal }}</h1>
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
      profiles: []
    }
  },
  filters: {
    twocomma: function(value) {
      return value.toFixed(2)
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
      this.$router.push({ path: `/profile/view/` + id })
    }
  }
}
</script>
