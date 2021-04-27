<template>
  <section id="three" class="wrapper style2">
    <div class="inner">
      <Loading :show="showLoading"/>
      <template v-if="emptyPic">
        <p class="align-center shake-chunk shake-constant shake-constant--hover" style="padding-top: 6em;">
          <img src="https://i.loli.net/2019/10/16/CnoBqkweLcPgfNM.png" />
        </p>
      </template>
      <div class="grid-style">
        <div v-for="item in article_list" :key="item.id">
          <div class="box wow fadeInDown">
            <nuxt-link :to="{path: `/post/${item.id}?cid=${cid||item.cid}&index=${isIndex}`}">
              <div class="image fit">
                <img
                  :title="item.comment_count + `条评论,` + item.look + `次阅读`"
                  class="img-fit"
                  v-lazy="item.pic"
                />
              </div>
            </nuxt-link>

            <div class="content">
              <header class="align-center">
                <h2 class="title">
                  <nuxt-link :title="item.title" :to="{path: `/post/${item.id}?cid=${cid||item.cid}&index=${isIndex}`}">
                    {{ item.title }}
                  </nuxt-link>
                </h2>
                <p>
                      <span class="inline-block">
                        <i class="icon fa-calendar"></i>
                        <span> {{ item.create_time }}</span>
                      </span>
                  <span class="inline-block">
                        <i class="icon fa-list-alt"></i>
                        <span> {{ item.catename }}</span>
                      </span>
                </p>
              </header>
              <p>{{ item.content }}</p>
            </div>
          </div>
        </div>
      </div>
      <PageMore ref="pageBtn" @nextnewpage="getArticles" v-if="pageStatus"/>
    </div>
  </section>
</template>

<script>
import {mapGetters} from 'vuex';
import Loading from '@/components/Loading';
import PageMore from '@/components/PageMore';
import {indexList} from "@/api";
export default {
  components: {
    Loading,
    PageMore
  },
  computed: {
    isIndex() {
      if(this.$route.path === '/') {
        return 'true';
      }
      return 'false';
    },
    ...mapGetters(['config']),
  },
  props: {
    cid: {type: String, default: ''}
  },
  head() {
    return {
      title: this.$route.query.title ? this.$route.query.title + ' - ' + this.config.seo_name : this.config.seo_name,
    }
  },
  data() {
    return {
      showLoading: true,
      pageStatus: null,
      emptyPic: false,
      article_list: []
    }
  },
  methods: {
    getArticles(n) {
      const p = {
        limitNumber: n,
        cid: this.cid
      }
      indexList(p).then(res => {
        let rowsList = res.rows
        this.showLoading = false;
        if (res.count > 0) {
          rowsList.map(item => {
            if (item.pic === "") {
              item.pic = "https://8150e502a00d512ce440-4f545a264b21ec0a641efaa20af32482.ssl.cf4.rackcdn.com/d300x200/i" + (item.id-5) +".jpg";
            }
            this.pageStatus = res.total_page === 0 ? null : true; // 显示条数按钮
            if(this.$refs['pageBtn']) this.$refs['pageBtn'].moreTxt = 'More'; // 变回more文案
          })
        } else {
          this.emptyPic = true;
        }
        this.article_list = rowsList;
      })
    },
    WOWInit() {
      new WOW().init();
    }
  },
  async mounted() {
    this.WOWInit();
    let page_number = parseInt(this.config.artlsit_number) || 3;
    let lo_pageNumber = parseInt(localStorage.getItem('page_number' + this.cid));
    if (!lo_pageNumber) {
      localStorage.setItem("page_number" + this.cid, page_number);
      lo_pageNumber = page_number; // 防止NaN
    }
    await this.getArticles(lo_pageNumber)
  }
}
</script>

<style scoped>

</style>
