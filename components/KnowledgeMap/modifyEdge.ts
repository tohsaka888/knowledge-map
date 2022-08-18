/*
 * @Author: tohsaka888
 * @Date: 2022-08-17 10:22:11
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-18 14:08:18
 * @Description: 请填写简介
 */

import { Graph } from "../.."
import * as d3 from 'd3'
import { edgePrefix, verticePrefix } from "./prefix";
import { globalEdges } from "./global";

type Props = {
  x: number;
  y: number;
  node: Graph.Vertice;
  config: Graph.ConfigProps;
  timer?: number
}

export const modifyEdge = ({ x, y, node, config, timer = 1000 }: Props) => {
  // 筛选出和当前节点有关的边
  const fromEdges = globalEdges.filter(edge => edge.fromVertexId === node.id)
  const toEdges = globalEdges.filter(edge => edge.toVertexId === node.id)
  // 更改入边相关的位置
  fromEdges.forEach(edge => {
    const curEdge = d3.select(`#${edgePrefix + edge.fromVertexId}${edge.toVertexId}`)
    console.log(edge)
    if (edge.toX !== undefined && edge.toY !== undefined && curEdge.nodes().length !== 0) {
      // 修改memo值
      edge.fromX = x
      edge.fromY = y
      const memoEdge = globalEdges.find(gE => gE.id == edge.id)!
      memoEdge.fromX = x
      memoEdge.fromY = y
      if (config.isStraight) {
        curEdge
          .transition()
          .duration(timer)
          .attr('d', `M ${x} ${y} L ${edge.toX} ${edge.toY}`)
      } else {
        let perX = 0
        if (edge.toX) {
          perX = (edge.toX - +x) / config.besselRate
        }
        curEdge
          .transition()
          .duration(timer)
          .attr('d', `
            M ${x} ${y},
            C ${+x + perX} ${y},
            ${edge.toX! - perX} ${edge.toY},
            ${edge.toX} ${edge.toY}
        `)
      }
    }
  })
  // 更改出边相关的位置
  toEdges.forEach(edge => {
    const curEdge = d3.select(`#${edgePrefix + edge.fromVertexId}${edge.toVertexId}`)
    if (edge.fromX && edge.fromY && curEdge.nodes().length !== 0) {
      // 修改memo值
      edge.toX = x
      edge.toY = y
      const memoEdge = globalEdges.find(gE => gE.id === edge.id)!
      memoEdge.toX = x
      memoEdge.toY = y
      if (config.isStraight) {
        curEdge
          .transition()
          .duration(timer)
          .attr('d', `M ${edge.fromX} ${edge.fromY} L ${x} ${y}`)
      } else {
        let perX = 0
        if (edge.fromX) {
          perX = (edge.fromX - +x) / config.besselRate
        }
        curEdge
          .transition()
          .duration(timer)
          .attr('d', `
            M ${edge.fromX} ${edge.fromY},
            C ${edge.fromX! - perX} ${edge.fromY},
            ${+x + perX} ${y},
            ${x} ${y}
        `)
      }
    }
  })
}
