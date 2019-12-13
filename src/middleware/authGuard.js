export default function({ store, redirect, route }) {
 //als het een van deze pagina's is moet je naar login sturen:
 if (route.fullPath.includes('/profile/edit')) {
  if (!store.state.user.token) {
   return redirect('/login')
  }
 }
}
