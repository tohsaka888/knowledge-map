/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-04 13:32:17
 * @Description: 请填写简介
 */
import * as d3 from 'd3'
import { Graph } from '../..'


/**
 * 画直线
 * @date 2022-08-01
 * @param {any} edge
 * @param {any} mainPoint
 * @returns {any}
 */
const drawStraightLine = (
  edge: d3.Selection<d3.BaseType | SVGGElement, Graph.Edge, SVGGElement, unknown>,
  mainPoint: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  config: Graph.ConfigProps
) => {
  edge
    .append('path')
    .attr('d',
      `m ${mainPoint.attr('x')} ${mainPoint.attr('y')} 
       l ${mainPoint.attr('x')} ${mainPoint.attr('y')} 
       l ${mainPoint.attr('x')} ${mainPoint.attr('y')}`
    )
    .attr('stroke-width', config.lineWidth)
    .attr('stroke', '#cecece')
    .attr('id', item => item.fromId + item.toId)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 1)
    // .style('marker-mid', 'url(#arrow)')
    .attr('d', function (edge) {
      const fromNode = d3.select(`#${edge.fromId}`)
      const toNode = d3.select(`#${edge.toId}`)
      return fromNode.nodes().length !== 0 && toNode.nodes().length !== 0
        ? `
          M ${fromNode.attr('x')} ${fromNode.attr('y')} 
          L ${toNode.attr('x')} ${toNode.attr('y')}
          `
        : `M 0 0`
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
  edge: d3.Selection<d3.BaseType | SVGGElement, Graph.Edge, SVGGElement, unknown>,
  mainPoint: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  config: Graph.ConfigProps
) => {
  edge.append('path')
    .attr('d',
      `m ${mainPoint.attr('x')} ${mainPoint.attr('y')} 
       l ${mainPoint.attr('x')} ${mainPoint.attr('y')} 
       l ${mainPoint.attr('x')} ${mainPoint.attr('y')}
      `
    )
    .attr('stroke-width', config.lineWidth)
    .attr('stroke', '#cecece')
    .attr('fill', 'transparent')
    .attr('id', item => item.fromId + item.toId)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 1)
    .attr('d', function (edge) {
      const fromNode = d3.select(`#${edge.fromId}`)
      const toNode = d3.select(`#${edge.toId}`)
      let perX = 0
      if (fromNode.nodes().length !== 0 && toNode.nodes().length !== 0) {
        perX = (+toNode.attr('x') - +fromNode.attr('x')) / config.besselRate
      }
      return fromNode.nodes().length !== 0 && toNode.nodes().length !== 0
        ?
        `
          M ${fromNode.attr('x')} ${fromNode.attr('y')},
          C ${+fromNode.attr('x') + perX} ${fromNode.attr('y')},
          ${+toNode.attr('x') - perX} ${toNode.attr('y')}
          ${toNode.attr('x')} ${toNode.attr('y')}
          `
        : `M 0 0`
    })
}

/**
 * 描述 绘制edgeArea
 * @date 2022-07-19
 * @param {any} edges:Graph.Edge[]
 * @param {any} mode:number|undefined
 * @returns {any}
 */
export const drawEdgeArea = (edges: Graph.Edge[], config: Graph.ConfigProps, centerPointId?: string,) => {
  const mainPoint = d3.select(`#${centerPointId || 'main'}`)
  const edgeArea = d3.select('#edge-area')
    .insert('g', ':first-child')
    .on('mouseover', () => {
      d3.select('#border')
        .select('circle')
        .attr('stroke-width', 0)
        .attr('r', 0)
    })
  const edge = edgeArea
    .selectAll('g')
    .data(edges)
    .join('g')
    .filter((item) => d3.select(`#${item.fromId}${item.toId}`).nodes().length === 0)
    .classed('edge', true)

  // 画线
  if (config.isStraight) {
    drawStraightLine(edge, mainPoint, config)
  } else {
    drawBesselLine(edge, mainPoint, config)
  }

  // 描述
  if (config.showDisctription) {
    edge
      .append('text')
      .append('textPath')
      .style('opacity', 0)
      .attr('text-anchor', 'center')
      .attr('href', item => `#${item.fromId + item.toId}`)
      .classed('discription', true)
      .attr('fill', '#999999')
      .attr('font-size', 12)
      .attr('dominant-baseline', 'text-after-edge')
      .attr('startOffset', '50%')
      .attr('dy', 20)
      .text(item => item.discription)
      .transition()
      .duration(1000)
      .style('opacity', 1)
  }
  edge
    .append('text')
    .append('textPath')
    .attr('text-anchor', 'center')
    .attr('href', item => `#${item.fromId + item.toId}`)
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