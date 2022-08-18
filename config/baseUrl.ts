/*
 * @Author: tohsaka888
 * @Date: 2022-08-18 16:02:37
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-18 16:03:09
 * @Description: 请填写简介
 */
export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://knowledge-map.vercel.app'
    : 'http://172.16.100.149:3000'