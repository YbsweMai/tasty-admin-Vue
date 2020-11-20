<template>
  <div>
    <el-table :data="restList && restList.list && restList.list.slice((currentPage-1)*pageSize,currentPage*pageSize)">
      <el-table-column
        prop="name.zh-CN"
        label="餐馆"
        width="230"
      ></el-table-column>

      <el-table-column
        prop="address.formatted"
        label="地址"
        width="380"
      ></el-table-column>
      <el-table-column
        prop="tags"
        label="标签"
        width="230"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.tags"
            :key="item.label"
            :type="item.type"
            effect="dark"
          >
            {{ item.toUpperCase() }}
          </el-tag>
        </template>
        >
      </el-table-column>
      <el-table-column
        prop="action"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <!-- $permission()权限管理 -->
          <el-button
            size="mini"
            :disabled="$permission()"
            @click="handleEdit(scope.$index, scope.row)"
          >
            操作
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="isClosed"
        label="手动关闭"
        width="150"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isClosed"
            :disabled="$permission()"
            @change="(v)=>{changeClosed(v,scope.$index,scope.row)}"
          >
            >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :data="restList&&restList.list&&restList.list.length"
        :total="restList&&restList.list&&restList.list.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- modal -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <el-form-item
          label="餐馆名称:"
          style="textAlign :left"
        >
          <el-input
            v-model="resname[`${lang}`]"
            autocomplete="off"
            style="width :200px"
          >
            <el-select
              slot="prepend"
              v-model="lang"
              value="zh-CN"
              placeholder="请选择"
              @change="changeLange"
            >
              <el-option
                value="zh-CN"
                label="中文"
              />

              <el-option
                value="en-US"
                label="英文"
              />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item
          label="餐馆标签:"
          style="textAlign :left;"
        >
          <el-select
            v-model="selectTag"
            @change="addTag"
          >
            <el-option
              v-for="item in tagsTotal"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <el-tag
            v-for="item in additionTag"
            :key="item.key"
            closable
            effect="dark"
            @close="removeTag(item)"
          >
            {{ item.tag }}
          </el-tag>
        </el-form-item>
      </el-form>
      <NYTIME></NYTIME>
      <div
        v-for="(item,index) in hours"
        :key="item.key"
      >
        <span>{{ item.day }}</span>
        <el-time-picker
          v-model="item.time"
          is-range
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          style="width :350px;margin-left : 15px"
          @change="(v)=>{changeHour(v,index)}"
        ></el-time-picker>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="checkSend"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { rest,updateRest } from '../../Request/restaurant.js';
import { tags } from '../../Request/tags.js';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import Moment from 'moment';
import NYTIME from './component/NYtime';

