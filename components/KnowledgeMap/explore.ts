/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-24 17:13:25
 * @Description: 请填写简介
 */
import { message } from 'antd'
import * as d3 from 'd3'
import { cloneDeep, debounce } from 'lodash'
import { Graph } from '../..'
import { baseUrl } from '../../config/baseUrl'
// import { insideAutoExplore, outsideAutoExplore } from './autoExplore'
import { drawEdgeArea } from './drawEdgeArea'
import { drawSideNodes } from './drawSideNodes'
import { extendDistance } from './extendDistance'
import { fixedNodePosition } from './fixedNodePosition'
import { changeIsReset, explorePath, exploreTimer, filteredNodes, filteredPath, globalNodes, isReset } from './global'
import { modifyEdge } from './modifyEdge'
// import { moveNodeToCenter } from './moveNodeToCenter'
import { verticePrefix } from './prefix'
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
  needExplore?: boolean;
  inGraphData?: { vertices: Graph.Vertice[]; edges: Graph.Line[] };
  outGraphData?: { vertices: Graph.Vertice[]; edges: Graph.Line[] };
  path?: any
}

export const debounceReset = debounce(() => {
  if (!explorePath.find(p => p.isExplore !== true)) {
    changeIsReset(false)
  }
}, exploreTimer)

export const explore = async (
  {
    mainPoint,
    isExplore,
    config,
    current,
    needExplore,
    inGraphData = { vertices: [], edges: [] },
    outGraphData = { vertices: [], edges: [] },
    path
  }: Props
) => {
  if (success) {
    const { isInside, angle } = current
    let position = { x: mainPoint.x!, y: mainPoint.y! }
    const originX = current.x!
    const originY = current.y!
    const atanAngle = isInside ? Math.atan2(current.y! - mainPoint.y!, current.x! - mainPoint.x!) + Math.PI : Math.atan2(current.y! - mainPoint.y!, current.x! - mainPoint.x!)
    if (current.distance && isInside !== undefined && angle) {
      if (isExplore) {
        const { inData, outData } = (needExplore === true) ? { inData: inGraphData, outData: outGraphData } : await fetchInsideOutside({ current })
        if (!explorePath.find(path => path.mainId === current.id)) {
          explorePath.push({
            mainId: current.id,
            inData: cloneDeep(inData),
            outData: cloneDeep(outData),
            isExplore: false
          })
        }

        const size = calcSize({ inData: inData.vertices, outData: outData.vertices })
        const insideIds = inData.vertices.map((v) => v.id)
        const outsideIds = outData.vertices.map((v) => v.id)
        current.distance += config.basicDistence * size;
        current.s = [...insideIds, ...outsideIds]
        current.size = size
        position = extendDistance({ node: current, mainPoint, isInside, size, isExplore, config })

        current.x = position.x
        current.y = position.y
        // moveNodeToCenter({ node: current })
        fixedNodePosition({ node: current, x: originX, y: originY })

        // window.setTimeout(() => {
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
          atanAngle,
          insideLength: inData.vertices.length,
          outsideLength: outData.vertices.length,
          duration: 1000
        })

        // 创建出边
        const outsideTypes = Array.from(new Set(outData.vertices.map(v => v.labelName)))
        const outsideTypeVertices = outsideTypes.map((type) => {
          return outData.vertices.filter(v => v.labelName === type)
        })
        const outsideMaxAngle = outsideTypes.length ? 180 / outsideTypes.length : 0
        drawSideNodes({
          typeNodes: outsideTypeVertices,
          config,
          isInside: false,
          centerPoint: current,
          maxAngle: outsideMaxAngle,
          edges: [...inData.edges, ...outData.edges],
          fId: current.id,
          atanAngle,
          insideLength: inData.vertices.length,
          outsideLength: outData.vertices.length,
          duration: 1000
        })

        setTimeout(() => {
          drawEdgeArea({ mainPoint: current, config: config, init: false, edges: [...inData.edges], nodes: [current, ...inData.vertices], fId: current.id, duration: 1000 })
          drawEdgeArea({ mainPoint: current, config: config, init: false, edges: [...outData.edges], nodes: [current, ...outData.vertices], fId: current.id, duration: 1000 })
        })
        // }, isReset ? exploreTimer : 1000)
      } else {
        current.distance -= config.basicDistence * current.size!;
        position = extendDistance({ node: current, mainPoint, isInside, size: current.size!, isExplore, config })
        current.x = position.x
        current.y = position.y

        filteredPath(current.id)

        // moveNodeToCenter({ node: current })
        fixedNodePosition({ node: current, x: originX, y: originY })
        const needRemove = d3.selectAll(`.${verticePrefix + current.id}`)
        needRemove.selectAll<HTMLElement, any>('circle').nodes().forEach((ele) => {
          const id = ele.getAttribute('id')?.substring(2)
          if (id) {
            filteredNodes(id)
            filteredPath(id)
          }
        })
        needRemove.remove()
      }
      // 更改节点坐标
      d3.select(`#${verticePrefix + current.id}`)
        .transition()
        .duration(isReset ? exploreTimer : 1000)
        .style('opacity', 1)
        .attr('cx', position.x)
        .attr('cy', position.y)

      d3.select(`#${verticePrefix + current.id}text`)
        .transition()
        .duration(isReset ? exploreTimer : 1000)
        .style('opacity', 1)
        .attr('x', position.x)
        .attr('y', position.y)

      d3.select(`#${verticePrefix + current.id}name`)
        .transition()
        .duration(isReset ? exploreTimer : 1000)
        .style('opacity', 1)
        .attr('x', position.x)
        .attr('y', position.y + config.nodeRadius + config.nameSize)

      // 更改线
      modifyEdge({ x: position.x, y: position.y, node: current, config })
    }
  } else {
    message.error('服务端错误,请刷新后重试')
  }
  if (needExplore) {
    path.isExplore = true
    debounceReset()
  }
}
// , 1000, { leading: true })