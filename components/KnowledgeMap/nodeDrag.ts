/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 17:22:12
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-06 09:31:22
 * @Description: 请填写简介
 */

import * as d3 from 'd3'
import { Graph } from '../..';
import { unShowNodeMenu } from '../NodeMenu/nodeMenu';
import { globalNodes } from './global';
import { modifyEdge } from './modifyEdge';
import { fPrefix, verticePrefix } from './prefix';

type Props = {
  current: any;
  event: any;
  node: Graph.Vertice;
  config: Graph.ConfigProps;
  edges: Graph.Line[];
}

let originX = 0;
let originY = 0;

export const dragStart = ({ current, node }: Props) => {

  node.initX = node.x!
  node.initY = node.y!
  unShowNodeMenu()

  const arc = d3.selectAll('.arc')
    .filter(`#${fPrefix + node.id}`)

  let x = 0
  let y = 0
  if (arc.node()) {
    const tempArr = arc?.attr("transform").split(",");
    // 获取当前的x和y坐标
    x = +(tempArr?.[0]?.split("(")[1] || 0);
    y = +(tempArr?.[1]?.split(")")[0] || 0);
  }


  node.initX -= x
  node.initY -= y

  d3.select(current).selectAll('*').style('cursor', 'grabbing');
}

export const dragging = ({ current, event, node, config, edges }: Props) => {
  // 修改memo
  node.x = event.x
  node.y = event.y
  const memoNode = globalNodes.find(gN => gN.id === node.id)!
  memoNode.x = event.x
  memoNode.y = event.y
  const { nodeRadius } = config
  requestAnimationFrame(() => {
    unShowNodeMenu()
    const arc = d3.selectAll('.arc')
      .filter(`#${fPrefix + node.id}`)

    arc.attr('transform', `translate(${event.x - node.initX!}, ${event.y - node.initY!})`)
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
    modifyEdge({ config, x: event.x, y: event.y, node, timer: 0 })
  })
}

export const dragEnd = ({ current, event, node, config }: Props) => {
  unShowNodeMenu()
  d3.select(current).selectAll('*').style('cursor', 'pointer');
}