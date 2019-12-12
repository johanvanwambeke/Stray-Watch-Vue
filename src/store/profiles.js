export const state = () => ({
 animal: '',
 age: '',
 needs: '',
 medical: '',
 urgency: '',
 behavior: '',
 info: '',
 longLat: [10, 10],
 profileId: ''
})

export const getters = {
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
  console.log('setting longlat')
  console.log(payload)
  state.longLat = payload
  state.long = payload[0]
  state.lat = payload[1]
 },
 setProfile(state, payload) {
  console.log('setProfile')
  console.log(payload)
  state.animal = payload.animal
  state.age = payload.age
  state.needs = payload.needs
  state.medical = payload.medical
  state.urgency = payload.urgency
  state.behavior = payload.behavior
  state.info = payload.info
  state.profileId = payload.animalProfileId

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
   info: ''
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
     console.log(error)
    })
  })
 },
 async getProfile({ commit, rootState }, payload) {
  return new Promise((resolve, reject) => {
   console.log(payload)
   this.$axios
    .get('api/AnimalProfile/get/' + payload, {
     headers: {
      Authorization: 'Bearer ' + rootState.user.token
     }
    })
    .then(response => {
     console.log(response.data)
     commit('setlongLat', [response.data.long, response.data.lat])
     commit('setProfile', response.data)
     resolve(response.data)
     commit('images/setImages', response.data.url, {
      root: true
     })
    })
    .catch(error => {
     console.log(error)
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
