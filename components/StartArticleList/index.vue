<template>
  <section
    id="two"
    class="wrapper style3"
    style="background-image:url('https://api.sunweihu.com/api/bing1/api.php')"
  >
    <div class="inner">
      <div id="flexgrid">
        <div v-for="item in hot_list">
          <header>
            <h3>✨{{ item.title }}</h3>
          </header>
          <p>{{ item.desc }}</p>
          <ul class="actions">
            <li>
              <nuxt-link class="button alt" :to="{path: `/post/${item.id}?cid=${item.cid}&index=true`}">Learn More</nuxt-link>
            </li>
          </ul>
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
