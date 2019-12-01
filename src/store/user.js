export const state = () => ({
 token: '',
})

export const getters = {
 token(state) {
  return state.token
 },
}

export const mutations = {
 token(state, payload) {
  this.$cookies.set("token", payload);
  state.token = payload
 },
}

export const actions = {
 async create({
  commit
 }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios
    .post('https://localhost:44352/api/users/create', JSON.stringify(payload), {
     headers: {
      'Content-Type': 'application/json'
     }
    })
    .then(res => {
     resolve(res.data.message);
    })
    .catch(error => {
     reject(error.response.data.message)
    })
  })
 },
 async login({
  commit
 }, payload) {
  return new Promise((resolve, reject) => {
   console.log(payload);
   this.$axios
    .post('https://localhost:44352/api/users/authenticate', JSON.stringify(payload), {
     headers: {
      'Content-Type': 'application/json'
     }
    })
    .then(res => {
     console.log(res);
     commit('token', res.data.token)
     resolve(res.data.message);
    })
    .catch(error => {
     console.log(error);
     reject(error.response.data.message)
    })
  })
 }

}
