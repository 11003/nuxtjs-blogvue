import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
/*全局配置 加载条*/
NProgress.configure({
  // 是否显示加载ico
  showSpinner: false
})
export default ({app}) => {
  app.router.beforeEach((to, from, next) => {
    NProgress.start();
    next()
  })
  app.router.afterEach((to, from) => {
    window._hmt = window._hmt || []
    window._hmt.push(['_trackPageview', to.fullPath])
    // 进度条结束
    NProgress.done();
  })
}
