export const state = () => {
 return {
  auth: null
 }
}
export const mutations = {
 setAuth(state, auth) {
  console.log('auth is set', auth)
  state.auth = auth
 }
}
export const actions = {
 setAuth({ commit }, payload) {
  commit('setAuth', payload)
 },
 nuxtServerInit({ commit }, { req }) {
  //   if (req.headers.cookie) {
  //    console.log(req.headers.cookie)
  //    if (
  //     req.headers.cookie.includes('token') &&
  //     !req.headers.cookie.includes('token=null')
  //    ) {
  //     commit('setAuth', 'TempSolution')
  //    } else {
  //     commit('setAuth', null)
  //    }
  //   }
 },
 nuxtClientInit({ commit, $store }, { app }) {
  const token = this.$cookies.get('token')
  //   commit('setAuth', token)
  app.$axios.onRequest(config => {
   if (token) {
    config.headers.common['Authorization'] = `Bearer ${token}`
   }
  })
 }
}
