<template>
  <section id="two" class="wrapper style3" style="background-image:url('https://picsum.photos/1920/1080')">
    <div class="inner">
      <div id="flexgrid">
        <div v-for="item in hotListData" :key="item.id">
          <header>
            <h3>✨{{ item.title }}</h3>
          </header>
          <p>{{ item.desc }}</p>
          <nuxt-link class="button alt learn-more" :to="{ path: `/post/${item.id}?cid=${item.cid}&index=true` }">Learn
            More</nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(['hotListData']),
  },
  created() {
    if (this.hotListData?.length === 0) {
      this.$store.dispatch('getHotList')
    }
  }
}
</script>

<style scoped></style>
