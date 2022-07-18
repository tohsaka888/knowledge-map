import * as d3 from 'd3'

export const clearCanvas = () => {
  d3.select('svg').remove()
}