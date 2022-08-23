/*
 * @Author: tohsaka888
 * @Date: 2022-08-18 13:32:40
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-23 16:26:46
 * @Description: 请填写简介
 */

import { Graph } from "../..";

export let globalNodes: Graph.Vertice[] = [];
export let globalEdges: Graph.Line[] = [];
export let explorePath: {
  mainId: string;
  inData: { vertices: Graph.Vertice[]; edges: Graph.Line[] };
  outData: { vertices: Graph.Vertice[]; edges: Graph.Line[] };
  isExplore: boolean;
}[] = []

export let isReset = false

export const filteredPath = (id: string) => {
  explorePath = explorePath.filter(path => path.mainId !== id)
}

export const filteredNodes = (id: string) => {
  globalNodes = globalNodes.filter(n => n.id !== id)
}

export const changeIsReset = (state: boolean) => {
  isReset = state
}