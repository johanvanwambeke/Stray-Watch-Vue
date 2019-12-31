export default function({ store, redirect, route, app, commit }) {
 if (
  app.$axios.defaults != null &&
  app.$axios.defaults.headers != null &&
  app.$axios.defaults.headers.common != null &&
  app.$axios.defaults.headers.common.cookie != null
 ) {
  var tokenpresent = app.$axios.defaults.headers.common.cookie
   .toString()
   .includes('token=ey')
  if (tokenpresent) {
   store.dispatch('setAuth', 'getsome', {
    root: true
   })
  } else {
   store.dispatch('setAuth', null, {
    root: true
   })
  }
 }

 console.log('token', tokenpresent)

 if (
  route.fullPath.includes('/profile/edit') ||
  route.fullPath.includes('/profile/user')
 ) {
  if (!store.state.auth) {
   return redirect('/login')
  }
 }
}
