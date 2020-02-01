export const state = () => ({
 images: [
  {
   url:
    'https://straywatchfotos.blob.core.windows.net/animalfotos/f70ca393-88d0-44f8-9d75-d456e2f08a77.jpeg'
  }
 ]
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
 deleteImage(state, payload) {
  state.images.splice(payload, 1)
 },
 replaceImage(state, payload) {
  var myimage = state.images[payload.nr]
  myimage.src = payload.imgForUpload
  state.images.splice(payload.nr, 1, myimage)
 },
 setUrl(state, payload) {
  var image = state.images.filter(x => x.guid == payload.guid)[0]
  if (image == null) return
  var index = state.images.indexOf(image)
  state.images[index].url = payload.url
  state.images[index].uploaded = true
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
 async deleteFs({ commit, rootState }, payload) {
  this.$axios
   .post('api/Image/deletefile', JSON.stringify(payload), {
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
   var obj = {
    imgString: payload.src,
    smth: 'tekst',
    ProfileID: parseInt(payload.ProfileID)
   }
   this.$axios
    .post('api/Image/savefile', JSON.stringify(obj), {
     headers: {
      'Content-Type': 'application/json'
     }
    })
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
