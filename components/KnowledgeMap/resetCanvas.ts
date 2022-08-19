/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-19 14:20:48
 * @Description: 请填写简介
 */
import * as d3 from 'd3'
import { resetSize, translate } from './canvasDrag'

export const resetCanvas = () => {
  translate.x = 0
  translate.y = 0

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