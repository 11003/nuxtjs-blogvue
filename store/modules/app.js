import {friendLinks, systemConfig} from "@/api";

const state = {
  config: {
    seo_name: 'Sonder'
  },
  links: {},
  articlePass: null,
  articleByAbout: null,
};

const mutations = {
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
};

const actions = {
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

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
