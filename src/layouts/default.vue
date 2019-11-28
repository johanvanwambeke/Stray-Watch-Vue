<template>
  <v-app light class="appcss">
    <notifications group="foo" position="bottom right" />
    <!-- <v-toolbar :clipped-left="clipped" fixed app color="#6FCDC7">
      <v-toolbar-items style="margin-left:auto;margin-right:auto;">

        <v-btn to="/profile" nuxt flat>CREATE</v-btn>
        <v-btn to="/" nuxt flat>ABOUT US</v-btn>
        <v-btn to="/donate" nuxt flat>DONATE</v-btn>
      </v-toolbar-items>
    </v-toolbar>-->
    <v-content>
      <!-- <v-container> -->
      <!-- class="backgroundImage" -->
      <div>
        <div class="maxwidth">
          <nuxt />
        </div>
      </div>
      <!-- </v-container> -->
    </v-content>
    <!-- <v-footer
      :fixed="fixed"
      app
    >
    <span>&copy; Stray-Watch 2019</span>
    </v-footer>-->
  </v-app>
</template>
<style scoped>
.backgroundImage {
  background: #314755; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #26a0da,
    #314755
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #26a0da,
    #314755
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.maxwidth {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  min-height: 100vh;
}

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
