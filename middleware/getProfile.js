
export default ({store, params})=>{
     store.dispatch('profiles/getProfileLoad', params.id )
    
}