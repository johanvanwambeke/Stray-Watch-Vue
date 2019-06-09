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
        myimage.src = payload.img
        state.images.splice(payload.nr,1,myimage)
    },    
    setMainImage(state,payload){
        state.images.forEach(function(entry) {
            entry.main = false;
        });
        state.images[payload].main = true
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
    }
}