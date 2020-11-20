<template>
  <div>
    <el-container>
      <el-aside width="230px">
        <el-col :span="12">
          <!-- 给default-active动态绑定路由路径 -->
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
          >
            <div class="logo">
              <img
                src="../assets/logo.png"
                alt=""
                class="logo-img"
              >
            </div>

            <el-menu-item
              index="/admin/restaurant"
              @click="click('Restaurant')"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">餐馆</span>
            </el-menu-item>

            <el-menu-item
              index="/admin/menu"
              @click="click('Menu')"
            >
              <i class="el-icon-setting"></i>
              <span slot="title">菜单</span>
            </el-menu-item>

            <!-- 用户为visitor不显示order导航 -->
            <el-menu-item
              v-if="isVisitor === false"
              index="/admin/order"
              @click="click('Order')"
            >
              <i class="el-icon-setting"></i>
              <span slot="title">订单</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-button
          class="logout-btn"
          @click="logout"
        >
          登出
        </el-button>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <el-breadcrumb
            separator="/"
            style="margin-bottom : 20px"
          >
            <el-breadcrumb-item>Admin</el-breadcrumb-item>
            <el-breadcrumb-item>{{ routerName }}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import _ from 'lodash';
import { getStorage } from '../common/utils';
export default {
   name:'Admin',
   computed:{
      routerName (){
         return this.$route.name;
      },

      /* 判断用户是否为visitor */
      isVisitor (){
         if(_.get(getStorage('admin-user'),'role') === 'visitor'){
            return true;
         }else{
            return false;
         }
      }
   },

   methods: {

      click (name){
         console.log(this.$route.path);
         this.$router.push({
            name:name
         });
      },

      logout (){
         localStorage.clear();
         this.$router.push({
            name:'Login'
         });
      }
   }
};
</script>

<style lang="scss" scope>

  .el-header, .el-footer {
    line-height : 60px;
    color : #333;
    text-align : center;
    // background-color : #B3C0D1;
  }

  .el-aside {
    position : relative;
    height : 100vh;
    line-height : 200px;
    color : #333;
    text-align : center;
    // background-color : #1f1f1f;
  }

  .el-main {
    // line-height : 160px;
    color : #333;
    // text-align : center;
    background-color : #E9EEF3;
  }

  body > .el-container {
    margin-bottom : 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height : 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height : 320px;
  }

  .el-col-12 {
    width : 100%;
    background-color : aqua;
  }

  .logo {
    display : flex;
    align-items : center;
    justify-content : center;
    height : 120px;
    .logo-img{
          height : 60px;
        }
}

.logout-btn{
    position : absolute;
    bottom : 0;
    left : 25%;
    width : 100px;
    margin : 0 auto 60px auto;
}

</style>