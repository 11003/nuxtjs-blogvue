<template>
  <section id="banner" data-video="images/banner">
    <div class="inner">
      <h1>{{ config.seo_name }}</h1>
      <p>{{ inner_title }}</p>
      <a @click="goToAbout" class="button scrolly gradient">了解更多</a>
    </div>
    <video autoplay loop>
      <source src="~@/static/images/banner.mp4" type="video/mp4">
    </video>
  </section>
</template>
<script>
import {mapGetters} from 'vuex';

export default {
  computed: {
    ...mapGetters(['config']),
  },
  props: {
    inner_title: {
      type: String
    }
  },
  methods: {
    to(toEl,n) {
      let bridge = toEl;
      let body = document.body;
      let height = 0;
      do {
        height += bridge.offsetTop;
        bridge = bridge.offsetParent;
      } while (bridge !== body)
      window.scrollTo({
        top: height - n,
        behavior: 'smooth'
      })
    },
    goToAbout() {
      this.to(document.querySelector('#one'),0);
    }
  }
}
</script>
<style scoped>
#banner .inner a.gradient {
  background: linear-gradient(155deg, #08AEEA 0%, #B721FF, #3369e7, #2AF598 100%) left center/400% 400%;
  color: #FFFFFF !important;
  animation: move 10s infinite;
}
</style>
