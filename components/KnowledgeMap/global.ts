/*
 * @Author: tohsaka888
 * @Date: 2022-08-18 13:32:40
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-06 13:49:40
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

export let initDraw = true

export let exploreTimer: number = 300

export const filteredPath = (id: string) => {
  explorePath = explorePath.filter(path => path.mainId !== id)
}

export const filteredNodes = (id: string) => {
  globalNodes = globalNodes.filter(n => n.id !== id)
}

export const changeIsReset = (state: boolean) => {
  isReset = state
}

export const changeInitDraw = (state: boolean) => {
  initDraw = state
}

export const nodeMenuWidth = 10;