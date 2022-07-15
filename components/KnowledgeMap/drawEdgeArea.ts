import * as d3 from 'd3'

export const drawEdgeArea = (container: SVGGElement, edges: Graph.Edge[]) => {
  d3.select(container)
    .insert('g', ':first-child')
    .selectAll('g')
    .data(edges)
    .join('g')
    .append('path')
    .attr('d', function (edge) {
      const fromNode = d3.select(`#${edge.fromId}`)
      const toNode = d3.select(`#${edge.toId}`)
      return `M ${fromNode.attr('cx')} ${fromNode.attr('cy')} L ${toNode.attr('cx')} ${toNode.attr('cy')}`
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#cecece')
    .attr('id', item => item.fromId + item.toId)
}