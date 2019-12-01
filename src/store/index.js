export const actions = {
 nuxtServerInit({
  commit,
 }) {
  const token = this.$cookies.get('token')
  //   console.log('Nuxt init: ', token)

  if (token) {
   commit('user/token', token)
  }
 },
}
