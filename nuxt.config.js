import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from './package'

export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  //dynamic routes
  // generate: {
  //   routes: [
  //     '/profile/13',
  //     '/profile/14',
  //     '/profile/15',
  //     '/profile/16',
  //     '/profile/17',
  //     '/profile/18',
  //     '/profile/19',
  //     '/profile/20',
  //     '/profile/21',
  //     '/profile/22',
  //     '/profile/23',
  //     '/profile/24',
  //     '/profile/25',
  //     '/profile/26',
  //     '/profile/27',
  //   ]
  //   // routes: function () {
  //   //   return axios.get('https://stray-watch-api.azurewebsites.net/api/AnimalProfile/get/')
  //   //   .then((res) => {
  //   //     return res.data.map((user) => {
  //   //       return '/profile/' + user.id
  //   //     })
  //   //   })
  // },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    // '@/plugins/vue2-google-maps'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    vendor:['vue2-google-maps'],
    plugins: [
      new VuetifyLoaderPlugin()
      ],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
  }
}
