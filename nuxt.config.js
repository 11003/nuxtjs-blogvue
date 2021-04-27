export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Sonder',
    htmlAttrs: {
      lang: 'zh'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '刘海的Vue博客,Musclewiki健身百科站主,Bilibiili贫穷健身Up主。该网站通过Nuxtjs搭建而来,分享学习、工作中一些技术文章,记录常用踩坑代码。码云:liuhaier,GitHub:Haiwar' },
      { hid: 'keywords', name: 'keywords', content: '技术博客,PHP,JavaScript,Vue' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/animate.css@3.7.2/animate.min.css' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.css' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/csshake@1.5.3/dist/csshake.min.css' },
      { rel: 'stylesheet', href: 'https://cdn.bootcss.com/viewerjs/1.3.7/viewer.min.css' },
      { rel: 'stylesheet', href: '/css/main.css' },
    ],
    script: [
      { src: 'https://cdn.jsdelivr.net/npm/jquery@1.12.2/dist/jquery.min.js', async: true },
      { src: 'https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js', async: true },
      { src: 'https://cdn.jsdelivr.net/npm/wowjs@1.1.2/dist/wow.min.js', async: true },
      { src: 'https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js', async: true },
      { src: 'https://cdn.jsdelivr.net/npm/viewerjs@1.3.7/dist/viewer.min.js', async: true },
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
  ],

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
    extractCSS: { allChunks: true }
  },

  env: {
    APP_BASE_API: 'http://index.musclewiki.cn'
  }
}
