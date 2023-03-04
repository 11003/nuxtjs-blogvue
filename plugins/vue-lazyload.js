import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

// https://www.npmjs.com/package/vue-lazyload
Vue.use(VueLazyload, {
  loading: `https://s2.loli.net/2023/02/23/957hgqFOmoTU3iI.webp`,
  error: 'https://s2.loli.net/2022/05/27/qwzVJ29HPygdAjD.png',
  preLoad: 1.3,
  attempt: 1,
})
