/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 09:42:05
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-16 10:43:30
 * @Description: 请填写简介
 */

import { Graph } from "../..";

export const FakeEdges: Graph.Edge[] = [
  {
    fromId: 'n1',
    toId: 'n2',
    discription: '描述1'
  },
  {
    fromId: 'n1',
    toId: 'n2',
    discription: '描述2'
  },
  {
    fromId: 'n1',
    toId: 'n2',
    discription: '你你'
  },
  {
    fromId: 'n1',
    toId: 'n2',
    discription: '呢呢'
  },
  {
    fromId: 'n1',
    toId: 'n2',
    discription: 'test'
  },
  {
    fromId: 'n2',
    toId: 'n1',
    discription: 'test'
  },
  {
    fromId: 'n2',
    toId: 'n1',
    discription: 'null'
  },
]
