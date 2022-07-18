import * as d3 from 'd3'

// const calcEdges = (edges: Graph.Edge[], mode: number | undefined) => {
//   if (mode === 1 || !mode) {
//     return edges
//   } else {
//     return edges.slice(0, 5)
//   }
// }

export const drawEdgeArea = (container: SVGGElement, edges: Graph.Edge[], mode: number | undefined) => {
  d3.select(container)
    .insert('g', ':first-child')
    .selectAll('g')
    .data(edges)
    .join('g')
    .append('path')
    .attr('d', function (edge) {
      const fromNode = d3.select(`#${edge.fromId}`)
      const toNode = d3.select(`#${edge.toId}`)
      return fromNode.nodes().length !== 0 && toNode.nodes().length !== 0 && `M ${fromNode.attr('cx')} ${fromNode.attr('cy')} L ${toNode.attr('cx')} ${toNode.attr('cy')}`
    })
    .attr('stroke-width', 1)
    .attr('stroke', '#cecece')
    .attr('id', item => item.fromId + item.toId)
}