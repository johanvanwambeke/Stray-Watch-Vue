export const state = () => ({
 images: []
})

export const getters = {
 images(state) {
  return state.images
 }
}

export const mutations = {
 addImage(state, payload) {
  state.images.push(payload)
 },
 removeImage(state, payload) {
  state.images.splice(payload, 1)
 },
 replaceImage(state, payload) {
  var myimage = state.images[payload.nr]
  myimage.src = payload.imgForUpload
  state.images.splice(payload.nr, 1, myimage)
 },
 updateImageId(state, payload) {
  var image = state.images.filter(x => x.guid == payload.guid)[0]
  if (image == null) return
  var index = state.images.indexOf(image)
  state.images[index].imageId = payload.imageId
  state.images[index].uploaded = true
  console.log(state.images)
 },
 setImages(state, payload) {
  state.images = payload
 }
}

export const actions = {
 async add({ commit, state }, payload) {
  commit('addImage', payload)
 },
 async delete({ commit }, payload) {
  commit('deleteImage', payload)
 },
 deleteFs({ commit, rootState }, payload) {
  console.log('payload deletefs', payload)
  this.$axios
   .post('api/Image/deletefile', JSON.stringify(payload), {
    headers: {
     'Content-Type': 'application/json'
    }
   })
   .then(response => {})
   .catch(error => {})
 },
 async setMain({ commit, rootState }, payload) {
  console.log(payload)
  this.$axios
   .post('api/Image/setmain', JSON.stringify(payload), {
    headers: {
     'Content-Type': 'application/json'
    }
   })
   .then(response => {
    console.log('success')
   })
   .catch(error => {
    console.log('fail')
   })
 },
 async replace({ commit }, payload) {
  commit('replaceImage', payload)
 },
 uploadImage({ commit, rootState }, payload) {
  return new Promise((resolve, reject) => {
   console.log(payload)
   var obj = {
    Base64: payload.src,
    ProfileID: payload.ProfileId
   }
   this.$axios
    .post('api/Image/savefile', JSON.stringify(payload), {
     headers: {
      'Content-Type': 'application/json'
     }
    })
    .then(response => {
     resolve('ok')
    })
    .catch(error => {
     reject('fail')
    })
  })
 }
}
