/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 17:13:59
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-22 10:23:56
 * @Description: 请填写简介
 */

import { Graph } from "../../../.."
import * as d3 from 'd3'
import { edgePrefix, verticePrefix } from "../../prefix"
import { calcMode } from "../../utils/calcMode"
import { drawSideNodes } from "../../drawSideNodes"
import { globalNodes } from "../../global"
import { drawEdgeArea } from "../../drawEdgeArea"

type Props = {
  pagination: { page: number, pageSize: number },
  originNodes: Graph.Vertice[],
  total: number,
  maxAngle: number,
  edges: Graph.Line[],
  config: Graph.ConfigProps,
  isInside: boolean,
  centerPoint: Graph.Vertice,
  atanAngle: number,
  insideLength: number,
  outsideLength: number
}

export const nextPage = (
  {
    pagination,
    originNodes,
    total,
    maxAngle,
    config,
    isInside,
    centerPoint,
    edges,
    atanAngle,
    insideLength,
    outsideLength
  }: Props
) => {
  const { mode } = config
  // 清除节点和线
  const type = originNodes[0].labelName!
  const currentNodes = originNodes.slice((pagination.page - 1) * 5, 5 * pagination.page)

  const nextContainer = d3.selectAll(`.${type}`)
    .filter(`.${verticePrefix + centerPoint.id}`)
  nextContainer
    .selectAll('*')
    .remove()
  edges.forEach((edge) => {
    originNodes.forEach(node => {
      if (edge.fromVertexId === centerPoint.id && edge.toVertexId === node.id) {
        d3.select(`#${edgePrefix + edge.fromVertexId}${edge.toVertexId}`).remove()
        d3.select(`#${edgePrefix + edge.fromVertexId}${edge.toVertexId}description`).remove()
        d3.select(`#${edgePrefix + edge.fromVertexId}${edge.toVertexId}icon`).remove()
      }
    })
  })

  pagination.page = (pagination.page + 1) % total === 0 ? total : (pagination.page + 1) % total
  const nodes = calcMode(originNodes, pagination.page, mode)

  const nodeIndex = globalNodes.findIndex(gN => gN.id === currentNodes[0].id)
  globalNodes.splice(nodeIndex, 5)

  d3.selectAll(`.arc`)
    .filter(`.${verticePrefix + centerPoint.id}`)
    .select(`#${verticePrefix + type}-text`)
    .text(`${pagination.page}/${total}`)

  drawSideNodes(
    {
      typeNodes: [nodes],
      config,
      isInside,
      centerPoint,
      maxAngle,
      edges,
      fId: centerPoint.id,
      atanAngle,
      insideLength,
      outsideLength,
      nextContainer,
      duration: 0
    }
  )

  drawEdgeArea({
    nodes: [...nodes, centerPoint],
    edges,
    config,
    mainPoint: centerPoint,
    // fId: centerPoint.id,
    duration: 0
  })
}
