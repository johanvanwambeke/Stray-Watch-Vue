export default async function({ app, store }) {
 console.log('smth')
 if (!app.$auth.loggedIn) {
  return
 }
 const auth = app.$auth

 const authStrategy = auth.strategy.name
 if (authStrategy === 'facebook' || authStrategy === 'google') {
  const token = auth.getToken(authStrategy).substr(7)
  await store.dispatch('user/loginAsGoogle', token)
 }
}
