import Vue from 'vue';
import VueRouter from 'vue-router';

import _ from 'lodash';
import { getStorage } from '../common/utils';

Vue.use(VueRouter);

const routes = [
   {
      path: '/admin',
      name: 'Admin',
      redirect:'admin/restaurant',
      component:() => import('../views/Admin.vue'),
      children:[
         {
            path:'restaurant',
            name:'Restaurant',
            component:() => import('../components/Restaurant/Restaurant.vue')
         },
         {
            path:'menu',
            name:'Menu',
            component:() => import('../components/Menu/Menu.vue'),
         },
         {
            path:'order',
            name:'Order',
            component:() => import('../components/Order/Order.vue'),
            /* 路由守卫 如果用户为visitor无法进入order页面 */
            beforeEnter: (to, from, next) => {
               let isVisitor = _.get(getStorage('admin-user'),'role') === 'visitor';
               if(isVisitor){
                  next({
                     name:'Restaurant'
                  });
               }else{
                  next();
               }
            }
         }
      ]
   },
   {
      path:'/login',
      name:'Login',
      component:() => import('../views/Login.vue')
   }
];

/* 路由跳转控制台报错
   * Navigation cancelled from "/admin/restaurant" to "/admin/Menu" with a new navigation.
   * 解决方案
 */
const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push (location) {

   return originalPush.call(this, location).catch(err => err);

};

const router = new VueRouter({
   mode: 'history',
   base: process.env.BASE_URL,
   routes
});

// 全局路由守卫 检测在登陆情况下无法进入login页面
router.beforeEach((to,from,next) => {
   const isLogin = localStorage.getItem('admin-user');
   // 检测跳往login页面是否登陆 如果登陆跳转到restaurant
   if(to.name == 'Login'){
      if(isLogin){
         next({
            name:'Restaurant'
         });
      }else {
         next();
      }

   }else{
      next();
   }
});

export default router;
