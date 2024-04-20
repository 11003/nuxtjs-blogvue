<template>
  <div class="page-btn align-center">
    <ul class="actions">
      <li @click="nextpage"><a class="button alt loading-btn">{{ moreTxt }}</a></li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function () {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function () {
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};
export default {
  data() {
    return {
      routerPath: '',
      cid: '',
      pageNumber: 2,
      moreTxt: 'More',
    }
  },
  computed: {
    ...mapGetters(['config', 'homeArticleList'])
  },
  methods: {
    nextpage() {
      if (this.moreTxt === 'Loading...') return;
      this.moreTxt = 'Loading...';
      this.$emit('nextnewpage', this.pageNumber++);
    }
  },
  mounted() {
    this.routerPath = this.$route.path;
  },
}
</script>

<style scoped>
li a.loading-btn {
  border-radius: 50px;
}

@media screen and (max-width:480px) and (max-width:736px) {
  li a.loading-btn {
    width: 50%;
  }
}
</style>
