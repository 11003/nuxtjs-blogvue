import createPersistedState from 'vuex-persistedstate';

export default ({store}) => {
  createPersistedState({
    storage: localStorage,
  })(store)
}
