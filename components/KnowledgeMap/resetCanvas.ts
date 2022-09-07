/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-07 16:31:35
 * @Description: 请填写简介
 */
import * as d3 from 'd3'
import { insideAutoExplore, outsideAutoExplore } from './autoExplore'
import { resetSize, translate } from './canvasDrag'
import { changeInitDraw, changeIsReset, explorePath, exploreTimer, globalEdges, globalNodes, isReset } from './global'

export const resetCanvas = (needClear?: boolean) => {

  insideAutoExplore.cancel()
  outsideAutoExplore.cancel()

  changeInitDraw(true)

  explorePath.forEach((path) => {
    path.isExplore = false
  })
  d3.select('#drag')
    .transition()
    .duration(isReset ? exploreTimer : 1000)
    .attr('transform', 'translate(0, 0)')
  d3.select('#scale')
    .transition()
    .duration(isReset ? exploreTimer : 1000)
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
    if (explorePath.length > 0) {
      changeIsReset(true)
    }
  }
}