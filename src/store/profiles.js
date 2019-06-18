export const state = () => ({
 animal: '',
 age: '',
 needs: '',
 medical: '',
 urgency: '',
 behavior: '',
 info: '',
 longLat: [10, 10],
 imageOK: false,
 locationOK: false,
 dataOK: false,
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
 imageOK(state) {
  return state.imageOK
 },
 locationOK(state) {
  return state.locationOK
 },
 dataOK(state) {
  return state.dataOK
 },
}

export const mutations = {
  animal(state, payload) {
   state.animal = payload
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
  info(state,payload){
    state.info = payload
  },
 setlongLat(state, payload) {
  state.longLat = payload
  console.log(state.longLat)
 },
 setImageOK(state, context) {
  state.imageOK = context.rootState.images.images.length != 0;
 },
 setLocationOK(state) {
  state.locationOK = state.longLat != []
 },
}

export const actions = {
 async getProfileLoad({
  commit
 }, payload) {
  commit('isLoading')
  console.log('getprofile: ' + payload);
  this.$axios.get(
    // 'https://localhost:44352/api/AnimalProfile/get/' + this.$route.query.id , 
    'https://stray-watch-api.azurewebsites.net/api/AnimalProfile/get/' + payload,
   )
   .then((response) => {
    commit('setProfile', response.data)
   })
   .catch((error) => {
    console.log(error);
   });

  commit('completedLoading')
 },
 async getProfile({  commit }, payload) {
  var result = await this.$axios.get(
   // 'https://localhost:44352/api/AnimalProfile/get/' + this.$route.query.id , 
   'https://stray-watch-api.azurewebsites.net/api/AnimalProfile/get/' + payload,
  )
  return result.data
 },
 async saveProfile({  commit }, payload) {
  return new Promise((resolve, reject) => {
    this.$axios.post(
      // 'https://localhost:44352/api/AnimalProfile/Create',
      'https://stray-watch-api.azurewebsites.net/api/AnimalProfile/Create/',
      payload)
      .then(result=>resolve(result.data.id))
  })
 }
}
