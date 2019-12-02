export const actions = {
 nuxtServerInit({ commit }) {
  const token = this.$cookies.get('token')
  this.$axios.setToken(token, 'Bearer')
  if (token) {
   commit('user/token', token)
  }
 }
}
