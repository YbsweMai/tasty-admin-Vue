<template>
  <div class="login-container">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="用户名"
        prop="username"
        style="width : 500px;"
      >
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>

      <el-form-item
        label="密码"
        prop="password"
        style="width : 500px;"
      >
        <el-input
          v-model="ruleForm.password"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-button
            type="primary"
            @click="Login"
          >
            登陆
          </el-button>
          <el-button @click="drawer = true">
            显示
          </el-button>
        </el-row>
      </el-form-item>
    </el-form>

    <el-drawer
      title="可选用户名"
      :visible.sync="drawer"
      :direction="direction"
      style="text-align : left;"
    >
      <el-row :gutter="12">
        <el-col>
          <el-card shadow="always">
            <p>管理员</p>
            <p>username: admin</p>
            <p>password: 随意</p>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col>
          <el-card shadow="always">
            <p>部门员工</p>
            <p>username: employee</p>
            <p>password: 随意</p>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="12">
        <el-col>
          <el-card shadow="always">
            <p>游客</p>
            <p>username: visitor</p>
            <p>password: 随意</p>
          </el-card>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import { login } from '../Request/login.js';
import { setStorage } from '../common/utils.js';

export default {
   name:'Login',
   data (){
      return{
         ruleForm: {
            username: '',
            password:'',

         },
         rules: {
            username: [
               { required: true, message: '请输入用户名', trigger: 'blur' },

            ],
            password: [
               { required: true, message: '请输入密码', trigger: 'blur' }
            ],

         },
         /* 右侧modal */
         drawer: false,
         direction: 'rtl',
      };
   },
   methods:{
      async Login (){

         const data = await login(this.ruleForm);
         if(data){
            console.log('login',data);
            setStorage('admin-user',data);
            this.$router.push({
               name:'Admin'
            });
         }
      }
   }
};
</script>

<style lang="scss" scope>
    .login-container{
        display : flex;
        align-items : center;
        justify-content : center;
        height : 100vh;
    }

    .el-drawer{
        outline : none;
    }

    .el-drawer__header span{
        outline : none;
    }

    .el-drawer__body{
        display : flex;
        flex-direction : column;
        align-items : center;
    }

    .el-col{
        margin-bottom : 30px;
    }

    .el-card__body {
        width : 300px;
    }
</style>