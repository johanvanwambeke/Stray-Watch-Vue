const pkg = require('./package.json')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

// export default {
module.exports = {
 mode: 'universal',
 env: {
  baseUrl: process.env.VUE_APP_BASE_URL,
  dev: process.env.VUE_APP_DEV || false
 },
 /*
  ** Headers of the page
  */
 head: {
  title: pkg.name,
  meta: [
   {
    charset: 'utf-8'
   },
   {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1'
   },
   {
    hid: 'description',
    name: 'description',
    content: pkg.description
   }
  ],
  link: [
   {
    rel: 'icon',
    type: 'image/x-icon',
    href: '/favicon.ico'
   },
   {
    rel: 'stylesheet',
    href:
     'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
   }
  ]
 },
 router: {
  routes: [
   {
    name: 'profile-id',
    path: '/profile/:id?',
    component: 'pages/profile/_id.vue'
   }
  ]
 },

 // PWA
 icon: {
  // Icon options
 },
 manifest: {
  name: 'Stray-Watch',
  description: 'collaborate on saving and suporting local stray animals',
  display: 'standalone',
  orientation: 'portrait',
  theme_color: '#2B7EC9'
 },
 /*
  ** Customize the progress-bar color
  */
 loading: {
  color: '#fff'
 },

 /*
  ** Global CSS
  */
 css: ['~/assets/style/app.styl'],

 /*
  ** Plugins to load before mounting the App
  */
 plugins: [
  '@/plugins/vuetify',
  '@/plugins/vue2-touch-events',
  '@/plugins/notifications',
  {
   src: '@/plugins/vue-fullscreen',
   ssr: false
  }
  // '@/plugins/vue2-google-maps'
 ],

 /*
  ** Nuxt.js modules
  */
 modules: [
  // Doc: https://axios.nuxtjs.org/usage
  '@nuxtjs/onesignal',
  '@nuxtjs/axios',
  'cookie-universal-nuxt',
  '@nuxtjs/dotenv',
  '@nuxtjs/pwa'
 ],

 //  Options
 oneSignal: {
  init: {
   appId: '6cb0060c-70d4-48bc-9b2e-7962017edb74',
   allowLocalhostAsSecureOrigin: true,
   welcomeNotification: {
    disable: true
   },
   // Use CDN
   cdn: true
   // Use any custom URL
   //  OneSignalSDK: 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
  }
 },
 /*
  ** Axios module configuration
  */
 axios: {
  // See https://github.com/nuxt-community/axios-module#options
  baseURL: 'https://localhost:44352/' //'https://stray-watch-api.azurewebsites.net/'
 },

 /*
  ** Build configuration
  */
 buildDir: 'nuxt',
 build: {
  transpile: ['vuetify/lib'],
  vendor: ['vue2-google-maps'],
  plugins: [new VuetifyLoaderPlugin()],
  loaders: {
   stylus: {
    import: ['~assets/style/variables.styl']
   }
  },
  /*
   ** You can extend webpack config here
   */
  extend(config, ctx) {}
 }
}
