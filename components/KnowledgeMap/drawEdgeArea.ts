import * as d3 from 'd3'
import style from './index.module.css'
import { Graph } from '../..'

/**
 * 描述 绘制edgeArea
 * @date 2022-07-19
 * @param {any} edges:Graph.Edge[]
 * @param {any} mode:number|undefined
 * @returns {any}
 */
export const drawEdgeArea = (edges: Graph.Edge[], centerPointId?: string) => {
  const mainPoint = d3.select(centerPointId ? `#${centerPointId}` : '#main')
  const edgeArea = d3.select('#edge-area')
    .insert('g', ':first-child')
  const edge = edgeArea
    .selectAll('g')
    .data(edges)
    .join('g')
    .filter((item) => d3.select(`#${item.fromId}${item.toId}`).nodes().length === 0)
    .classed('edge', true)
  edge
    .append('path')
    .attr('d',
      `m ${mainPoint.attr('x')} ${mainPoint.attr('y')} 
       l ${mainPoint.attr('x')} ${mainPoint.attr('y')} 
       l ${mainPoint.attr('x')} ${mainPoint.attr('y')}`
    )
    .attr('stroke-width', 1)
    .attr('stroke', '#cecece')
    .attr('id', item => item.fromId + item.toId)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 1)
    .style('marker-mid', 'url(#arrow)')
    .attr('d', function (edge) {
      const fromNode = d3.select(`#${edge.fromId}`)
      const toNode = d3.select(`#${edge.toId}`)
      let middlePointX = 0, middlePointY = 0
      if (fromNode.nodes().length !== 0 && toNode.nodes().length !== 0) {
        middlePointX = (+fromNode.attr('x') + +toNode.attr('x')) / 2
        middlePointY = (+fromNode.attr('y') + +toNode.attr('y')) / 2
      }
      return fromNode.nodes().length !== 0 && toNode.nodes().length !== 0
        ? `
          M ${fromNode.attr('x')} ${fromNode.attr('y')} 
          L ${middlePointX} ${middlePointY} 
          L ${toNode.attr('x')} ${toNode.attr('y')}
          `
        : `M 0 0`
    })
  edge
    .append('text')
    .append('textPath')
    .style('opacity', 0)
    .attr('text-anchor', 'center')
    .attr('href', item => `#${item.fromId + item.toId}`)
    .classed(style['discription'], true)
    .attr('startOffset', '50%')
    .attr('dy', 20)
    .text(item => item.discription)
    .transition()
    .duration(1000)
    .style('opacity', 1)
}