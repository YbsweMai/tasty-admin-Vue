import request from '../common/request';
import { host } from '../common/config';

/* 获取商店数据 */
export async function rest (){

   const result = await request({
      url:`${host}/restaurant/location/-74.0059413,40.7127837`,
      method:  'get',

   });

   return result;
}

/* 发送更新请求 */
export async function updateRest (data){

   const result = await request({
      url:`${host}/restaurant`,
      method:  'post',
      data
   });

   return result;
}