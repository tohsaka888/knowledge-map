/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 15:04:04
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-16 15:35:06
 * @Description: 请填写简介
 */

export const transferLabelName = (labelName: string): string => {
  switch (labelName) {
    case 'model_property':
      return '模型'
    default:
      return '未知'
  }
}