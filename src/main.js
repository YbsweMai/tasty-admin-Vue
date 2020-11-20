import Vue from 'vue';
import App from './App.vue';
import router from './router';

import store from './store';

Vue.config.productionTip = false;

/* element-ui库 */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

/* Echarts 图表库 */
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
Vue.component('v-chart', ECharts);

/* 权限 */
import { getStorage } from './common/utils';
Vue.prototype.$permission = function (){
   const role = getStorage(('admin-user'),'role');
   if(role !== 'admin'){
      return true;
   }
};

new Vue({
   router,
   store,
   render: h => h(App)
}).$mount('#app');
