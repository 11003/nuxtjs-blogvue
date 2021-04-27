import createPersistedState from 'vuex-persistedstate';

export default ({store}) => {
  createPersistedState({
    storage: sessionStorage,
  })(store)
}
