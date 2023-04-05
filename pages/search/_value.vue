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
              <div class="search_button_box">
                <button type="submit" class="fit search_button">
                  <span class="btn-title">搜索</span></button>
              </div>
            </div>
          </form>
          <div class="history-list" v-cloak>
            <div class="history-list-left">
              <template v-for="item in HistoryList">
                <a class="history-item" @click="articles(1,item, true);">{{ item }}</a>
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
        <div class="grid-style" id="search-article-content">
          <Loading :show="showLoading"/>
          <div v-for="(item,index) in article_list" :key="index">
            <div v-if="item.article_type === 'CODE'" class="wow zoomIn books-item code-item copy-record-content-box" style="animation-duration: .5s;">
              <div class="header">
                <span class="title">{{item.title}}</span>
                <a class="iconfont icon-wangzhi link" :title="item.url" v-if="item.url" target="_blank" :href="`${item.url}`"></a>
              </div>
              <div class="code-content markdown-body" @click="watchImg($event)" v-highlight v-html="item.content" v-lazy-container="{ selector: 'img' }"></div>
              <div class="info">
                <div class="tags" v-show="item.keywords">
                  🏷️
                  <span class="tag" :key="indexK" v-for="(itemK,indexK) in item.keywords">
                    <nuxt-link :to="{path: `/search/${itemK}`}">#{{ itemK }}</nuxt-link>
                  </span>
                </div>
                <div class="tags" v-show="!item.keywords"></div>
                <p class="time">{{ item.create_time }}</p>
              </div>
            </div>
            <div v-else class="box wow zoomIn" style="animation-duration: .5s;">
              <nuxt-link class="article_box_item" :to="{path: `/post/${item.id}?cid=${item.cid}&search=${searchValue}&index=search`}">
                <div class="image fit article_item">
                  <img
                    :title="item.title"
                    class="img-fit no-zoom"
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
                    <nuxt-link :to="{path: `/post/${item.id}?cid=${item.cid}&search=${searchValue}&index=search`}" >{{ item.title }}</nuxt-link>
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
import addLineAndCopy from "~/plugins/jq-codeCopy";

export default {
  components: {
    Loading,
    PageMore
  },
  computed: {
    ...mapGetters(['config']),
    searchValue: function (){
      return this.SearchKeyValue || this.SearchKey;
    },
  },
  head(){
    return {
      title: `搜索${this.SearchKey} - ${this.config.seo_name}`,
    }
  },
  watch: {
    SearchKeyValue: {
      deep: true,
      handler(data) {
        if(!data) return;
        this.SearchKey = data;
        this.articles(1,data,true);
      }
    }
  },
  data() {
    return {
      viewer: {},
      showLoading: false,
      pageStatus: null,
      total_page: null,
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
  methods: {
    watchImg(event) {
      if(event.target.tagName !== 'IMG') return;
      let parentElement = event.currentTarget.parentElement
      if(parentElement.classList.contains('code-item')) {
        this.viewer.show();
      }
    },
    WOWInit() {
      new WOW().init();
    },
    initViewer() {
      let that = this;
      let _id = document.getElementById("search-article-content");
      if(!_id) return;
      this.viewer = new Viewer(_id, {
        title: false,
        toolbar: false,
        loop: false,
        keyboard: false,
        navbar: false,
        transition: false,
        show() {  // 动态加载图片后，更新实例
          that.viewer.update();
        },
        filter(image) {
          return !image.classList.contains('no-zoom');
        }
      });
    },
    SearchBtn() {
      if (this.SearchKey) {
        // localStorage.setItem('page_number_search', this.page_number);
        this.articles(this.page_number, this.SearchKey,true);
      } else {
        this.$nextTick(() => {
          this.$refs.SearchKeyID.focus();
        })
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
    articles(n, search, clear = false) {
      if(this.showLoading) return;
      if(clear) this.article_list = [];
      this.showLoading = true;
      this.SearchVal(search);
      // 只修改search参数不重新加载页面
      // window.history.pushState('', 'uselessTitle', '?search_value=' + this.SearchKey);
      // this.$router.push(`/search/${this.SearchKey}`) // 只为了修改地址拦的参数
      const p = {
        pageNumber: n,
        limitNumber: parseInt(this.config.artlsit_number) || 3,
        searchValue: (search || this.SearchKey).replace(' ','%')
      }
      indexList(p).then(res => {
        this.showLoading = false;
        if (res.rows.length > 0) {
          let rowsList = res.rows;
          rowsList.forEach(item => {
            if (item.pic === "") {
              item.pic = `https://picsum.photos/id/${item.id}/600/300`;
            }
          });
          if(this.$refs['pageBtn']) this.$refs['pageBtn'].moreTxt = 'More'; // 变回more文案
          this.emptyPic = false;
          this.article_list = this.article_list.concat(rowsList);
          this.pageStatus = this.article_list.length !== res.count; // 显示条数按钮
          if(!this.pageStatus) this.page_number = 1
          this.$nextTick(()=>{
            addLineAndCopy();
          })
          this.SearchMsg =
            "已搜索到<code class='search_key'>" + this.SearchKey + "</code>的相关内容，大约" + res.count + "篇。";
        } else {
          this.$nextTick(() => {
            this.$refs.SearchKeyID.focus();
          })
          this.emptyPic = true;
          this.article_list = [];
          this.SearchMsg =
            "未找到<code class='search_key'>" + this.SearchKey + "</code>的相关内容，建议搜索文章的内容，标题或者关键字。";
        }
      });
    },
  },
  created() {
    if(process.client && localStorage.getItem("HistoryList")) {
      this.HistoryList = JSON.parse(localStorage.getItem("HistoryList"));
    }
    this.SearchKeyValue = this.$route.params.value || "";
  },
  mounted() {
    this.WOWInit();
    this.initViewer();
    // localStorage.setItem('page_number_search', this.page_number);
  }
}
</script>

<style lang="scss" scoped>
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
.books-item {
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid rgba(144, 144, 144, 0.25);
  background-color: #fff;
  &:nth-child(2n) {
    margin-right: 0;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    .title {
      font-weight: bold;
      color: #333;
      font-size: 20px;
    }
    .link {
      &:hover {
        color: #00B0FB !important;
      }
    }
  }
  .code-content {
    min-height: 0;
    word-break: break-all;
    ::v-deep {
      pre {
        margin-bottom: 20px;
      }
      img {
        max-width: 60%;
        display: block;
        height: auto;
        cursor: zoom-in;
      }
    }
  }
  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    .tags {
      .tag {
        margin: 0;
      }
      .tag a {
        display: inline-block;
        padding: 0 8px;
        border-radius: 30px;
        background-color: #45b6f7;
        margin-right: 5px;
        color: #fff !important;
        text-decoration: none;
      }
    }
  }
}
.search_button_box {
  padding: 2rem 0 0 0.3rem;
}
.search_button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-right-radius: 6px;
  border-top-right-radius: 6px;
  width: 100px;
  border: 1px solid #292b35;
  padding: 0;
}
.btn-title {
  font-size: 16px;
}
@media (prefers-color-scheme: dark) {
  .btn-title {
    color: #fff;
  }
  .search_button {
    border: 1px solid #5c5656;
  }
  .books-item {
    background-color: #000;
  }
  .books-item .header .title{
    color: #aaaaaa;
  }
}
</style>
