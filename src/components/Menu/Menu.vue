<template>
  <div>
    <template>
      <!-- select里的v-modele是与 option里的value值绑定的-->
      <el-select
        v-model="selectId"
        style="display :block;width :220px;margin-bottom :20px"
        @change="getRestFoods"
      >
        <el-option
          v-for="item in restList"
          :key="item._id"
          :label="item.name['zh-CN']"
          :value="item._id"
        >
        </el-option>
      </el-select>
      <el-table
        :data="foods"
        style="width : 100%"
      >
        <el-table-column
          prop="name.zh-CN"
          label="名称"
          width="300"
        >
          <template slot="header">
            <span style="margin-right :20px">名称</span>
            <input
              ref="searchValue"
              v-model="keyword"
              placeholder="请输入关键字"
              class="searchInput"
              @keyup.enter="searchFood"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="price"
          label="价格"
          width="180"
        >
          <template slot-scope="scope">
            <span>
              $ {{ scope.row.price | formatPrice }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="状态"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.available"
              :disabled="$permission()"
              @change="handleSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination
      align="center"
      background
      :page-size="pageSize"
      layout="prev, pager, next,sizes,total"
      :total="total"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { rest } from '../../Request/restaurant';
import { menu,updateFood } from '../../Request/menu';
// import _ from 'lodash';
export default {
   name:'Menu',
   filters:{
      /* 菜品价格过滤 */
      formatPrice (price){
         price = (price / 100).toFixed(2);
         return price;
      },

      // abc (name){
      //    name = name + '123333';
      //    return name;
      // }
   },
   data () {
      return {
         restList:[],
         foods:[],
         /* 每个商店菜品总数 */
         total:1,
         selectId:'',
         currentPage:1,
         pageSize:10,
         keyword:'',

      };
   },

   created (){
      this.getRest();
   },

   methods:{
      /* 获取商店数据 */
      async getRest (){
         const data = await rest();
         if (data){
            // console.log('data',data);
            this.restList = data.list;
            console.log('menu====>id',this.restList);
         }
      },

      /* select每变化一次发送一次请求 */
      getRestFoods (val){
         this.selectId = val;
         //  this.keyword = '';
         this.$refs.searchValue.value = '';

         /* 每次商店变化的时候 恢复分页默认 再重新请求 */
         this.currentPage = 1;
         this.pageSize = 10;
         this.tableData();
         console.log('val==>',val);
         console.log('selectId',this.selectId);
      },

      /* 发送请求获取每个商店的食物 */
      async tableData (){

         const data = await menu(
            {
               id:this.selectId,
               page:this.currentPage,
               limit:this.pageSize,
               keyword:this.keyword
            }
         );
         if(data){
            this.foods = data.list;
            /* 将请求到的每个商店的菜品数量给total */
            this.total = data.count;
            console.log('foods=====>',this.foods.length);
         }
      },

      /* 发送请求 更新food状态 */
      async handleSwitch (row) {
         console.log(row.available);
         if (row.available === false) {
            await updateFood({
               id: row._id,
               data: {
                  available: false
               }
            });

         } else {
            await updateFood({
               id: row._id,
               data: {
                  available: true
               }
            });
         }
      },

      /* 关键字搜索 */
      searchFood (){
         this.tableData();
      },

      /* 分页控制 每页多少条数据 */
      handleSizeChange (val){
         this.pageSize = val;
         this.tableData();
      },
      /* 分页控制 第几页 */
      handleCurrentChange (val){
         this.currentPage = val;
         console.log('vale',val);
         this.tableData();
      },
   }
};
</script>
