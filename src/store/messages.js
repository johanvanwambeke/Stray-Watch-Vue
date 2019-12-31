export const actions = {
 async get({ commit, rootState }, payload) {
  return new Promise((resolve, reject) => {
   console.log(payload)
   this.$axios
    .get('api/messages/get/' + payload, {
     //  headers: {
     //   Authorization: 'Bearer ' + rootState.user.token
     //  }
    })
    .then(ress => {
     resolve(ress.data)
    })
    .catch(error => {
     console.log(error)
    })
  })
 },
 async create({ commit, rootState }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios
    .post('api/messages/create', JSON.stringify(payload), {
     headers: {
      // Authorization: 'Bearer ' + rootState.user.token,
      'Content-Type': 'application/json'
     }
    })
    .then(result => resolve())
    .catch(err => console.log(err))
  })
 }
}
