/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 17:22:12
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-18 10:45:24
 * @Description: 请填写简介
 */

import * as d3 from 'd3'
import { Graph } from '../..';
import { modifyEdge } from './modifyEdge';
import { verticePrefix } from './prefix';

type Props = {
  current: any;
  event: any;
  node: Graph.Vertice;
  config: Graph.ConfigProps;
  edges: Graph.Line[];
}

export const dragStart = ({ current }: Props) => {
  d3.select(current).selectAll('*').style('cursor', 'grabbing');
}

export const dragging = ({ current, event, node, config, edges }: Props) => {
  node.x = event.x
  node.y = event.y
  const { nodeRadius } = config
  requestAnimationFrame(() => {
    // 更改节点坐标
    const container = d3.select(current)
    container.select(`#${verticePrefix + node.id}`)
      .attr('cx', event.x)
      .attr('cy', event.y)
    container.select(`#${verticePrefix + node.id}text`)
      .attr('x', event.x)
      .attr('y', event.y)
    container.select(`#${verticePrefix + node.id}name`)
      .attr('x', event.x)
      .attr('y', event.y + nodeRadius + 10)
    modifyEdge({ edges, config, x: event.x, y: event.y, node, timer: 0 })
  })
}

export const dragEnd = ({ current, event, node, config }: Props) => {
  node.x = event.x
  node.y = event.y
  d3.select(current).selectAll('*').style('cursor', 'pointer');
}