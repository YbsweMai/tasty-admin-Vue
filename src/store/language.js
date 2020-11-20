import * as types from './mutation-types';

const language = {
   state: {
      lang: JSON.parse(localStorage.getItem('language')) || 'zh-CN'
   },
   mutations: {
      [types.SET_LANGUAGE] (state, data) {
         state.lang = data;
      }
   },
   actions: {
      setLanguage ({ commit }, data) {
         localStorage.setItem('language', JSON.stringify(data));
         commit(types.SET_LANGUAGE, data);

      }
   }
};

export default language;