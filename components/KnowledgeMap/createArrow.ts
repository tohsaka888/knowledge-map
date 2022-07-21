import * as d3 from 'd3'

export const createArrow = (container: SVGSVGElement) => {
  const arrowContainer = d3.select(container)
    .insert('defs', ':first-child')
    .append('marker')
    .attr('id', 'arrow')
    .attr('markerUnits', 'strokeWidth')
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('refX', 0)
    .attr('refY', 3)
    .attr('orient', 'auto')
    .attr('fill', '#cecece')
  arrowContainer
    .transition()
    .duration(1000)
    .attr('refX', 20)
  arrowContainer
    .append('path')
    .attr('d', 'M 0 0 L 8 3 L 0 6 z')
}