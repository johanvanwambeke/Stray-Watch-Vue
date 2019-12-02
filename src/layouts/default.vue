<template>
  <v-app light>
    <notifications group="foo" position="bottom right" />
    <v-content>
      <nuxt />
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
    // <link href="https://fonts.googleapis.com/css?family=Playfair+Display|Source+Sans+Pro:300,400&display=swap" rel="stylesheet">

    // script: [
    //   { src: 'https://unpkg.com/vue-picture-input' },
    //   { src: 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.js' },
    // ],
    link: [
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Playfair+Display|Source+Sans+Pro:300,400&display=swap'
      }
    ]
  },
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      items: [
        {
          icon: 'pets',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'supervisor_account',
          title: 'About',
          to: '/about'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Stray-Watch'
    }
  }
}
</script>
