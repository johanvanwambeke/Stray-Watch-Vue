export const state = () => ({
 animal: '',
 age: '',
 needs: '',
 medical: '',
 urgency: '',
 behavior: '',
 info: '',
 longLat: [10, 10],
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
 },
 setProfile(state, payload) {
  state.animal = payload.animal
  state.age = payload.age
  state.needs = payload.needs
  state.medical = payload.medical
  state.urgency = payload.urgency
  state.behavior = payload.behavior
  state.infolongLat = payload.infolongLat
  state.longLat = payload.longLat

  console.log(state.animal)
 }
}

export const actions = {
 async getProfile({
  commit
 }, payload) {
  return new Promise((resolve, reject) => {

   this.$axios.get(
     // 'https://localhost:44352/api/AnimalProfile/get/' + payload , 
     'https://stray-watch-api.azurewebsites.net/api/AnimalProfile/get/' + payload,
    )
    .then((response) => {
     // console.log(response.data)
     commit('setProfile', response.data)
     resolve(response.data)
     commit('images/setImages', response.data.url, {
      root: true
     })
    })
    .catch((error) => {
     console.log(error);
    });

  })


 },
 async saveProfile({
  commit
 }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios.post(
     //  'https://localhost:44352/api/AnimalProfile/Create',
     'https://stray-watch-api.azurewebsites.net/api/AnimalProfile/Create/',
     payload)
    .then(result => resolve(result.data.id))
  })
 }
}
