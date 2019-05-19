import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDpTk_3y9ZLBmg_EV-9oDfbjeQQtpdQRDU",
    libraries: "places" // necessary for places input
  }
});