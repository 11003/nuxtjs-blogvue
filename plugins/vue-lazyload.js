import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

// https://www.npmjs.com/package/vue-lazyload
Vue.use(VueLazyload, {
  loading: 'https://ae01.alicdn.com/kf/U925a8dbf427c43cdb299bb85d31e65b4I.jpg',
  error: 'https://gitee.com/liuhaier/images/raw/master/img/imgLoadingError.png',
  preLoad: 1.3,
  attempt: 1,
})
