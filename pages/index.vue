<template>
  <section>
    <Banner :inner_title="inner_title"/>
    <HomeAbout :inner_title="inner_title"/>
    <StartArticleList/>
    <ArticleList/>
  </section>
</template>

<script>
import Banner from '@/components/Banner';
import HomeAbout from '@/components/HomeAbout';
import StartArticleList from '@/components/StartArticleList';
import ArticleList from '@/components/ArticleList';
export default {
  components: {
    Banner,
    HomeAbout,
    StartArticleList,
    ArticleList,
  },
  data() {
    return {
      inner_title: ''
    }
  },
  mounted() {
    $.get('https://v1.hitokoto.cn', res => {
      this.inner_title = res.hitokoto;
    })
  }
}
</script>
