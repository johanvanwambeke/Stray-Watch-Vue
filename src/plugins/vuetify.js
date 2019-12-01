import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'
import 'assets/css/animate.css'

Vue.use(Vuetify, {
 theme: {
  primary: '#2B7EC9',
  accent: '#3DB549',
  secondary: '#B4D2EE',
  info: colors.teal.lighten1,
  warning: colors.amber.base,
  error: colors.deepOrange.accent4,
  success: colors.green.accent3
 },
})
