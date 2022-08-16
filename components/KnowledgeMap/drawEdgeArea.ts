/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-16 11:52:27
 * @Description: 请填写简介
 */
import * as d3 from 'd3'
import { Graph } from '../..'
import { createDescription } from './createDescription'
import { createMultiLine } from './createMultiLine'

/**
 * 画直线
 * @date 2022-08-01
 * @param {any} edge
 * @param {any} mainPoint
 * @returns {any}
 */
const drawStraightLine = (
  nodes: Graph.Node[],
  edges: Graph.Edge[],
  mainPoint: Graph.Node,
  config: Graph.ConfigProps,
  edgeArea: d3.Selection<any, unknown, any, any>
) => {
  let topCount = 0
  let downCount = 0
  edges.forEach((edge) => {
    const fromNode = nodes.find(node => node.id === edge.fromId)
    const toNode = nodes.find(node => node.id === edge.toId)
    if (fromNode && toNode) {
      // 判断之前两个节点之间是否已经有连线
      const isExist = document.getElementById(fromNode.id + toNode.id) || document.getElementById(toNode.id + fromNode.id)
      // 判断当前连线在上方or下方
      const isTop = (fromNode.x as number) < (toNode.x as number)
      if (isExist) {
        createMultiLine({ isTop, fromNode, toNode, topCount, downCount, edgeArea, config, edge })
      } else {
        const current = edgeArea
          .append('path')
          .attr('d',
            `m ${mainPoint.x} ${mainPoint.y} 
       l ${mainPoint.x} ${mainPoint.y} 
       l ${mainPoint.x} ${mainPoint.y}`
          )
          .attr('stroke-width', config.lineWidth)
          .attr('stroke', '#cecece')
          .attr('id', edge.fromId + edge.toId)
          .style('opacity', 0);
        current.transition()
          .duration(1000)
          .style('opacity', 1)
          .attr('d', `M ${fromNode.x} ${fromNode.y},L ${toNode.x} ${toNode.y}`);
        createDescription({ edgeArea, config, edge, edgeId: edge.fromId + edge.toId })
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
  nodes: Graph.Node[],
  edges: Graph.Edge[],
  mainPoint: Graph.Node,
  config: Graph.ConfigProps,
  edgeArea: d3.Selection<any, unknown, any, any>
) => {
  let topCount = 0;
  let downCount = 0;
  edges.forEach((edge, index) => {
    const fromNode = nodes.find(node => node.id === edge.fromId)
    const toNode = nodes.find(node => node.id === edge.toId)
    let perX = 0
    if (fromNode && toNode && fromNode.x && toNode.x) {
      // 判断之前两个节点之间是否已经有连线
      const isExist = document.getElementById(fromNode.id + toNode.id) || document.getElementById(toNode.id + fromNode.id)
      // 判断当前连线在上方or下方
      const isTop = (fromNode.x as number) < (toNode.x as number)
      if (isExist) {
        createMultiLine({ fromNode, toNode, isTop, edge, edgeArea, topCount, downCount, config })
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
          .attr('id', edge.fromId + edge.toId)
          .style('opacity', 0)
          .transition()
          .duration(1000)
          .style('opacity', 1)
          .attr('d', `
      M ${fromNode.x} ${fromNode.y},
      C ${+fromNode.x + perX} ${fromNode.y},
      ${+toNode.x - perX} ${toNode.y}
      ${toNode.x} ${toNode.y}
      `)
        createDescription({ edgeArea, config, edge, edgeId: edge.fromId + edge.toId })
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
export const drawEdgeArea = (nodes: Graph.Node[], edges: Graph.Edge[], config: Graph.ConfigProps, centerPointId?: string, init?: boolean) => {
  const needDrawNodes = nodes.filter(node => node.x && node.y)
  const mainPoint = nodes.find(node => node.id === (centerPointId || 'main'))

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
      drawStraightLine(needDrawNodes, edges, mainPoint, config, edgeArea)
    } else {
      drawBesselLine(needDrawNodes, edges, mainPoint, config, edgeArea)
    }
  }
}