/*
 * @Author: tohsaka888
 * @Date: 2022-08-18 16:02:37
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-16 08:57:42
 * @Description: 请填写简介
 */
export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://knowledge-map.netlify.app'
    : 'http://localhost:3000'