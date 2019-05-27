import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: '#66A39E',
    accent: '#E5897A',
    secondary: '#E28D8C',
    info: colors.teal.lighten1,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3
  },
  // theme:{
  //   primary: '#009688',
  //   secondary: '#e91e63',
  //   accent: '#ffc107',
  //   error: '#f44336',
  //   warning: '#ff5722',
  //   info: '#00bcd4',
  //   success: '#4caf50'
  //   }
})
