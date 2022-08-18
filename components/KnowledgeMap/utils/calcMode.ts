/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 15:13:48
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-16 15:13:48
 * @Description: 请填写简介
 */

import { Graph } from "../../.."

/**
 * 描述 计算节点数组
 * @date 2022-07-18
 * @param {any} nodes:Graph.Node[]
 * @param {any} page:number
 * @param {any} mode?:number
 * @returns {any}
 */
export const calcMode = (vertices: Graph.Vertice[], page: number, mode?: number,) => {
  if (mode === 1 || !mode) {
    return vertices
  } else {
    return vertices.length < 5 ? vertices : vertices.slice((page - 1) * 5, 5 * page)
  }
}
