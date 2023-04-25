<template>
  <div class="page-btn align-center">
    <ul class="actions">
      <li @click="nextpage"><a class="button alt loading-btn">{{ moreTxt }}</a></li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  data() {
    return {
      routerPath: '',
      cid: '',
      pageNumber: 1,
      moreTxt: 'More'
    }
  },
  computed: {
    ...mapGetters(['config'])
  },
  methods: {
    nextpage() {
      console.log(`this.pageNumber===>`, this.pageNumber)
      if(this.moreTxt === 'Loading...') return;
      this.$emit('nextnewpage', this.pageNumber+=1);
      this.moreTxt = 'Loading...';
      if(this.routerPath.indexOf('/search') !== -1) {
        return;
      }
      localStorage.setItem('page_number' + this.cid, this.pageNumber);
    }
  },
  mounted() {
    this.cid = this.$route.query.cid || this.$route.params.id || '';
    this.routerPath = this.$route.path;
    if(this.routerPath.indexOf('/search') !== -1) {
      return;
    }
    this.pageNumber = parseInt(localStorage.getItem('page_number' + this.cid)) || 1;
  },
}
</script>

<style scoped>
li a.loading-btn{
  border-radius: 50px;
}
@media screen and  (max-width:480px) and (max-width:736px) {
  li a.loading-btn{
    width: 50%;
  }
}
</style>
