<template>
  <div class="block">
    <el-date-picker
      v-model="date"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      @change="changeDay"
    >
    </el-date-picker>

    <div class="chart-container">
      <v-chart :options="orderOption" />
    </div>

    <div class="chart-container">
      <v-chart :options="peopleOption" />
    </div>
  </div>
</template>

<script>
import { Order } from '../../Request/order';

import Moment from 'moment';

/* moment-range 日期到日期之间的库 */
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

import _ from 'lodash';

/* echarts 图表库 */
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';

export default {
   name:'Order',

   data (){
      return{

         pickerOptions: {
            shortcuts: [ {
               text: '最近一周',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [ start, end ]);
               }
            }, {
               text: '最近一个月',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [ start, end ]);
               }
            }, {
               text: '最近三个月',
               onClick (picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [ start, end ]);
               }
            } ]
         },
         value1: '123',
         value2: '',
         list:[],
         //  abc:[ 1,2,3,4,5,6 ],

         /*  v-chart数据 */
         date:[],
         orderOption:{
            title:{
               text: '订单量'
            },
            xAxis: {
               type: 'category',
               data: [ ]  //  x轴名字
            },
            yAxis: {
               type: 'value'
            },
            series:  {
               data: [ ], // x轴数值
               type: 'line',

            }
         },
         peopleOption:{
            title:{
               text: '订单人群'
            },
            xAxis: {
               type: 'category',
               data: []
            },
            yAxis: {
               type: 'value'
            },
         }
      };

   },

   watch:{
      /* 监听订单数量的变化  将变化的值传入*/
      list (v){
         this.setPeopleOption(v);
         this.setOrderOption(v);
      }

   },
   methods:{

      async changeDay (v){
         let [ start , end ] = v;

         console.log('v===>',v);
         const data = await Order({
            start:start.toISOString(),
            end:end.toISOString()

         });
         if(data){
            this.list = data.list;
            console.log('orderList===>',this.list);

         }
      },

      /* 按订单分 */
      setOrderOption (list){
         /* 在时间选择器上用v-model绑定date 此处能获取到 */
         console.log('date',this.date);
         const formatStr = 'YYYY-MM-DD';

         let data = _.groupBy(list,(item)=>{
            return moment(item.createdAt).format(formatStr);
         });

         /* 另一种写法，list写在外面 最后加上.value才会执行lodash方法 */
         //  let data = _(list).groupBy((item)=>{
         //     return moment(item.createdAt).format(formatStr);
         //  }).vaule();

         console.log('data ===>',data);
         // x轴时间坐标
         const [ start , end ] = this.date;
         const range = moment.range(start, end).snapTo('day').by('days');
         const date = Array.from(range).map(m => m.format(formatStr));
         // 每天订单量 线框图
         const count = _.map(date,(d)=>{
            return data[d] ? data[d].length : 0;
         });
         // 每天订单量 饼图
         const dayCount = _.map(date,(d)=>{
            return {
               name:d,
               value :data[d] ? data[d].length : 0
            };
         });
         this.orderOption =  {
            title:{
               text: '订单量'
            },
            xAxis: {
               type: 'category',
               data: date,
            },
            yAxis: {
               type: 'value'
            },
            /* 图表距离右边的距离 */
            grid:{ right:'50%' },
            series: [ {
               data: count,
               type: 'line',
               label: {
                  normal: {
                     show: true,
                     position: 'top',
                     textStyle: {
                        color: 'white'
                     }
                  }
               }
            } ,{
               data:dayCount,
               type:'pie',
               radius:'50%',
               center:[ '75%','50%' ],
               label:{
                  show:true,
                  formatter:'{b} : {c} ({d}%)'
               }
            } ]
         };
      },

      /* 按人群分类 */
      setPeopleOption (list){

         /* 将订单中相同用户名订单返回到data */
         let data = _(list).groupBy((item)=>{
            if(item.user){
               return item.user.username;
            }
         }).value();

         /* 将重构好的data按照用户姓名和用户订单数量返回userCount */
         const userCount = _.map(data,(v,k)=>{
            console.log('userCount===>',v.length);
            return {
               name:k,
               value :v.length
            };
         });
         this.peopleOption = {
            ...this.pickerOptions,
            series: [  {
               data:userCount,
               type:'pie',
               radius:'50%',
               label:{
                  show:true,
                  formatter:'{b} : {c} ({d}%)'
               }
            } ]
         };
      },

   },
};
</script>

<style lang='scss'>
.chart-container{
   width : 100%;
   height : 300px;
   margin-top :50px;
}

.echarts {
  width : 100%;
  height : 100%;
}
</style>