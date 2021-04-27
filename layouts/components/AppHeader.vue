<template>
  <header id="header">
    <div class="logo">
      <nuxt-link :to="{path: '/'}">{{ config.seo_name }}</nuxt-link>
    </div>
    <a @click="openMenu" class="toggle"></a>
  </header>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  name: "AppHeader",
  computed: {
    ...mapGetters(['config']),
  },
  methods: {
    openMenu() {
      this.$emit('openMenu')
    }
  }
}
</script>

<style scoped>

</style>
