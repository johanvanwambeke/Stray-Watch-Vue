export const state = () => ({
    profile:{},
    loading:false
  })

  export const getters = {
    profile (state) {
      return state.profile
    },
    loading(state){
      return state.loading
    }
  }

  export const mutations = {
    setProfile (state, payload) {
      state.profile = payload
    },
    isLoading(state){
      state.loading = true;
    },
    completedLoading(state){
      state.loading=false;
    }
  }

  export const actions = {
    async getProfileLoad ({ commit }, payload) {
      commit('isLoading')
      console.log('getprofile: '+payload);
      this.$axios.get(
        // 'https://localhost:44352/api/AnimalProfile/get/' + this.$route.query.id , 
        'https://stray-watch-api.azurewebsites.net/api/AnimalProfile/get/'+ payload ,          
          )  
        .then((response)=> {
            commit('setProfile', response.data)
        })
        .catch((error)=> {
          console.log(error);
        }); 
        
        commit('completedLoading')    
    },
    async getProfile ({ commit }, payload) {
        var result =  await this.$axios.get(
            // 'https://localhost:44352/api/AnimalProfile/get/' + this.$route.query.id , 
            'https://stray-watch-api.azurewebsites.net/api/AnimalProfile/get/'+ payload ,          
                )
        return result.data
    },
  }