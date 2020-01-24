export const state = () => ({
 animal: '',
 birthday: '',
 info: '',
 longLat: [10, 10],
 profileId: '',
 chip: '',
 profile: null,
 speciesList: ['Cat', 'Dog', 'Bird', 'Livestock', 'Rodent', 'Other']
})

export const getters = {
 chip(state) {
  return state.chip
 },
 species(state) {
  return state.species
 },
 birthday(state) {
  return state.birthday
 },
 info(state) {
  return state.info
 },
 longLat(state) {
  return state.longLat
 },
 profileId(state) {
  return state.profileId
 }
}

export const mutations = {
 chip(state, payload) {
  state.chip = payload
 },
 species(state, payload) {
  state.species = payload
  console.log('animal updated ' + payload)
 },
 birthday(state, payload) {
  state.birthday = payload
 },
 setInfo(state, payload) {
  state.info = payload
 },
 profileId(state, payload) {
  state.profileId = payload
 },
 setlongLat(state, payload) {
  state.longLat = payload
  state.long = payload[0]
  state.lat = payload[1]
 },
 setProfile(state, payload) {
  state.species = payload.species
  state.info = payload.info
  state.profileId = payload.profileId
  state.chip = payload.chip
 }
}

export const actions = {
 async clear({ commit }) {
  commit('setProfile', {
   profileId: '',
   info: '',
   chip: ''
  })
  commit('setlongLat', [10, 10])
  commit('images/clear', null, {
   root: true
  })
 },
 async search({ commit, rootState }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios
    .post('api/Profile/search', JSON.stringify(payload), {
     headers: {
      // Authorization: 'Bearer ' + rootState.user.token,
      'Content-Type': 'application/json'
     }
    })

    .then(response => {
     resolve(response.data)
    })
    .catch(error => {
     commit('utils/snackmsg', error, {
      root: true
     })
     console.log(error)
    })
  })
 },
 async getMetaInfo({ commit }, payload) {
  return this.$axios.get('api/Profile/getMeta/' + payload).then(res => {
   return res.data
  })
 },
 async getProfile({ commit, rootState, https }, payload) {
  return new Promise((resolve, reject) => {
   const https = require('https')
   const agent = new https.Agent({
    rejectUnauthorized: false
   })
   this.$axios
    .get('api/Profile/get/' + payload, {
     headers: {
      // Authorization: 'Bearer ' + rootState.user.token
     },
     httpsAgent: agent
    })
    .then(res => {
     resolve(res.data)
     commit('setlongLat', [res.data.long, res.data.lat])
     commit('setProfile', res.data)
     commit('images/setImages', res.data.url, {
      root: true
     })
    })
    .catch(error => {
     console.log('fail')
     reject(error.response)
    })
  })
 },
 async create({ commit, rootState }, payload) {
  return new Promise((resolve, reject) => {
   var profile = {
    species: '',
    age: '',
    needs: '',
    medical: '',
    urgency: '',
    behavior: '',
    info: '',
    longLat: '',
    images64: []
   }
   this.$axios
    .post('api/profile/create', JSON.stringify(profile), {
     headers: {
      // Authorization: 'Bearer ' + rootState.user.token,
      'Content-Type': 'application/json'
     }
    })
    .then(result => resolve(result.data.id))
    .catch(err => {
     if (err.response.status == 401) {
      commit('utils/snackmsg', 'You have to log in before creating a profile', {
       root: true
      })
     } else {
      commit('utils/snackmsg', err, {
       root: true
      })
     }
    })
  })
 },
 async updateProfile({ commit, rootState }, payload) {
  if (payload.longLat != null) {
   var array = JSON.parse(payload.longLat)
   payload.long = array[0]
   payload.lat = array[1]
  }
  return new Promise((resolve, reject) => {
   this.$axios
    .post('api/profile/Update', JSON.stringify(payload), {
     headers: {
      'Content-Type': 'application/json'
     }
    })
    .then(result => resolve(result.data.id))
  })
 }
}
