export const state = () => ({
 healthStatus: '4',
 animalType: '',
 purpose: '',
 urgency: '',
 info: '',
 longLat: [10, 10],
 imageOK: false,
 locationOK: false,
 dataOK: false,
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
  state.dataOK =
   state.info != '' &&
   state.urgency != '' &&
   state.purpose != '' &&
   state.animalType != '' &&
   state.healthStatus != ''
 },
 setanimalType(state, payload) {
  state.animalType = payload
  state.dataOK =
   state.info != '' &&
   state.urgency != '' &&
   state.purpose != '' &&
   state.animalType != '' &&
   state.healthStatus != ''
 },
 setpurpose(state, payload) {
  state.purpose = payload
  state.dataOK =
   state.info != '' &&
   state.urgency != '' &&
   state.purpose != '' &&
   state.animalType != '' &&
   state.healthStatus != ''
 },
 seturgency(state, payload) {
  state.urgency = payload
  state.dataOK =
   state.info != '' &&
   state.urgency != '' &&
   state.purpose != '' &&
   state.animalType != '' &&
   state.healthStatus != ''
 },
 setinfo(state, payload) {
  state.info = payload
  state.dataOK =
   state.info != '' &&
   state.urgency != '' &&
   state.purpose != '' &&
   state.animalType != '' &&
   state.healthStatus != ''
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
 async getProfile({
  commit
 }, payload) {
  var result = await this.$axios.get(
   // 'https://localhost:44352/api/AnimalProfile/get/' + this.$route.query.id , 
   'https://stray-watch-api.azurewebsites.net/api/AnimalProfile/get/' + payload,
  )
  return result.data
 },
}
