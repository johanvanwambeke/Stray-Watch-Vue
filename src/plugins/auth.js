export default async function({ app }) {
 console.log('auth module')
 if (!app.$auth.loggedIn) {
  return
 }
 const auth = app.$auth

 const authStrategy = auth.strategy.name
 if (authStrategy === 'facebook' || authStrategy === 'google') {
  console.log('social token <-> local token')
  const token = auth.getToken(authStrategy).substr(7)

  if (authStrategy === 'google') {
   var url = `api/users/googleauthenticate?token=${token}`
   console.log('google token <-> local token')
  }
  if (authStrategy === 'facebook') {
   url = `api/users/FacebookAuthenticate?token=${token}`
   console.log('fb token <-> local token')
  }

  try {
   app.$axios.$post(url, null).then(res => {
    auth.setToken('local', 'Bearer ' + res.token)
    setTimeout(async () => {
     auth.setStrategy('local')
     console.log(auth.user)
     setTimeout(async () => {
      await auth.fetchUser()
      console.log(auth.user)
     })
    })
   })
  } catch (e) {
   console.log(e)
  }
 }
}
