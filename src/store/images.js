export const state = () => ({
 images: [],
 imagesWithLoc: []
})

export const getters = {
 images(state) {
  return state.images
 },
 imagesWithLoc(state) {
  return state.images.filter(x => x.longLat != null && x.longLat != '[10],[10]')
 }
}

export const mutations = {
 addImage(state, payload) {
  state.images.push(payload)
  state.imagesWithLoc = state.images
 },
 deleteImage(state, payload) {
  state.images.splice(payload, 1)
  state.imagesWithLoc = state.images
 },
 replaceImage(state, payload) {
  var myimage = state.images[payload.nr]
  myimage.src = payload.imgForUpload
  state.images.splice(payload.nr, 1, myimage)
  state.imagesWithLoc = state.images
 },
 setMainImage(state, payload) {
  state.images.forEach(function(entry) {
   entry.main = false
  })
  state.images[payload].main = true
 },
 setUrl(state, payload) {
  console.log(payload)
  console.log(state.images)
  var image = state.images.filter(x => x.guid == payload.guid)[0]
  if (image == null) return
  console.log(image)
  var index = state.images.indexOf(image)
  console.log(index)
  state.images[index].url = payload.url
  state.images[index].uploaded = true
 },
 setImages(state, payload) {
  console.log(payload)
  payload.forEach((element, i) => {
   if (state.images[i]) state.images[i].src = element
   else
    state.images.push({
     src: element
    })
  })
  console.log(state.images)
 },
 clear(state, payload) {
  state.images = []
 }
}

export const actions = {
 clear({ commit }) {
  commit('clear')
 },
 async add({ commit, state }, payload) {
  commit('addImage', payload)
 },
 async delete({ commit }, payload) {
  commit('deleteImage', payload)
 },
 async replace({ commit }, payload) {
  commit('replaceImage', payload)
 },
 async setMain({ commit }, payload) {
  commit('setMainImage', payload)
 },

 uploadImage({ commit, rootState }, payload) {
  return new Promise((resolve, reject) => {
   var obj = {
    imgString: payload.src,
    smth: 'tekst',
    AnimalProfileID: parseInt(payload.AnimalProfileID)
   }
   this.$axios
    .post(
     'api/Image/savefile',
     JSON.stringify(obj),
     {
      headers: {
       Authorization: 'Bearer ' + rootState.user.token,
       'Content-Type': 'application/json'
      }
     }
     // , {
     //  onUploadProgress: uploadEvent => {
     //   console.log(
     //    'uploaded: ' +
     //     Math.round(uploadEvent.loaded / uploadEvent.total) * 100 +
     //     '%'
     //   )
     //  }
     // }
    )
    .then(response => {
     console.log('success')
     console.log(response.data)
     commit('setUrl', {
      url: response.data.uri,
      guid: payload.image.guid
     })
     resolve('ok')
    })
    .catch(error => {
     console.log(error)
     reject('fail')
    })
  })
 }
}
