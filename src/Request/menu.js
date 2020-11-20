import request from '../common/request';
import { host } from '../common/config';

/* 获取商店数据 */
export async function menu ({ id,page,limit,keyword }){

   const result = await request({
      url:`${host}/food?restaurantId=${id}&page=${page}&limit=${limit}&keyword=${keyword}`,
      method:  'get',

   });

   return result;
}

export async function updateFood (data){

   const result = await request({
      url:`${host}/food`,
      method:  'post',
      data

   });

   return result;
}

