/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-24 14:11:01
 * @Description: 请填写简介
 */
import * as d3 from 'd3'
import { Graph } from '../..'
import { createDescription } from './createDescription'
import { createMultiLine } from './createMultiLine'
import { exploreTimer, globalEdges, initDraw, isReset } from './global'
import { edgePrefix, verticePrefix } from './prefix'

/**
 * 画直线
 * @date 2022-08-01
 * @param {any} edge
 * @param {any} mainPoint
 * @returns {any}
 */
const drawStraightLine = (
  { nodes, edgeArea, edges, config, fId, mainPoint, duration, init }:
    {
      nodes: Graph.Vertice[],
      edges: Graph.Line[],
      mainPoint: Graph.Vertice,
      config: Graph.ConfigProps,
      edgeArea: d3.Selection<any, unknown, any, any>,
      fId?: string;
      duration: number;
      init?: boolean
    }
) => {
  let topCount = 0
  let downCount = 0
  let parentClass = fId
  let delay = init ? 0 : duration
  edges.forEach((edge) => {

    const fromNode = nodes.find(node => node.id === edge.fromVertexId)
    const toNode = nodes.find(node => node.id === edge.toVertexId)


    if (fromNode && toNode) {
      if (!(document.getElementById(verticePrefix + fromNode.id) && document.getElementById(verticePrefix + toNode.id))) {
        return
      }
      // 判断之前两个节点之间是否已经有连线
      // memo 记录值
      edge.fromX = fromNode?.x
      edge.fromY = fromNode?.y
      edge.toX = toNode?.x
      edge.toY = toNode?.y
      globalEdges.push(edge)

      const isExist = document.getElementById(edgePrefix + fromNode.id + toNode.id) || document.getElementById(edgePrefix + toNode.id + fromNode.id)
      const parent = [fId!, ...fromNode.p!, ...toNode.p!]
      parentClass = parent.map(p => verticePrefix + p).join(' ')
      // 判断当前连线在上方or下方
      const isTop = (fromNode.x as number) < (toNode.x as number)
      if (isExist) {
        // createMultiLine({ isTop, fromNode, toNode, topCount, downCount, edgeArea, config, edge })
      } else {
        const current = edgeArea
          .append('path')
          .attr('d',
            `m ${mainPoint.x} ${mainPoint.y} 
       l ${mainPoint.x} ${mainPoint.y} 
       l ${mainPoint.x} ${mainPoint.y}`
          )
          .attr('stroke-width', config.lineWidth / 10)
          .attr('stroke', '#cecece')
          .attr('id', edgePrefix + edge.fromVertexId + edge.toVertexId)
          .classed(parentClass, true)
          .style('opacity', 0);
        current.transition()
          .delay(isReset ? exploreTimer : delay)
          .duration(isReset ? exploreTimer : duration)
          .style('opacity', 1)
          .attr('d', `M ${fromNode.x} ${fromNode.y},L ${toNode.x} ${toNode.y}`);
        createDescription({ edgeArea, config, edge, edgeId: edgePrefix + edge.fromVertexId + edge.toVertexId, fId: parentClass, duration, delay })
      }
    }
  })
}

/**
 * 画贝塞尔曲线
 * @date 2022-08-01
 * @param {any} edge
 * @param {any} mainPoint
 * @returns {any}
 */
const drawBesselLine = (
  { nodes, edges, mainPoint, config, edgeArea, fId, duration, init }:
    {
      nodes: Graph.Vertice[],
      edges: Graph.Line[],
      mainPoint: Graph.Vertice,
      config: Graph.ConfigProps,
      edgeArea: d3.Selection<any, unknown, any, any>,
      fId?: string,
      duration: number;
      init?: boolean
    }
) => {
  let topCount = 0;
  let downCount = 0;
  let parentClass = fId
  let delay = init ? 0 : duration
  edges.forEach((edge, index) => {
    const fromNode = nodes.find(node => node.id === edge.fromVertexId)
    const toNode = nodes.find(node => node.id === edge.toVertexId)

    // memo 记录值
    edge.fromX = fromNode?.x
    edge.fromY = fromNode?.y
    edge.toX = toNode?.x
    edge.toY = toNode?.y
    globalEdges.push(edge)

    let perX = 0
    if (fromNode && toNode && fromNode.x && toNode.x) {
      if (!(document.getElementById(verticePrefix + fromNode.id) && document.getElementById(verticePrefix + toNode.id))) {
        return
      }
      const parent = [fId!, ...fromNode.p!, ...toNode.p!]
      parentClass = parent.map(p => verticePrefix + p).join(' ')
      // 判断之前两个节点之间是否已经有连线
      const isExist = document.getElementById(edgePrefix + fromNode.id + toNode.id) || document.getElementById(edgePrefix + toNode.id + fromNode.id)
      // 判断当前连线在上方or下方
      const isTop = (fromNode.x as number) < (toNode.x as number)
      if (isExist) {
        // createMultiLine({ fromNode, toNode, isTop, edge, edgeArea, topCount, downCount, config })
      } else {
        perX = (toNode.x - fromNode.x) / config.besselRate
        edgeArea.append('path')
          .attr('d',
            `m ${mainPoint.x} ${mainPoint.y} 
       l ${mainPoint.x} ${mainPoint.y} 
       l ${mainPoint.x} ${mainPoint.y}
      `
          )
          .attr('stroke-width', config.lineWidth)
          .attr('stroke', '#cecece')
          .attr('fill', 'transparent')
          .classed(parentClass, true)
          .attr('id', edgePrefix + edge.fromVertexId + edge.toVertexId)
          .style('opacity', 0)
          .transition()
          .duration(isReset ? exploreTimer : duration)
          .style('opacity', 1)
          .attr('d', `
      M ${fromNode.x} ${fromNode.y},
      C ${+fromNode.x + perX} ${fromNode.y},
      ${+toNode.x - perX} ${toNode.y}
      ${toNode.x} ${toNode.y}
      `)
        createDescription({ edgeArea, config, edge, edgeId: edgePrefix + edge.fromVertexId + edge.toVertexId, fId: parentClass, duration, delay })
      }
    }
  })
}

/**
 * 描述 绘制edgeArea
 * @date 2022-07-19
 * @param {any} edges:Graph.Edge[]
 * @param {any} mode:number|undefined
 * @returns {any}
 */

type Props = {
  nodes: Graph.Vertice[];
  edges: Graph.Line[];
  config: Graph.ConfigProps;
  mainPoint?: Graph.Vertice;
  init?: boolean;
  fId?: string;
  duration: number;
}

export const drawEdgeArea = ({ nodes, edges, config, mainPoint, init, fId, duration }: Props) => {
  const needDrawNodes = nodes.filter(node => node.x && node.y)
  let edgeArea = null

  if (init) {
    edgeArea = d3.select('#edge-area')
      .insert('g', ':first-child')
      .on('mouseover', () => {
        d3.select('#border')
          .select('circle')
          .attr('stroke-width', 0)
          .attr('r', 0)
      })
  } else {
    edgeArea = d3.select('#edge-area').select('g')
  }

  // 画线
  if (mainPoint) {
    if (config.isStraight) {
      drawStraightLine({ nodes: needDrawNodes, edges, mainPoint, config, edgeArea, fId, duration, init })
    } else {
      drawBesselLine({ nodes: needDrawNodes, edges, mainPoint, config, edgeArea, fId, duration, init })
    }
  }
}