<template>
  <section
    id="four"
    class="wrapper style3"
    style="background-image:url('https://api.sunweihu.com/api/bing1/api.php')"
  >
    <div class="inner">
      <header class="align-center">
        <h2><span>👋</span>友</h2>
        <ul class="actions">
          <li class="fit shake shake-little" v-for="(item,index) in links" :key="index">
            <a :href="item.url" :title="item.desc" target="_blank" class="friends">{{ item.name }}</a>
          </li>
        </ul>
      </header>
    </div>
  </section>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  computed: {
    ...mapGetters(['links']),
  }
}
</script>

<style scoped>

</style>
