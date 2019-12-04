<template>
 <v-app light>
  <notifications group="foo" position="bottom right" />
  <v-container style="max-height:50px;">
   <v-layout rows wrap>
    <v-flex>
     <nuxt-link to="/profiles">List</nuxt-link>
     <nuxt-link to="/profile/edit">Create</nuxt-link>
     <nuxt-link to="/donate">Donate</nuxt-link>
     <div style="float:right">
      <nuxt-link to="/user">user</nuxt-link>
      <nuxt-link to="/register">register</nuxt-link>
      <nuxt-link to="/login">login</nuxt-link>
     </div>
     <v-divider></v-divider>
    </v-flex>
   </v-layout>
  </v-container>

  <v-content>
   <v-container>
    <nuxt />
   </v-container>
  </v-content>
 </v-app>
</template>
<style scoped>
h1 {
 font-family: 'Playfair Display', serif;
}
.v-btn {
 color: rgb(255, 255, 255) !important;
 font-size: 14px;
 padding: 0px 25px;
}
.v-btn:hover {
 color: rgb(107, 107, 107) !important;
 font-size: 14px;
 border-bottom: 5px solid rgb(107, 107, 107);
}
.v-btn--active {
 color: rgb(107, 107, 107) !important;
 font-size: 14px;
 border-bottom: 5px solid rgb(107, 107, 107);
}

.appcss {
 background-image: linear-gradient(
  to bottom,
  #ffffff 0%,
  #d2d2d2 100%
 ) !important;
}
</style>

<script>
export default {
 methods: {
  goTo(link) {
   this.$router.push({ path: `/` + link })
  }
 },
 head: {
  link: [
   {
    rel: 'stylesheet',
    href:
     'https://fonts.googleapis.com/css?family=Playfair+Display|Source+Sans+Pro:300,400&display=swap'
   }
  ]
 },
 data() {
  return {}
 }
}
</script>
