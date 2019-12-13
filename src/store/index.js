export const actions = {
 nuxtServerInit({ commit }) {
  console.log('nuxtServerInit')
  const token = this.$cookies.get('token')
  console.log(token)
  this.$axios.setToken(token, 'Bearer')
  if (token) {
   commit('user/token', token)
  }
 }
}
