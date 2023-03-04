<template>
  <div id="app">
    <div id="top"></div>
    <app-nav @closeMenu="openMenu" :visible="openMenuShow"/>
    <app-header @openMenu="openMenu" :class="headerRevealClass"/>
    <Nuxt keep-alive/>
    <app-footer v-once/>
    <app-right-tool v-once/>
  </div>
</template>
<script>
import AppHeader from "~/layouts/components/AppHeader";
import AppFooter from "~/layouts/components/AppFooter";
import AppNav from "~/layouts/components/AppNav";
import AppRightTool from "~/layouts/components/AppRightTool";
import {mapGetters} from "vuex";
export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    AppNav,
    AppRightTool,
  },
  computed: {
    ...mapGetters(['config']),
    headerRevealClass() {
      if(this.$route.path === '/') {
        return this.revealNav === true ? 'reveal' : 'alt'
      }
    }
  },
  data() {
    return {
      darkCssLink: '/css/dark.css',
      openMenuShow: false,
      revealNav: null,
    }
  },
  methods: {
    openMenu() {
      this.openMenuShow = !this.openMenuShow;
    },
    handleScroll() {
      let one = document.getElementById('one');
      if(!one) return;
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if((scrollTop+50) >= one.offsetTop) {
        this.revealNav = true;
        sessionStorage.setItem('revealNav', this.revealNav)
      } else {
        this.revealNav = null;
        sessionStorage.removeItem('revealNav')
      }
    },
    getRevealNavPosition() {
      const revealNav = sessionStorage.getItem('revealNav')
      this.revealNav = revealNav ? JSON.parse(revealNav) : null;
    },
    loadStyle(url) {
      let link = document.createElement('link')
      link.type = 'text/css'
      link.rel = 'stylesheet'
      link.href = url
      localStorage.setItem('dark_link',this.darkCssLink)
      let head = document.getElementsByTagName('head')[0]
      head.appendChild(link)
    },
    setDark() {
      let darkCssLink = localStorage.getItem('dark_link') || this.darkCssLink
      if(this.config.isDark === '是') {
        this.loadStyle(darkCssLink)
      } else {
        localStorage.removeItem('dark_link')
      }
    }
  },
  mounted() {
    this.setDark();
    if(this.$route.path === '/') {
      this.getRevealNavPosition();
      window.addEventListener('scroll', this.handleScroll, true);
    }
  },
  async created() {
    await this.$store.dispatch('app/getSystemConfig')
    await this.$store.dispatch('app/getFriendLinks')
  },
  destroyed() {
    if(this.$route.path === '/') {
      window.removeEventListener('scroll', this.handleScroll, true);
    }
  },
}
</script>
<style>

</style>
