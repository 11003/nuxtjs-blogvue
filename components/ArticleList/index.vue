<template>
  <section id="three" class="wrapper style2">
    <div class="inner">
      <TabSort v-show="config.showHomeSort === '是' && isIndex === 'true'" @setArticleOrder="setArticleOrder" />
      <Loading :show="showLoading" />
      <template v-if="emptyPic">
        <div class="align-center shake-chunk shake-constant shake-constant--hover" style="padding-top: 6em;">
          <img src="https://i.loli.net/2019/10/16/CnoBqkweLcPgfNM.png" />
        </div>
      </template>
      <div class="grid-style">
        <div v-for="item in article_list" :key="item.id" :data-id="item.id">
          <div class="box wow zoomIn" style="animation-duration: .6s;">
            <nuxt-link class="article_box_item"
              :to="{ path: `/post/${item.id}?cid=${cid || item.cid}&index=${isIndex}` }">
              <span class="image fit article_item">
                <img :title="item.title" class="img-fit"
                  v-lazy="item.pic ? item.pic : `https://picsum.photos/id/${item.id}/600/350`" />
              </span>
              <span class="entry-category">
                <span v-if="item.look" class="entry-category-tag">阅读 {{ item.look }}</span>
                <span v-if="item.comment_count" class="entry-category-tag">评论 {{ item.comment_count }}</span>
                <span v-for="(key, ind) in item.keywords" @click.prevent="gotoPage(`/search/${key}`)" :key="ind"
                  class="entry-category-tag">
                  {{ key }}
                </span>
              </span>
            </nuxt-link>
            <div class="content">
              <header class="align-center">
                <h2 class="title">
                  <nuxt-link :title="item.title"
                    :to="{ path: `/post/${item.id}?cid=${cid || item.cid}&index=${isIndex}` }">
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
      <PageMore ref="pageBtn" @nextnewpage="moreArticles" v-if="pageStatus" />
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Loading from '@/components/Loading';
import PageMore from '@/components/PageMore';
import TabSort from "@/components/TabSort";
import { indexList } from "@/api";
export default {
  components: {
    TabSort,
    Loading,
    PageMore
  },
  computed: {
    isIndex() {
      if (this.$route.path === '/') {
        return 'true';
      }
      return 'false';
    },
    ...mapGetters(['config']),
  },
  props: {
    cid: { type: String, default: '' }
  },
  head() {
    return {
      title: this.$route.query.title ? this.$route.query.title + ' - ' + this.config.seo_name : this.config.seo_name,
    }
  },
  data() {
    return {
      limitNum: null,
      showLoading: true,
      pageStatus: null,
      emptyPic: false,
      article_list: [],
      orderName: 'create_time'
    }
  },
  methods: {
    async setArticleOrder(order) {
      this.article_list = [];
      this.pageStatus = false;
      this.showLoading = true;
      this.orderName = order;
      await this.getArticles(1)
      this.$nextTick(() => {
        if (this.$refs.pageBtn) this.$refs.pageBtn.pageNumber = 1
      })
    },
    gotoPage(path) {
      if (!path) return
      this.$router.push({ path })
    },
    moreArticles(n) {
      this.getArticles(n)
    },
    async getArticles(n) {
      const p = {
        order: this.orderName,
        pageNumber: n || 1,
        limitNumber: 10,
        cid: this.cid
      }
      const res = await indexList(p)
      let rowsList = res.rows
      this.showLoading = false;
      this.limitNum = +this.config.artlsit_number
      if (res.count > 0) {
        rowsList.map(item => {
          if (item.pic === "") {
            item.pic = `https://picsum.photos/id/${item.id}/600/350`;
          }
          if (this.$refs['pageBtn']) this.$refs['pageBtn'].moreTxt = 'More'; // 变回more文案
        })
      } else {
        this.emptyPic = true;
      }
      this.article_list = this.article_list.concat(rowsList);
      this.pageStatus = this.article_list.length !== res.count; // 显示条数按钮
    },
    WOWInit() {
      new WOW().init();
    }
  },
  async mounted() {
    this.WOWInit();
  },
  created() {
    this.getArticles()
  }
}
</script>
