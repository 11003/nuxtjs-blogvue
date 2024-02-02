<template>
  <section>
    <StartArticleList />
    <client-only>
      <ArticleList :cid="$route.params.id" />
    </client-only>
  </section>
</template>

<script>
import StartArticleList from '@/components/StartArticleList';
import ArticleList from "@/components/ArticleList";
export default {
  name: 'articleList',
  components: {
    StartArticleList,
    ArticleList,
  },
}
</script>

<style scoped></style>
