/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-18 16:51:34
 * @Description: 请填写简介
 */
import { message } from 'antd'
import * as d3 from 'd3'
import { Graph } from '../..'
import { baseUrl } from '../../config/baseUrl'
import { clearMemo } from './clearMemo'
import { drawEdgeArea } from './drawEdgeArea'
import { drawSideNodes } from './drawSideNodes'
import { extendDistance } from './extendDistance'
import { fixedNodePosition } from './fixedNodePosition'
import { modifyEdge } from './modifyEdge'
// import { moveNodeToCenter } from './moveNodeToCenter'
import { verticePrefix } from './prefix'
// import { calcNodePosition } from './utils/calcNodePosition'
import { calcSize } from './utils/calcSize'

type FetchProps = {
  current: Graph.Vertice
}

let success = true

const fetchInsideOutside = async ({ current }: FetchProps) => {
  try {
    const inRes = await fetch(`${baseUrl}/api/getNextVerticesWithEdge?id=${current.id}&direction=in`)
    const inData: Api.KnowledgeResponse = await inRes.json()
    const outRes = await fetch(`${baseUrl}/api/getNextVerticesWithEdge?id=${current.id}&direction=out`)
    const outData: Api.KnowledgeResponse = await outRes.json()

    return {
      inData: inData.data,
      outData: outData.data,
    }
  } catch (error) {
    success = false
    return {
      inData: { vertices: [], edges: [] },
      outData: { vertices: [], edges: [] },
    }
  }
}

/**
 * 描述 节点探索
 * @date 2022-07-20
 * @returns {any}
 */

type Props = {
  mainPoint: Graph.Vertice;
  isExplore: boolean;
  config: Graph.ConfigProps;
  current: Graph.Vertice;
}

export const explore = async ({ mainPoint, isExplore, config, current }: Props) => {
  if (success) {
    const { isInside, angle } = current
    let position = { x: mainPoint.x!, y: mainPoint.y! }
    const originX = current.x!
    const originY = current.y!
    const atanAngle = isInside ? Math.atan2(current.y! - mainPoint.y!, current.x! - mainPoint.x!) + Math.PI : Math.atan2(current.y! - mainPoint.y!, current.x! - mainPoint.x!)
    if (current.distance && isInside !== undefined && angle) {
      if (isExplore) {
        const { inData, outData } = await fetchInsideOutside({ current })
        const size = calcSize({ inData: inData.vertices, outData: outData.vertices })
        const insideIds = inData.vertices.map((v) => v.id)
        const outsideIds = outData.vertices.map((v) => v.id)
        current.distance += config.basicDistence * size;
        current.s = [...insideIds, ...outsideIds]
        current.size = size
        // position = calcNodePosition({ distance: current.distance, angle, centerPoint: mainPoint, isInside })
        position = extendDistance({ node: current, mainPoint, isInside, size, isExplore, config })

        current.x = position.x
        current.y = position.y
        // moveNodeToCenter({ node: current })
        fixedNodePosition({ node: current, x: originX, y: originY })
        window.setTimeout(() => {
          // 创建入边出边types数组
          const insideTypes = Array.from(new Set(inData.vertices.map(v => v.labelName)))
          const insideTypeVertices = insideTypes.map((type) => {
            return inData.vertices.filter(v => v.labelName === type)
          })
          const insideMaxAngle = insideTypes.length ? 180 / insideTypes.length : 0
          drawSideNodes({
            typeNodes: insideTypeVertices,
            config,
            isInside: true,
            centerPoint: current,
            maxAngle: insideMaxAngle,
            edges: [...inData.edges, ...outData.edges],
            fId: current.id,
            atanAngle
          })

          // 创建出边
          const outsideTypes = Array.from(new Set(outData.vertices.map(v => v.labelName)))
          const outsideTypeVertices = outsideTypes.map((type) => {
            return outData.vertices.filter(v => v.labelName === type)
          })
          const outsideMaxAngle = outsideTypes.length ? 180 / outsideTypes.length : 0
          drawSideNodes({
            typeNodes: outsideTypeVertices,
            config, isInside: false,
            centerPoint: current,
            maxAngle: outsideMaxAngle,
            edges: [...inData.edges, ...outData.edges],
            fId: current.id,
            atanAngle
          })

          setTimeout(() => {
            drawEdgeArea({ mainPoint: current, config: config, init: false, edges: [...inData.edges], nodes: [current, ...inData.vertices], fId: current.id })
            drawEdgeArea({ mainPoint: current, config: config, init: false, edges: [...outData.edges], nodes: [current, ...outData.vertices], fId: current.id })
          })
        }, 1000)
      } else {
        current.distance -= config.basicDistence * current.size!;
        position = extendDistance({ node: current, mainPoint, isInside, size: current.size!, isExplore, config })
        current.x = position.x
        current.y = position.y
        // moveNodeToCenter({ node: current })
        fixedNodePosition({ node: current, x: originX, y: originY })
        d3.selectAll(`.${verticePrefix + current.id}`)
          // .transition()
          // .duration(1000)
          .remove()
        current.s?.forEach((id) => {
          if (id !== mainPoint.id) {
            clearMemo({ nodeId: id })
            d3.selectAll(`.${verticePrefix + id}`)
              // .transition()
              // .duration(1000)
              .remove()
          }
        })
      }
      // 更改节点坐标
      d3.select(`#${verticePrefix + current.id}`)
        .transition()
        .duration(1000)
        .attr('cx', position.x)
        .attr('cy', position.y)

      d3.select(`#${verticePrefix + current.id}text`)
        .transition()
        .duration(1000)
        .attr('x', position.x)
        .attr('y', position.y)

      d3.select(`#${verticePrefix + current.id}name`)
        .transition()
        .duration(1000)
        .attr('x', position.x)
        .attr('y', position.y + config.nodeRadius + 10)

      // 更改线
      modifyEdge({ x: position.x, y: position.y, node: current, config })
    }
  } else {
    message.error('服务端错误,请刷新后重试')
  }
}