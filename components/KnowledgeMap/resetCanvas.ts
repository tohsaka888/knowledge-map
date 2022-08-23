/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-23 11:11:54
 * @Description: 请填写简介
 */
import * as d3 from 'd3'
import { resetSize, translate } from './canvasDrag'
import { changeIsReset, explorePath, globalEdges, globalNodes } from './global'

export const resetCanvas = (needClear?: boolean) => {

  d3.select('#drag')
    .transition()
    .duration(1000)
    .attr('transform', 'translate(0, 0)')
  d3.select('#scale')
    .transition()
    .duration(1000)
    .attr('transform', 'scale(1)')
  translate.x = 0
  translate.y = 0

  // explorePath.forEach((path) => {
  //   path.inData.edges.forEach(edge => { edge.fromX = undefined; edge.fromY = undefined; edge.toX = undefined; edge.toY = undefined });
  //   path.outData.edges.forEach(edge => { edge.fromX = undefined; edge.fromY = undefined; edge.toX = undefined; edge.toY = undefined });
  // })

  resetSize()

  if (needClear !== false) {
    // 清除memo
    globalNodes.length = 0
    globalEdges.length = 0
    changeIsReset(true)
  }
}