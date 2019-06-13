export const state = () => ({
 healthStatus: '4',
 animalType: '',
 purpose: '',
 urgency: '',
 info: '',
 longLat: [],
})

export const getters = {
 healthStatus(state) {
  return state.healthStatus
 },
 animalType(state) {
  return state.animalType
 },
 purpose(state) {
  return state.purpose
 },
 urgency(state) {
  return state.urgency
 },
 info(state) {
  return state.info
 },
 longLat(state) {
  return state.longLat
 },
}

export const mutations = {
 setprofile(state, payload) {
  state.healthStatus = payload.healthStatus
  state.animalType = payload.animalType
  state.purpose = payload.purpose
  state.urgency = payload.urgency
  state.info = payload.info
  state.longLat = payload.longLat
 },
 sethealthStatus(state, payload) {
  state.healthStatus = payload
 },
 setanimalType(state, payload) {
  state.animalType = payload
 },
 setpurpose(state, payload) {
  state.purpose = payload
 },
 seturgency(state, payload) {
  state.urgency = payload
 },
 setinfo(state, payload) {
  state.info = payload
 },
 setlongLat(state, payload) {
  state.longLat = payload
  console.log(state.longLat)
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
 async getProfile({
  commit
 }, payload) {
  var result = await this.$axios.get(
   // 'https://localhost:44352/api/AnimalProfile/get/' + this.$route.query.id , 
   'https://stray-watch-api.azurewebsites.net/api/AnimalProfile/get/' + payload,
  )
  return result.data
 },
//  async updateCoordinates({
//   commit
//  }, payload) {
//   commit('longLat', payload)
//  }
}
