/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 09:45:23
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-16 11:22:23
 * @Description: 请填写简介
 */

import * as d3 from 'd3'
import { Graph } from '../..'
import { createDescription } from './createDescription';

type Props = {
  nodes: Graph.Node[];
  edges: Graph.Edge[];
}

export const drawEdges = ({ nodes, edges }: Props) => {
  const edgeArea = d3.select('#edgeArea')
  let topCount = 0;
  let downCount = 0;
  edges.forEach((edge, index) => {
    const fromNode = nodes.find(node => node.id === edge.fromId)
    const toNode = nodes.find(node => node.id === edge.toId)

    if (fromNode && toNode) {
      // 判断之前两个节点之间是否已经有连线
      const isExist = document.getElementById(fromNode.id + toNode.id) || document.getElementById(toNode.id + fromNode.id)
      // 判断当前连线在上方or下方
      const isTop = (fromNode.x as number) < (toNode.x as number)
      if (isExist) {
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
        createDescription({ edge, edgeId: edge.fromId + edge.toId + (isTop ? ('top' + topCount) : ('down' + downCount)), container: edgeArea })
      } else {
        edgeArea.append('path')
          .attr('d', `
            M ${fromNode.x} ${fromNode.y},
            L ${toNode.x} ${toNode.y},
          `)
          .attr('stroke', '#cecece')
          .attr('stroke-width', 1)
          .attr('id', fromNode.id + toNode.id)
        createDescription({ edge, edgeId: fromNode.id + toNode.id, container: edgeArea })
      }
    }
  })
}
