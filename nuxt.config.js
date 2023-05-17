export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Sonder',
    htmlAttrs: {
      lang: 'zh'
    },
    meta: [
      { charset: 'utf-8' },
      { charset: 'color-scheme', content: 'light dark' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '刘海的博客，该网站通过Nuxtjs搭建而来，分享学习、工作中一些技术文章，记录常用踩坑代码。' },
      { hid: 'keywords', name: 'keywords', content: 'Poseidon,刘海,技术博客,PHP,JavaScript,Vue' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/csshake/1.7.0/csshake.min.css' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.3.7/viewer.min.css' },
      { rel: 'stylesheet', href: '//at.alicdn.com/t/font_2800767_15lir43306m.css' },
      { rel: 'stylesheet', href: '/css/main.css' },
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js', async: false },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js', async: false },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.3.7/viewer.min.js', async: false },
      { src: 'https://hm.baidu.com/hm.js?db00f175af988a564e9942aa5fc351f9', async: false },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  // css: [
  //   '~/assets/css/main.css'
  // ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/axios.js' },
    { src: '~/plugins/vue-lazyload.js', ssr: true },
    { src: '~/plugins/vuex-persistedstate.js', ssr: false },
    { src: '~/plugins/highlight.js', ssr: false },
    { src: '~/plugins/nprogress.js', ssr: false }
  ],
  //设置缓存
  cache: true,
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: { allChunks: true },
    postcss: null
  },

  env: {
    APP_BASE_API: 'https://index.musclewiki.cn'
  }
}
