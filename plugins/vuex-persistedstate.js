import createPersistedState from 'vuex-persistedstate';
const version = '1.0.0'
export default ({store}) => {
  createPersistedState({
    key: `vuex_${version}`,
    storage: localStorage,
  })(store)
}
