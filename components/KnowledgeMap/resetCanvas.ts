import * as d3 from 'd3'
import { resetSize } from './canvasDrag'

export const resetCanvas = () => {
  d3.select('#drag')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(0, 0)')
  d3.select('#scale')
    .transition()
    .duration(1000)
    .attr('transform', 'scale(1)')
  resetSize()
}