<template>
  <section>
    <Banner :inner_title="inner_title" />
    <StartArticleList />
    <ArticleList />
  </section>
</template>

<script>
import Banner from '@/components/Banner';
import StartArticleList from '@/components/StartArticleList';
import ArticleList from '@/components/ArticleList';
import { mapGetters } from "vuex";
import axios from "axios";
export default {
  name: 'home',
  components: {
    Banner,
    StartArticleList,
    ArticleList,
  },
  data() {
    return {
      inner_title: ''
    }
  },
  computed: {
    ...mapGetters(['config']),
  },
  async asyncData({ store }) {
    await store.dispatch('getSystemConfig')
  },
  head() {
    return {
      title: this.config.seo_name,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.config.desc,
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.config.keywords
        },
      ]
    }
  },
  mounted() {
    axios.get('https://v1.hitokoto.cn').then(res => {
      this.inner_title = res.data.hitokoto;
    })
  }
}
</script>
<style>
#nprogress .bar {
  background: rgb(50, 63, 166) !important;
}

.viewer-in {
  animation: dialog-in .2s
}

@keyframes dialog-in {
  0% {
    opacity: 0
  }

  to {
    opacity: 1
  }
}
</style>
