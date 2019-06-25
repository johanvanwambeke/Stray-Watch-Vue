export const state = () => ({
 images: [],
 imagesWithLoc: [],
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
  var myimage = state.images[payload.nr];
  myimage.src = payload.imgForUpload
  state.images.splice(payload.nr, 1, myimage)
  state.imagesWithLoc = state.images
 },
 setMainImage(state, payload) {
  state.images.forEach(function (entry) {
   entry.main = false;
  });
  state.images[payload].main = true
 },
 setUrl(state, payload) {
  state.images[payload.nr].uploadUrl = payload.uri
  state.images[payload.nr].uploaded = true
  console.log(state.images[payload.nr].uploadUrl)
 },
 setImages(state, payload) {
  payload.forEach((element, i) => {
   if (state.images[i])
    state.images[i].src = element
   else
    state.images.push({
     src: element
    })
  });
  console.log(state.images)
 }
}

export const actions = {
 async add({
  commit,
  state
 }, payload) {
  commit('addImage', payload)
 },
 async delete({
  commit
 }, payload) {
  commit('deleteImage', payload)
 },
 async replace({
  commit
 }, payload) {
  commit('replaceImage', payload)
 },
 async setMain({
  commit
 }, payload) {
  commit('setMainImage', payload)
 },
 uploadImages({
  dispatch
 }, payload) {
  return new Promise((resolve, reject) => {
   payload.forEach((image, i) => {
    dispatch('uploadImage', {
     image: image.imgForUpload,
     nr: i
    })
   });
   resolve(r)
  })
 },
 uploadImage({
  commit
 }, payload) {
  return new Promise((resolve, reject) => {
   this.$axios.post(
     // 'https://localhost:44352/api/Image/SaveFile',
     'https://stray-watch-api.azurewebsites.net/api/Image/savefile', {
      'imgString': payload.image,
      'smth': 'tekst'
     }, {
      onUploadProgress: uploadEvent => {
       console.log('uploaded: ' + Math.round(uploadEvent.loaded / uploadEvent.total) * 100 + '%')
      }
     }
    )
    .then((response) => {
     console.log(response.data.uri);
     commit('setUrl', {
      url: response.data.uri,
      nr: payload.nr
     })
     resolve('ok')
    })
    .catch((error) => {
     console.log(error);
     reject('fail')
    });
  })
 }
}
