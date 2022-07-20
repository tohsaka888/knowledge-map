import * as d3 from 'd3'
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
  edgeArea
    .selectAll('g')
    .data(edges)
    .join('g')
    .filter((item) => d3.select(`#${item.fromId}${item.toId}`).nodes().length === 0)
    .classed('edge', true)
    .append('path')
    .attr('d', `m ${mainPoint.attr('x')} 400 l ${mainPoint.attr('x')} 400 l ${mainPoint.attr('x')} 400`)
    .attr('stroke-width', 1)
    .attr('stroke', '#cecece')
    .attr('id', item => item.fromId + item.toId)
    .style('marker-mid', 'url(#arrow)')
    .transition()
    .duration(1000)
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
}