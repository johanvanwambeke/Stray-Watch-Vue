export default function({ store, redirect, route, app, commit }) {
 if (
  route.fullPath.includes('/profile/edit') ||
  route.fullPath.includes('/profile/user')
 ) {
  if (!store.state.auth) {
   return redirect('/login')
  }
 }
}
