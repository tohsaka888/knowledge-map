/*
 * @Author: tohsaka888
 * @Date: 2022-08-17 09:28:22
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-19 15:51:52
 * @Description: 请填写简介
 */

import { Graph } from "../../.."

type Props = {
  inData: Graph.Vertice[];
  outData: Graph.Vertice[];
}

export const calcSize = ({ inData, outData }: Props): number => {
  if (inData.length === 0 && outData.length === 0) {
    return 0
  } else if (inData.length !== 0 && outData.length !== 0) {
    return 1.2
  } else {
    return 0.3
  }
}