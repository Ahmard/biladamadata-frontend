export const state = () => ({
  isWorking: null,
  workingMessage: '<i class="fw-bold">Working</i>',
})

export const mutations = {
  startWorking(state, message) {
    state.isWorking = true
    state.workingMessage = message ?? '<i class="fw-bold">Working</i>'
  },
  stopWorking(state) {
    state.isWorking = false
  },
}
