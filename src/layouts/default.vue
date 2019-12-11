<template>
  <v-app light>
    <notifications group="foo" position="bottom right" />
    <v-container style="max-height:50px;">
      <v-layout rows wrap>
        <v-flex>
          <nuxt-link to="/profiles">List</nuxt-link>
          <!-- <nuxt-link to="/profile/create">Create</nuxt-link> -->
          <!-- <nuxt-link to="/" @click.native="create">Create</nuxt-link> -->
          <a @click="create">create</a>
          <nuxt-link to="/donate">Donate</nuxt-link>
          <div style="float:right">
            <nuxt-link v-if="loggedIn" to="/user">user</nuxt-link>
            <nuxt-link v-if="loggedIn" to="/login" @click.native="logout">logout</nuxt-link>
            <nuxt-link v-if="!loggedIn" to="/register">register</nuxt-link>
            <nuxt-link v-if="!loggedIn" to="/login">log in</nuxt-link>
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
  middleware: 'authGuard',
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
  },
  computed: {
    loggedIn() {
      return this.$store.state.user.token
    }
  },
  methods: {
    logout() {
      this.$cookies.remove('token')
      this.$store.commit('user/token', null)
    },
    create() {
      //create a new profile
      this.$store.dispatch('profiles/clear').then(x => {
        this.$store.dispatch('profiles/create').then(x => {
          this.$router.push('/profile/edit/' + x)
        })
      })
    }
  }
}
</script>
