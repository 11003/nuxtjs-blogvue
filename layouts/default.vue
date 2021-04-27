<template>
  <div id="app">
    <div id="top"></div>
    <app-nav @closeMenu="openMenu" :visible="openMenuShow"/>
    <app-header @openMenu="openMenu" :class="headerRevealClass"/>
    <Nuxt />
    <app-footer/>
    <app-right-tool/>
  </div>
</template>
<script>
import AppHeader from "~/layouts/components/AppHeader";
import AppFooter from "~/layouts/components/AppFooter";
import AppNav from "~/layouts/components/AppNav";
import AppRightTool from "~/layouts/components/AppRightTool";
export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    AppNav,
    AppRightTool,
  },
  computed: {
    headerRevealClass() {
      if(this.$route.path === '/') {
        return this.revealNav === true ? 'reveal' : 'alt'
      }
    }
  },
  data() {
    return {
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
    }
  },
  mounted() {
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
