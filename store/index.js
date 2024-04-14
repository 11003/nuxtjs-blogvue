import { friendLinks, systemConfig, indexList, hotList } from "@/api";

export const state = () => ({
  config: {
    seo_name: 'Sonder'
  },
  links: {},
  hotListData: [],
  articlePass: null,
  articleByAbout: null,
});

export const mutations = {
  SET_CONFIG: (state, config) => {
    state.config = config;
  },
  SET_LINKS: (state, link) => {
    state.links = link;
  },
  SET_ARTICLE_PASS: (state, articlePass) => {
    state.articlePass = articlePass;
  },
  SET_ARTICLE_BY_ABOUT: (state, article) => {
    state.articleByAbout = article;
  },
  SET_HOT_LIST: (state, hotList) => {
    state.hotListData = hotList;
  }
};

export const actions = {
  getHotList({ commit }, params) {
    return new Promise((resolve, reject) => {
      hotList(params)
        .then(response => {
          commit('SET_HOT_LIST', response);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getSystemConfig({ commit }, params) {
    return new Promise((resolve, reject) => {
      systemConfig(params)
        .then(response => {
          commit('SET_CONFIG', response);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getFriendLinks({ commit }, params) {
    return new Promise((resolve, reject) => {
      friendLinks(params)
        .then(response => {
          commit('SET_LINKS', response);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  setArticlePass({ commit }, data) {
    commit('SET_ARTICLE_PASS', data)
  }
};

export const getters = {
  config: state => state.config,
  links: state => state.links,
  articlePass: state => state.articlePass,
  articleByAbout: state => state.articleByAbout,
  hotListData: state => JSON.parse(JSON.stringify(state.hotListData)),
}