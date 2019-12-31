export const state = () => ({
 token: '',
 username: ''
})

export const getters = {
 token(state) {
  return state.token
 },
 username(state) {
  return state.username
 }
}

export const mutations = {
 token(state, payload) {
  this.$cookies.set('token', payload)
  state.token = payload
 },
 username(state, payload) {
  state.username = payload
 }
}

export const actions = {
 async create({ commit }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios
    .post('api/users/create', JSON.stringify(payload), {
     headers: {
      'Content-Type': 'application/json'
     }
    })
    .then(res => {
     resolve(res.data.message)
    })
    .catch(error => {
     reject(error.response.data.message)
    })
  })
 },
 async login({ commit }, payload) {
  return new Promise((resolve, reject) => {
   console.log(payload)
   this.$axios
    .post('api/users/authenticate', JSON.stringify(payload), {
     headers: {
      'Content-Type': 'application/json'
     }
    })
    .then(res => {
     console.log('result', res.data.token)
     var token = res.data.token
     this.$axios.onRequest(config => {
      config.headers.common['Authorization'] = `Bearer ${token}`
     })
     commit('setAuth', token, {
      root: true
     })

     commit('token', res.data.token)
     this.$axios.setToken(res.data.token, 'Bearer')
     resolve(res.data.message)
    })
    .catch(error => {
     console.log(error)
     reject(error.response.data.message)
    })
  })
 },
 async me({ rootState, commit }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios
    .get('api/users/get', {
     //  headers: {
     //   Authorization: 'Bearer ' + rootState.user.token
     //  }
    })
    .then(res => {
     resolve(res.data)
    })
    .catch(error => {
     commit('utils/snackmsg', error, {
      root: true
     })
     console.log(error)
     reject(error.response.data.message)
    })
  })
 },
 setToken({ commit }, payload) {
  commit('token', payload)
 }
}
