const pkg = require('./package.json')
require('dotenv').config()

// export default {
module.exports = {
 mode: 'universal',
 debug: true,
 env: {
  baseUrl: process.env.VUE_APP_BASE_URL,
  dev: process.env.VUE_APP_DEV || false
 },

 buildModules: [
  // Simple usage
  '@nuxtjs/vuetify'
 ],

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
  name: 'Stray-Hero',
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
  ** Plugins to load before mounting the App
  */
 plugins: [
  '@/plugins/vuetify',
  '@/plugins/notifications',

  {
   src: '@/plugins/vue-fullscreen',
   ssr: false
  },
  {
   src: '@/plugins/nuxt-client-init',
   ssr: false
  }
 ],

 /*
  ** Nuxt.js modules
  */
 modules: [
  // Doc: https://axios.nuxtjs.org/usage
  // '@nuxtjs/onesignal',
  '@nuxtjs/axios',
  '@nuxtjs/auth',
  'cookie-universal-nuxt',
  '@nuxtjs/dotenv',
  '@nuxtjs/pwa'
 ],

 auth: {
  plugins: [
   {
    src: '@/plugins/signalr',
    ssr: false
   },
   {
    src: '@/plugins/socialtolocal',
    ssr: true
   }
  ],

  strategies: {
   local: {
    endpoints: {
     login: {
      url: 'api/users/authenticate',
      method: 'post',
      propertyName: 'token'
     },
     logout: false,
     user: { url: '/api/users/get', method: 'get', propertyName: false }
    }
   },
   google: {
    client_id: process.env.GOOGLE_API
   }
  },
  redirect: {
   login: {
    url: 'api/users/authenticate',
    method: 'post',
    propertyName: 'token'
   },
   logout: false,
   user: { url: '/api/users/get', method: 'get', propertyName: false },
   callback: '/login',
   home: '/'
  }
 },

 //  Options
 //  oneSignal: {
 //   init: {
 //    appId: '6cb0060c-70d4-48bc-9b2e-7962017edb74',
 //    allowLocalhostAsSecureOrigin: true,
 //    welcomeNotification: {
 //     disable: true
 //    },
 //    // Use CDN
 //    cdn: true
 //    // Use any custom URL
 //    //  OneSignalSDK: 'https://cdn.onesignal.com/sdks/OneSignalSDK.js'
 //   }
 //  },
 /*
  ** Axios module configuration
  */
 axios: {
  baseURL: 'https://stray-watch-api.azurewebsites.net/' //'https://localhost:44352/' //'https://stray-watch-api.azurewebsites.net/'
 },

 /*
  ** Build configuration
  */
 buildDir: 'nuxt',
 build: {
  transpile: ['vuetify/lib'],
  // plugins: [new VuetifyLoaderPlugin()],

  extend(config, ctx) {}
 }
}
