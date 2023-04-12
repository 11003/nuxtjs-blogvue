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
          <div class="box wow zoomIn" style="animation-duration: .6s;">
            <nuxt-link class="article_box_item" :to="{path: `/post/${item.id}?cid=${cid||item.cid}&index=${isIndex}`}">
              <div class="image fit article_item">
                <img
                  :title="item.title"
                  class="img-fit"
                  v-lazy="item.pic"
                />
              </div>
              <div class="entry-category">
                <a href="javascript:void(0)" v-if="item.look" class="entry-category-tag">阅读 {{item.look}}</a>
                <a href="javascript:void(0)" v-if="item.comment_count" class="entry-category-tag">评论 {{item.comment_count}}</a>
                <template v-for="(key,ind) in item.keywords">
                  <nuxt-link class="entry-category-tag" rel="category tag" :to="{path: `/search/${key}`}" :key="ind">{{ key }}</nuxt-link>
                </template>
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
      limitNum: null,
      showLoading: true,
      pageStatus: null,
      emptyPic: false,
      article_list: []
    }
  },
  methods: {
    getArticles(n) {
      let limitNum = this.limitNum || 3
      const p = {
        pageNumber: n || 1,
        limitNumber: limitNum,
        cid: this.cid
      }
      indexList(p).then(res => {
        let rowsList = res.rows
        this.showLoading = false;
        this.limitNum = +this.config.artlsit_number
        if (res.count > 0) {
          rowsList.map(item => {
            if (item.pic === "") {
              item.pic = `https://picsum.photos/id/${item.id}/600/350`;
            }
            if(this.$refs['pageBtn']) this.$refs['pageBtn'].moreTxt = 'More'; // 变回more文案
          })
        } else {
          this.emptyPic = true;
        }
        this.article_list = this.article_list.concat(rowsList);
        this.pageStatus = this.article_list.length !== res.count; // 显示条数按钮
      })
    },
    WOWInit() {
      new WOW().init();
    }
  },
  mounted() {
    this.WOWInit();
    let page_number = 1;
    let limit_number = +this.config.artlsit_number
    let lo_pageNumber = +localStorage.getItem('page_number' + this.cid);
    if (!lo_pageNumber) {
      localStorage.setItem("page_number" + this.cid, page_number);
      lo_pageNumber = page_number; // 防止NaN
    }
    //页面被刷新
    if(+window.performance.navigation.type === 1 || lo_pageNumber > 1) {
      this.limitNum = lo_pageNumber * limit_number
    }
    this.getArticles()
  }
}
</script>
