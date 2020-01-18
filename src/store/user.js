export const state = () => ({
 token: '',
 username: '',
 userfollowsAlert: []
})

export const getters = {
 token(state) {
  return state.token
 },
 username(state) {
  return state.username
 },
 userfollowsAlert(state) {
  return state.userfollowsAlert
 }
}

export const mutations = {
 token(state, payload) {
  this.$cookies.set('token', payload)
  state.token = payload
 },
 username(state, payload) {
  state.username = payload
 },
 userfollowsAlert(state, payload) {
  var result = state.userfollowsAlert.filter(obj => {
   return obj.profileID === payload.profileID
  })
  console.log(result.length === 0)
  if (result.length === 0) state.userfollowsAlert.push(payload)
 },
 userfollowsAlertRemove(state, payload) {
  console.log(payload)
  state.userfollowsAlert.pop(payload)
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
 async newAlert({ commit }, payload) {
  commit('userfollowsAlert', payload)
 },
 async me({ rootState, commit }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios
    .get('api/users/get')
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
 async follow({ rootState, commit }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios
    .post(
     payload.follow ? 'api/userfollow/remove' : 'api/userfollow/create',
     JSON.stringify(payload),
     {
      headers: {
       'Content-Type': 'application/json'
      }
     }
    )
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
 async removeAlert({ rootState, commit }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios
    .post('api/userfollow/removeAlert', JSON.stringify(payload), {
     headers: {
      'Content-Type': 'application/json'
     }
    })
    .then(res => {
     commit('userfollowsAlertRemove', payload)
    })
    .catch(error => {
     commit('utils/snackmsg', error, {
      root: true
     })
    })
  })
 },
 setToken({ commit }, payload) {
  commit('token', payload)
 }
}
