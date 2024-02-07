<template>
  <section id="banner" data-video="images/banner" :style="{ backgroundImage: `url(${config.bannerImg})` }">
    <div class="inner">
      <h1>{{ config.seo_name }}</h1>
      <p>{{ inner_title }}</p>
      <a @click="goToAbout" class="button scrolly gradient">了解更多</a>
    </div>
    <video autoplay loop muted ref="video"></video>
    <div id="forFixedHeader"></div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['config']),
  },
  data() {
    return {
      bannerVideo: null,
    }
  },
  props: {
    inner_title: {
      type: String
    }
  },
  watch: {
    'config.bannerVideo': {
      handler: function (v) {
        this.$nextTick(() => {
          this.$refs.video.src = v;
        })
      },
      deep: true,
    },
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.video.src = this.config.bannerVideo;
    })
  },
  methods: {
    to(toEl, n) {
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
      this.to(document.querySelector('#two'), 0);
    }
  }
}
</script>
<style scoped>
#banner .inner a.gradient {
  background: linear-gradient(155deg, var(--text_color) 0%, #B721FF, #3369e7, #2AF598 100%) left center/400% 400%;
  color: #FFFFFF !important;
  animation: move 10s infinite;
}
</style>
