export const state = () => ({
 snackmsg: ''
})

export const getters = {
 snackmsg(state) {
  return state.snackmsg
 }
}

export const mutations = {
 snackmsg(state, payload) {
  state.snackmsg = payload
 }
}

export const actions = {}
