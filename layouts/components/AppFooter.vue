<template>
  <div>
    <FriendLinks/>
    <footer id="footer" class="wrapper">
      <div class="inner">
        <div class="copyright">
          <h4>{{ config.qianming }}</h4>
          <h5>{{ config.banquan }}</h5>
        </div>
        <div class="fas">
          <a target="_blank" href="https://github.com/Haiwar">
            <i class="fa fa-github"></i>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import FriendLinks from "@/components/FriendLinks";

export default {
  name: "AppFooter",
  computed: {
    ...mapGetters(['config']),
  },
  components: {
    FriendLinks
  }
}
</script>

<style scoped>

</style>
