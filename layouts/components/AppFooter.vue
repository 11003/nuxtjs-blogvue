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
        <p class="heart"></p>
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
.heart {
  color: #ddd;
  display: block;
  height: 2rem;
  line-height: 2rem;
  margin-bottom: 0;
  margin-top: 1rem;
  position: relative;
  text-align: center;
  width: 100%;
}
.heart::before {
  border-top: 1px solid #eee;
  content: " ";
  display: block;
  height: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 50%;
}
.heart::after {
  background-color: #fff;
  content: "♥";
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  position: relative;
  z-index: 1;
}
.heart:hover {
  color: #ff4136;
}
</style>
