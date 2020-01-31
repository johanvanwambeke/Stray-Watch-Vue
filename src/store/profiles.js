export const state = () => ({
 profile: {
  species: null,
  info: null,
  chip: null,
  long: 10,
  lat: 10,
  follow: 0
 },
 speciesList: ['Cat', 'Dog', 'Bird', 'Livestock', 'Rodent', 'Other'],
 profiles: []
})

import moment from 'moment'
// export const getters = {
//  getBirthdate(state) {
//   return new moment(state.profile.birthDay).startOf('day')
//  }
// }

export const mutations = {
 setProfiles(state, payload) {
  state.profiles = payload
 },
 setProfile(state, payload) {
  payload.birthday = moment(payload.birthday).format('YYYY-MM-DD')
  state.profile = payload
 },
 setSpecies(state, payload) {
  state.profile.species = payload === undefined ? null : payload
 },
 setInfo(state, payload) {
  state.profile.info = payload
 },
 setChip(state, payload) {
  state.profile.chip = payload
 },
 setName(state, payload) {
  state.profile.name = payload
 },
 setBirthday(state, payload) {
  state.profile.birthday = payload
 },
 setSex(state, payload) {
  state.profile.sex = payload
 },
 setlongLat(state, payload) {
  state.profile.long = payload[0]
  state.profile.lat = payload[1]
 },
 setFollow(state, payload) {
  state.profile.follow = payload
 },
 setFollowInList(state, payload) {
  state.profiles.filter(x => x.profileId === payload.profileId)[0].follow =
   payload.follow
 }
}

export const actions = {
 async search({ state, commit }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios
    .post('api/Profile/search', JSON.stringify(payload), {
     headers: {
      'Content-Type': 'application/json'
     }
    })
    .then(res => {
     commit('setProfiles', res.data)
     resolve(res.data)
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
 async getProfile({ commit, state, rootstate }, payload) {
  return new Promise((resolve, reject) => {
   const https = require('https')
   const agent = new https.Agent({
    rejectUnauthorized: false
   })

   if (parseInt(payload) === parseInt(state.profile.profileId)) {
    console.log('Do not get new profile')
    //set the profile to the profile from the list
    //same with images
    resolve(null)
    return
   }
   commit('images/setImages', [], {
    root: true
   })

   this.$axios
    .get('api/Profile/get/' + payload, {
     headers: {},
     httpsAgent: agent
    })
    .then(res => {
     console.log('incomming profile', res.data)
     commit('setProfile', res.data)
     resolve(res.data)
     //  commit('setlongLat', [res.data.long, res.data.lat])
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
 async create({ commit }, payload) {
  return new Promise((resolve, reject) => {
   var profile = {
    species: '',
    info: '',
    longLat: ''
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
 async updateProfile({ state }) {
  return new Promise((resolve, reject) => {
   this.$axios
    .post('api/profile/Update', JSON.stringify(state.profile), {
     headers: {
      'Content-Type': 'application/json'
     }
    })
    .then(result => resolve(result.data.id))
  })
 }
}
