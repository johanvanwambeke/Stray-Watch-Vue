export const state = () => ({
 animal: '',
 age: '',
 needs: '',
 medical: '',
 urgency: '',
 behavior: '',
 info: '',
 longLat: [10, 10],
 long: '',
 lat: ''
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
 setlongLat(state, payload) {
  state.longLat = payload
  state.long = payload.long
  state.lat = payload.lat
 },
 setProfile(state, payload) {
  state.animal = payload.animal
  state.age = payload.age
  state.needs = payload.needs
  state.medical = payload.medical
  state.urgency = payload.urgency
  state.behavior = payload.behavior
  // state.longLat = payload.longLat

  console.log(state.animal)
 }
}

export const actions = {
 async search({ commit, rootState }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios
    .get('api/AnimalProfile/search', {
     headers: {
      Authorization: 'Bearer ' + rootState.user.token
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
   this.$axios
    .get('api/AnimalProfile/get/' + payload, {
     headers: {
      Authorization: 'Bearer ' + rootState.user.token
     }
    })
    .then(response => {
     console.log(response.data)
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
 async saveProfile({ commit, rootState }, payload) {
  console.log(payload)
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
 }
}
