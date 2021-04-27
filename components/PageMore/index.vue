<template>
  <div class="page-btn align-center">
    <ul class="actions">
      <li @click="nextpage"><a class="button alt loading-btn">{{ moreTxt }}</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routerPath: '',
      cid: '',
      pageNumber: 3,
      moreTxt: 'More'
    }
  },
  methods: {
    nextpage() {
      this.$emit('nextnewpage', (this.pageNumber += 3));
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
    this.pageNumber = parseInt(localStorage.getItem('page_number' + this.cid)) || 3;
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
