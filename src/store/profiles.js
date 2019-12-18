export const state = () => ({
 animal: '',
 age: '',
 needs: '',
 medical: '',
 urgency: '',
 behavior: '',
 info: '',
 longLat: [10, 10],
 profileId: '',
 chip: '',
 color: '',
 captureStatus: '',
 eartip: null,
 vaccinated: null,
 sterile: null,
 healthCheck: null
})

export const getters = {
 healthCheck(state) {
  return state.healthCheck
 },
 eartip(state) {
  return state.eartip
 },
 vaccinated(state) {
  return state.vaccinated
 },
 sterile(state) {
  return state.sterile
 },
 chip(state) {
  return state.chip
 },
 color(state) {
  return state.color
 },
 captureStatus(state) {
  return state.captureStatus
 },
 animal(state) {
  return state.animal
 },
 age(state) {
  return state.age
 },
 needs(state) {
  return state.needs
 },
 medical(state) {
  return state.medical
 },
 urgency(state) {
  return state.urgency
 },
 behavior(state) {
  return state.behavior
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
 healthCheck(state, payload) {
  state.healthCheck = payload
 },
 eartip(state, payload) {
  state.eartip = payload
 },
 vaccinated(state, payload) {
  state.vaccinated = payload
 },
 sterile(state, payload) {
  state.sterile = payload
 },
 chip(state, payload) {
  state.chip = payload
 },
 color(state, payload) {
  state.color = payload
 },
 captureStatus(state, payload) {
  state.captureStatus = payload
 },
 animal(state, payload) {
  state.animal = payload
  console.log('animal updated ' + payload)
 },
 age(state, payload) {
  state.age = payload
 },
 needs(state, payload) {
  state.needs = payload
 },
 medical(state, payload) {
  state.medical = payload
 },
 urgency(state, payload) {
  state.urgency = payload
 },
 behavior(state, payload) {
  state.behavior = payload
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
  state.animal = payload.animal
  state.age = payload.age
  state.needs = payload.needs
  state.medical = payload.medical
  state.urgency = payload.urgency
  state.behavior = payload.behavior
  state.info = payload.info
  state.profileId = payload.animalProfileId

  state.chip = payload.chip
  state.color = payload.color
  state.captureStatus = payload.captureStatus
  state.eartip = payload.eartip
  state.vaccinated = payload.vaccinated
  state.sterile = payload.sterile
  state.healthCheck = payload.healthCheck

  console.log(state.longlat)
 }
}

export const actions = {
 clear({ commit }) {
  commit('setProfile', {
   animal: '',
   age: '',
   needs: '',
   medical: '',
   urgency: '',
   behavior: '',
   profileId: '',
   info: '',

   chip: '',
   color: '',
   captureStatus: '',
   eartip: null,
   vaccinated: null,
   sterile: null
  })
  commit('setlongLat', [10, 10])
  commit('images/clear', null, {
   root: true
  })
 },

 async search({ commit, rootState }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios
    .post('api/AnimalProfile/search', JSON.stringify(payload), {
     headers: {
      Authorization: 'Bearer ' + rootState.user.token,
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
 async getProfile({ commit, rootState, https }, payload) {
  return new Promise((resolve, reject) => {
   const https = require('https')
   const agent = new https.Agent({
    rejectUnauthorized: false
   })
   this.$axios
    .get('api/AnimalProfile/get/' + payload, {
     headers: {
      Authorization: 'Bearer ' + rootState.user.token
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
    animal: '',
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
    .post('api/animalprofile/create', JSON.stringify(profile), {
     headers: {
      Authorization: 'Bearer ' + rootState.user.token,
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
 async saveProfile({ commit, rootState }, payload) {
  if (payload.longLat != null) {
   var array = JSON.parse(payload.longLat)
   payload.long = array[0]
   payload.lat = array[1]
  }
  return new Promise((resolve, reject) => {
   this.$axios
    .post('api/animalprofile/create', JSON.stringify(payload), {
     headers: {
      Authorization: 'Bearer ' + rootState.user.token,
      'Content-Type': 'application/json'
     }
    })
    .then(result => resolve(result.data.id))
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
    .post('api/animalprofile/Update', JSON.stringify(payload), {
     headers: {
      Authorization: 'Bearer ' + rootState.user.token,
      'Content-Type': 'application/json'
     }
    })
    .then(result => resolve(result.data.id))
  })
 }
}
