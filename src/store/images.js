export const state = () => ({
    images:[],
})

export const getters = {
    images (state) {
        return state.images
    },
}

export const mutations = {
    addImage(state,payload){
        state.images.push(payload)
    },
    deleteImage(state,payload){
        state.images.splice(payload,1)
    },
    replaceImage(state,payload){
        var myimage = state.images[payload.nr];
        myimage.src = payload.imgForUpload
        state.images.splice(payload.nr,1,myimage)
    },    
    setMainImage(state,payload){
        state.images.forEach(function(entry) {
            entry.main = false;
        });
        state.images[payload].main = true
    },
    setUrl(state,payload){
        state.images[payload.nr].uploadUrl = payload.uri
        state.images[payload.nr].uploaded = true
    }
}

export const actions = {
    async add ({ commit,state },payload) {
        commit ('addImage', payload)
    },
    async delete ({ commit },payload) {
        commit ('deleteImage', payload)
    },
    async replace ({ commit },payload) {
        commit ('replaceImage', payload)
    },
    async setMain ({ commit },payload) {
        commit ('setMainImage', payload)
    },
    async uploadImage({commit},payload){
        console.log(payload.image)
        this.$axios.post(
        'https://localhost:44352/api/Image/SaveFile',
        // 'https://stray-watch-api.azurewebsites.net/api/Image/savefile',      
          {
            'imgString': payload.image,
            'smth': 'tekst'
          },
          {
            onUploadProgress: uploadEvent=>{
              console.log('uploaded: '  + Math.round(uploadEvent.loaded / uploadEvent.total)*100 + '%')
            }
          }
        )  
        .then((response)=> {
            console.log(response.data.uri);
            commit('setUrl',{url:response.data.uri,nr:nr})
        })
        .catch((error)=> {
            console.log(error);
        }); 
    }
    
}