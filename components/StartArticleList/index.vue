<template>
  <section
    id="two"
    class="wrapper style3"
    style="background-image:url('https://picsum.photos/1920/1080')"
  >
    <div class="inner">
      <div id="flexgrid">
        <div v-for="item in hot_list">
          <header>
            <h3>✨{{ item.title }}</h3>
          </header>
          <p>{{ item.desc }}</p>
          <nuxt-link class="button alt learn-more" :to="{path: `/post/${item.id}?cid=${item.cid}&index=true`}">Learn More</nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {hotList} from "@/api";

export default {
 data() {
   return {
     hot_list: []
   }
 },
  created() {
    hotList().then(res => {
      this.hot_list = res
    })
  }
}
</script>

<style scoped>

</style>
