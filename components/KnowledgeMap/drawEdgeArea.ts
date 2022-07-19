import * as d3 from 'd3'
import { Graph } from '../..'

/**
 * 描述 绘制edgeArea
 * @date 2022-07-19
 * @param {any} edges:Graph.Edge[]
 * @param {any} mode:number|undefined
 * @returns {any}
 */
export const drawEdgeArea = (edges: Graph.Edge[]) => {
  const edgeArea = d3.select('#edge-area')
    .insert('g', ':first-child')
  edgeArea
    .selectAll('g')
    .data(edges)
    .join('g')
    .classed('edge', true)
    .append('path')
    .attr('d', function (edge) {
      const fromNode = d3.select(`#${edge.fromId}`)
      const toNode = d3.select(`#${edge.toId}`)
      let middlePointX = 0, middlePointY = 0
      if (fromNode.nodes().length !== 0 && toNode.nodes().length !== 0) {
        middlePointX = (+fromNode.attr('cx') + +toNode.attr('cx')) / 2
        middlePointY = (+fromNode.attr('cy') + +toNode.attr('cy')) / 2
      }
      return fromNode.nodes().length !== 0 && toNode.nodes().length !== 0
        ? `
          M ${fromNode.attr('cx')} ${fromNode.attr('cy')} 
          L ${middlePointX} ${middlePointY} 
          M ${middlePointX} ${middlePointY} 
          L ${toNode.attr('cx')} ${toNode.attr('cy')}
          `
        : `M 0 0`
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#cecece')
    .attr('id', item => item.fromId + item.toId)
    .style('marker-mid', 'url(#arrow)')
}