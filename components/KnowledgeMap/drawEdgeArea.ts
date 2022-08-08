/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-08 13:52:37
 * @Description: 请填写简介
 */
import * as d3 from 'd3'
import { Graph } from '../..'


const createDescription = (edgeArea: d3.Selection<any, any, any, any>, config: Graph.ConfigProps, edge: Graph.Edge) => {
  if (config.showDisctription) {
    edgeArea
      .append('text')
      .attr('id', edge.fromId + edge.toId + 'description')
      .append('textPath')
      .style('opacity', 0)
      .attr('text-anchor', 'center')
      .attr('href', `#${edge.fromId + edge.toId}`)
      .classed('discription', true)
      .attr('fill', '#999999')
      .attr('font-size', 12)
      .attr('dominant-baseline', 'text-after-edge')
      .attr('startOffset', '50%')
      .attr('dy', 20)
      .text(edge.discription)
      .transition()
      .duration(1000)
      .style('opacity', 1)
  }
  edgeArea
    .append('text')
    .attr('id', edge.fromId + edge.toId + 'icon')
    .append('textPath')
    .attr('text-anchor', 'center')
    .attr('href', `#${edge.fromId + edge.toId}`)
    .classed('discription-icon', true)
    .attr('fill', '#999999')
    .attr('font-size', 12)
    .attr('dominant-baseline', 'central')
    .style('font-family', 'Times New Roman')
    .attr('startOffset', `${config.arrowPosition}%`)
    .append('tspan')
    .attr('dx', 0)
    .attr('dy', 0.1)
    .text(`\u25B8`)
    .style('font-size', 18)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 1)
}

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
  edges.forEach((edge) => {
    const fromNode = nodes.find(node => node.id === edge.fromId)
    const toNode = nodes.find(node => node.id === edge.toId)
    if (fromNode && toNode) {
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
      createDescription(edgeArea, config, edge)
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
  edges.forEach((edge, index) => {
    const fromNode = nodes.find(node => node.id === edge.fromId)
    const toNode = nodes.find(node => node.id === edge.toId)
    let perX = 0
    if (fromNode && toNode && fromNode.x && toNode.x) {
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
      createDescription(edgeArea, config, edge)
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