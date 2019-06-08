<template>
  <v-app light>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
      color = "#6FCDC7" 
    >    
    <v-toolbar-items style="margin-left:auto;margin-right:auto;">
    <!-- <nuxt-link to="/profile">CREATE</nuxt-link> -->
    
    <v-btn to="/profile" nuxt flat>CREATE</v-btn>
    <v-btn to="/" nuxt flat>ABOUT US</v-btn>
    <v-btn to="/donate" nuxt flat >DONATE</v-btn>
    </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
    <span>&copy; Stray-Watch 2019</span>
    </v-footer>
  </v-app>
</template>
<style scoped>

.v-btn{
  color:rgb(255, 255, 255)!important;
  font-size: 14px;
  padding: 0px 25px;
}
.v-btn:hover{
  color:rgb(107, 107, 107)!important;
  font-size: 14px ;
  border-bottom:5px solid rgb(107, 107, 107);
}
.v-btn--active{
  color:rgb(107, 107, 107)!important;
  font-size: 14px ;
  border-bottom:5px solid rgb(107, 107, 107);
}

</style>

<script>
export default {
  methods:{
    goTo(link){      
        this.$router.push({ path: `/`+link })
    }
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
