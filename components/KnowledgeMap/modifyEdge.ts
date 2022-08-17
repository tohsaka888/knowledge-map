/*
 * @Author: tohsaka888
 * @Date: 2022-08-17 10:22:11
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-17 15:04:54
 * @Description: 请填写简介
 */

import { Graph } from "../.."
import * as d3 from 'd3'
import { edgePrefix, verticePrefix } from "./prefix";

type Props = {
  edges: Graph.Line[];
  x: number;
  y: number;
  node: Graph.Vertice;
  config: Graph.ConfigProps;
}

export const modifyEdge = ({ edges, x, y, node, config }: Props) => {
  // 筛选出和当前节点有关的边
  const fromEdges = edges.filter(edge => edge.fromVertexId === node.id)
  const toEdges = edges.filter(edge => edge.toVertexId === node.id)
  // 更改入边相关的位置
  fromEdges.forEach(edge => {
    const toNode = d3.select(`#${verticePrefix + edge.toVertexId}`)
    const curEdge = d3.select(`#${edgePrefix + edge.fromVertexId}${edge.toVertexId}`)
    if (toNode.nodes().length !== 0 && curEdge.nodes().length !== 0) {
      if (config.isStraight) {
        curEdge
          .transition()
          .duration(1000)
          .attr('d', `M ${x} ${y} L ${toNode.attr('cx')} ${toNode.attr('cy')}`)
      } else {
        let perX = 0
        if (toNode.nodes().length !== 0) {
          perX = (+toNode.attr('cx') - +x) / config.besselRate
        }
        curEdge
          .transition()
          .duration(1000)
          .attr('d', `
            M ${x} ${y},
            C ${+x + perX} ${y},
            ${+toNode.attr('cx') - perX} ${toNode.attr('cy')},
            ${toNode.attr('cx')} ${toNode.attr('cy')}
        `)
      }
    }
  })
  // 更改出边相关的位置
  toEdges.forEach(edge => {
    const fromNode = d3.select(`#${verticePrefix + edge.fromVertexId}`)
    const curEdge = d3.select(`#${edgePrefix + edge.fromVertexId}${edge.toVertexId}`)
    if (fromNode.nodes().length !== 0 && curEdge.nodes().length !== 0) {
      if (config.isStraight) {
        curEdge
          .transition()
          .duration(1000)
          .attr('d', `M ${fromNode.attr('cx')} ${fromNode.attr('cy')} L ${x} ${y}`)
      } else {
        let perX = 0
        if (fromNode.nodes().length !== 0) {
          perX = (+fromNode.attr('cx') - +x) / config.besselRate
        }
        curEdge
          .transition()
          .duration(1000)
          .attr('d', `
            M ${fromNode.attr('cx')} ${fromNode.attr('cy')},
            C ${+fromNode.attr('cx') - perX} ${fromNode.attr('cy')},
            ${+x + perX} ${y},
            ${x} ${y}
        `)
      }
    }
  })
}
