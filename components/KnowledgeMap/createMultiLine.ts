/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 11:47:14
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-17 16:23:40
 * @Description: 请填写简介
 */

import { Graph } from "../..";
import { createDescription } from "./createDescription";

type Props = {
  isTop: boolean;
  topCount: number;
  downCount: number;
  fromNode: Graph.Node;
  toNode: Graph.Node;
  edgeArea: d3.Selection<any, any, any, any>;
  edge: Graph.Edge;
  config: Graph.ConfigProps
}

/**
 * 描述 两条节点之间创建多条边
 * @date 2022-08-16
 * @returns {any}
 */
export const createMultiLine = ({ isTop, topCount, downCount, fromNode, toNode, edgeArea, edge, config }: Props) => {
  if (isTop) {
    topCount++
  } else {
    downCount++
  }
  // 中间点
  const angle = Math.PI / 2 - Math.atan2(fromNode.y! - toNode.y!, toNode.x! - fromNode.x!)
  const dx = -Math.cos(angle) * (isTop ? topCount * 38 : downCount * 38)
  const dy = -Math.sin(angle) * (isTop ? topCount * 38 : downCount * 38)
  const middlePoint = { x: (fromNode.x! + toNode.x! + dx) / 2 + dx, y: (fromNode.y! + toNode.y!) / 2 + dy }
  edgeArea.append('path')
    .attr('d', `
      M ${fromNode.x} ${fromNode.y},
      Q ${middlePoint.x} ${middlePoint.y}, ${toNode.x} ${toNode.y}
    `)
    .attr('fill', 'transparent')
    .attr('stroke', '#cecece')
    .attr('stroke-width', 1)
    .attr('id', edge.fromId + edge.toId + (isTop ? ('top' + topCount) : ('down' + downCount)))
  // createDescription({ edge, edgeId: edge.fromId + edge.toId + (isTop ? ('top' + topCount) : ('down' + downCount)), edgeArea, config })
}