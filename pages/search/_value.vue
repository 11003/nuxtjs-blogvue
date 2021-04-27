<template>
  <div>
    <section id="one" class="wrapper style2">
      <div class="box">
        <div class="content" style="padding: 2rem;">
          <form method="get" action="#" @submit.prevent="SearchBtn">
            <div class="row uniform">
              <div>
                <input
                  type="text"
                  v-model="SearchKey"
                  ref="SearchKeyID"
                  placeholder="请输入文章关键字"
                />
              </div>
              <div>
                <button type="submit" class="fit" style="padding:0 6px">🔍 Search</button>
              </div>
            </div>
          </form>
          <div class="history-list" v-cloak>
            <div class="history-list-left">
              <template v-for="item in HistoryList">
                <a class="history-item" @click="articles(3,item, true);">{{ item }}</a>
              </template>
            </div>
            <div class="history-list-right">
              <a href="javascript:void(0)" @click="removeHistory" v-if="HistoryList.length > 0">
                <i class="fa fa-trash"></i>
              </a>
            </div>
          </div>
          <span
            class="search_msg"
            v-if="SearchMsg"
            v-html="SearchMsg"
          ></span>
        </div>
      </div>
    </section>
    <section id="three" class="wrapper style2">
      <div class="inner">
        <p
          style="padding-top: 6em;"
          class="align-center shake-chunk shake-constant shake-constant--hover"
          v-show="emptyPic"
        >
          <img src="https://i.loli.net/2019/10/16/CnoBqkweLcPgfNM.png"/>
        </p>
        <div class="grid-style">
          <Loading :show="showLoading"/>
          <div v-for="(item,index) in article_list" :key="index">
            <div class="box wow fadeInDown">
              <nuxt-link target="_blank" :to="{path: `/post/${item.id}?cid=${item.cid}&search=${SearchKeyValue}&index=search`}">
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
                    <nuxt-link target="_blank" :to="{path: `/post/${item.id}?cid=${item.cid}&search=${SearchKeyValue}&index=search`}" >{{ item.title }}</nuxt-link>
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
      </div>
      <PageMore ref="pageBtn" @nextnewpage="articles" v-if="pageStatus"/>
    </section>
  </div>
</template>

<script>
import {indexList} from "@/api";
import Loading from "@/components/Loading";
import PageMore from "@/components/PageMore";
import {mapGetters} from "vuex";

export default {
  components: {
    Loading,
    PageMore
  },
  computed: {
    ...mapGetters(['config']),
  },
  data() {
    return {
      showLoading: false,
      pageStatus: null,
      emptyPic: true,
      closeWeb: true,
      SearchKey: '',
      SearchMsg: '',
      SearchKeyValue: '',
      HistoryList: [],
      article_list: [],
      page_number: 3,
    }
  },
  watch: {
    SearchKeyValue: {
      deep: true,
      handler(data) {
        this.SearchKey = data;
        let page_number = parseInt(this.config.artlsit_number) || 3;
        // let lo_pageNumber = parseInt(localStorage.getItem('page_number_search'));
        // if (!lo_pageNumber) {
        //   localStorage.setItem('page_number_search', page_number);
        //   lo_pageNumber = page_number; // 防止NaN
        // }
        this.articles(page_number,data);
      }
    }
  },
  methods: {
    WOWInit() {
      new WOW().init();
    },
    SearchBtn() {
      if (this.SearchKey) {
        // localStorage.setItem('page_number_search', this.page_number);
        this.articles(this.page_number, this.SearchKey);
      } else {
        this.$refs.SearchKeyID.focus();
        this.SearchMsg = "请输入搜索内容~";
      }
    },
    SearchVal(val) {
      if(!val) return;
      val = val.trim();
      this.SearchKey = val;
      if (this.HistoryList.length > 0) {
        if (this.HistoryList.indexOf(val) !== -1) {
          this.HistoryList.splice(this.HistoryList.indexOf(val), 1);
        }
      }
      this.HistoryList.unshift(val)
      if (this.HistoryList.length > 6) {
        this.HistoryList.pop()
      }
      localStorage.setItem('HistoryList', JSON.stringify(this.HistoryList))
    },
    removeHistory() {
      localStorage.removeItem('HistoryList');
      this.HistoryList = [];
    },
    articles(n, search, HistoryListClick = false) {
      this.showLoading = true;
      if(HistoryListClick) {
        // localStorage.setItem('page_number_search', this.page_number);
      }
      this.SearchVal(search);
      // 只修改search参数不重新加载页面
      // window.history.pushState('', 'uselessTitle', '?search_value=' + this.SearchKey);
      this.$router.push(`/search/${this.SearchKey}`) // 只为了修改地址拦的参数
      const p = {
        limitNumber: n,
        searchValue: search || this.SearchKey
      }
      indexList(p).then(res => {
        this.showLoading = false;
        if (res.count > 0) {
          let rowsList = res.rows;
          rowsList.forEach(item => {
            if (item.pic === "") {
              item.pic = "https://8150e502a00d512ce440-4f545a264b21ec0a641efaa20af32482.ssl.cf4.rackcdn.com/d300x200/i" + (item.id - 5) + ".jpg";
            }
          });
          if(this.$refs['pageBtn']) this.$refs['pageBtn'].moreTxt = 'More'; // 变回more文案
          this.emptyPic = false;
          this.article_list = rowsList;
          this.pageStatus = res.total_page === 0 ? null : true; // 显示条数按钮
          this.SearchMsg =
            "已搜索到<em class='search_key'>" + this.SearchKey + "</em>的相关内容，大约" + res.count + "篇。";
        } else {
          this.$refs.SearchKeyID.focus();
          this.emptyPic = true;
          this.article_list = [];
          this.SearchMsg =
            "未找到<em class='search_key'>" + this.SearchKey + "</em>的相关内容，建议搜索文章的内容，标题或者关键字。";
        }
      });
    },
  },
  mounted() {
    this.WOWInit();
    this.SearchKeyValue = this.$route.params.value || "";
    if (localStorage.getItem("HistoryList")) {
      this.HistoryList = JSON.parse(localStorage.getItem("HistoryList"));
    }
    // localStorage.setItem('page_number_search', this.page_number);
  }
}
</script>

<style scoped>
#one {
  padding: 4rem 0 0 0;
}

#three {
  padding: 0 0 4rem 0;
}

.search_msg {
  color: #1a1a1a;
  display: inline-block;
  margin-top: 0.5rem;
}

.search_key {
  font-style: normal;
  color: #f1403c;
}

.history-list {
  display: flex;
}

.history-list .history-item {
  text-decoration: none;
  color: #fff;
  background-color: #2d3436;
  border-radius: 3px;
  padding: 3px 10px;
  opacity: .8;
  margin-right: 10px;
}

.history-list .history-item:hover {
  opacity: 1;
  color: #fff !important;
}

.history-list .history-list-right a {
  color: #9F9F9F !important;
}
</style>