export default {

   name:'Restaurant',
   components:{
      NYTIME
   },
   data () {

      return {
         restList:[],
         dialogFormVisible: false,
         form:[],
         formLabelWidth: '120px',
         lang:'zh-CN',
         langName:'',
         resname:'',
         value1: true,
         restTitle:'',
         tagsTotal:[],//总的tags列表
         selectTag:'',//点到到那个数值
         additionTag:[],//右侧展示的tags
         hours:[],
         newHours:[],
         currentPage:1, // 分页默认在第一页
         pageSize:10, // 每页显示10条数据

      };
   },
   computed:{

      title (){
         return _.get(this.form,'name[zh-CN]','');
      },

   },

   created (){
      this.getRest();
      this.gettags();
   },

   methods:{
      /* 获取商店数据 */
      async getRest (){
         const data = await rest();
         if (data){
            console.log('RestList',data);
            this.restList = JSON.parse(JSON.stringify(data));
            console.log('12313',this.restList);
         }

         /* 重构每个商店里的closed属性 让switch根据重构后的属性显示状态 */
         return _.map(this.restList.list,(v)=>{
            if(v.closed === undefined || v.closed === null){
               //  v.isClosed = false;
               this.$set(v, 'isClosed', false);
            }else{
               //  v.isClosed = true;
               this.$set(v, 'isClosed', true);
            }
            // console.log('this.restList.list',this.restList.list);
            return v;

         });
      },

      filterTag (value, row) {
         return row.tag === value;
      },

      /* 操作 */
      handleEdit (index, row) {
         console.log('handleEdit',index,row);
         this.dialogFormVisible = !this.dialogFormVisible;
         this.form = JSON.parse(JSON.stringify(row));
         this.restTitle = JSON.parse(JSON.stringify(row.name));
         this.form.name = JSON.parse(JSON.stringify(this.restTitle));

         this.resname = row.name;
         console.log('123333',this.restTitle);

         //  把原数组默认tags添加到新数组里(错误 每次点击操作都会push一遍tags)
         // _.forEach(row.tags,((item)=>{
         //    return this.additionTag.push({
         //       key:uuidv4(),
         //       tag:item
         //    });
         // }));

         /* 循环每一个传进来的商店tags后返回additionTag数组里 */
         this.additionTag = _.map(row.tags,((item)=>{
            return  {
               tag:item.toUpperCase(),
               key:uuidv4()
            };
         }));
         this.getWeeks((index,row).hours);
         //  console.log('closed',row.closed.closed);
      },
      /* 手动关闭 */
      // close ($event,num){
      //    console.log($event);//0 1 0 1
      //    console.log(num);// 122642  122660
      // }

      /* 切换中英文 */
      changeLange (v){

         this.lang = v;

         this.langName = _.get(this.form,`name[${v}]`);
      },

      /* 发送请求获取tags */
      async gettags (){
         const data = await tags();
         if(data){
            this.tagsTotal = data.list;
         }
      },

      /* 添加tags */
      addTag (tag){
         console.log('选中的tags===>',tag);
         this.additionTag.push({ tag:tag.toUpperCase(),key:uuidv4() } );
         console.log('additionTag',this.additionTag);
         /* lodashi去重 重复的不会再被添加进去 */
         //  this.additionTag = _.uniq(this.additionTag);

      },

      /* 移除标签tags */
      removeTag (item){
         this.additionTag = _.filter(this.additionTag,(itemTags)=>{
            return itemTags !== item;
         });

      },

      // 显示日期
      getWeeks (hours){
         const weekDay = [ '星期一','星期二','星期三','星期四','星期五','星期六','星期日' ];
         this.hours = _(weekDay).map((v,index)=>{
            const start = _.get(hours[index], 'start');
            const end = _.get(hours[index], 'end');
            return{
               day:v,
               time : [
                  Moment().startOf('day').add(start,'minutes').toDate(),
                  Moment().startOf('day').add(end,'minutes').toDate()
               ]

            };
         }).value();
         this.newHours = hours;
         console.log('this.newHours',this.newHours);

      },

      getMinute (time){

         return Moment(time).hours() * 60 + Moment(time).minute();
      },
      /* 改变时间 */
      changeHour (v,index){

         const start = this.getMinute(v[0]);
         const end = this.getMinute(v[1]);

         this.newHours[index].start = start;
         this.newHours[index].end = end;
         console.log('start',start);
         console.log('end',end);
      },

      /* 发送请求更新数据 */
      async sendData (){
         console.log('tags========>',this.additionTag);

         const data = await updateRest({
            id:this.form._id,
            data:{
               name:this.resname,
               hours:this.newHours,
               tags:_.map(this.additionTag,item =>{
                  return item.tag;
               }),
            }
         });
         if(data){
            console.log('sendData',data);
            console.log('tags===>',tags);
         }
      },

      /* 发送更新 并关闭modal */
      checkSend (){
         this.sendData();
         this.dialogFormVisible = false;
         /* 更新完毕后重新获取商店信息 */
         this.getRest();
      },

      /* 开关门 */
      async changeClosed (v, index, row){
         console.log('v=====>',v);
         let closed = v ? { closed:true } : null;
         const data = await updateRest({
            id: row._id,
            data:{ closed }
         });
         if(data){
            console.log('closed',data);
            // 你上面渲染的数据是 处理之后的数组， 那这个下标对应是处理之后的数组，，那只能再获取一下，处理之后的数组，才能修改到对应到下标到那一项，
            let arr = this.restList.list.slice((this.currentPage - 1) * this.pageSize,this.currentPage * this.pageSize);
            arr[index] = true;
         }
      },

      /* 分页控制 */
      /*  点击切换每个页面val条数据 */
      handleSizeChange (val) {

         this.pageSize = val;
         console.log(`每页 ${val} 条`);
      },
      /* 跳转到点击页面 */
      handleCurrentChange (val) {

         this.currentPage = val;
         console.log(`当前页: ${val}`);
      }

   }
};
</script>

<style lang="scss" scoped>
.el-table {
  padding : 24px;
  font-size : 18px;
}

.el-tag {
  margin-right : 5px;
}

.el-select {
  margin-right : 10px;
}

/* 只对此页面生效 */
::v-deep .el-input__inner {
   width : 120px;
}

</style>