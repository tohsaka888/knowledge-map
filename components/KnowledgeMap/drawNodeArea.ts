import * as d3 from 'd3'
import React from 'react'
import { Graph } from '../..'
import { drawEdgeArea } from './drawEdgeArea'
import { calcArcX, calcArcY } from './utils/calcArc'
import { calcBasicDistence } from './utils/calcBasicDistance'


/**
 * 描述 计算节点数组
 * @date 2022-07-18
 * @param {any} nodes:Graph.Node[]
 * @param {any} page:number
 * @param {any} mode?:number
 * @returns {any}
 */
const calcMode = (nodes: Graph.Node[], page: number, mode?: number,) => {
  if (mode === 1 || !mode) {
    return nodes
  } else {
    return nodes.length < 5 ? nodes : nodes.slice((page - 1) * 5, 5 * page)
  }
}

/**
 * 描述 点击下一页事件
 * @date 2022-07-18
 * @param {any} pagination:{page:number
 * @param {any} pageSize:number}
 * @param {any} originNodes:Graph.Node[]
 * @param {any} total:number
 * @param {any} index:number
 * @param {any} insideMaxAngle:number
 * @param {any} x:number
 * @param {any} y:number
 * @param {any} edges:Graph.Edge[]
 * @param {any} mode:number|undefined
 * @returns {any}
 */
const insideNextPage = (
  pagination: { page: number, pageSize: number },
  originNodes: Graph.Node[],
  total: number,
  index: number,
  insideMaxAngle: number,
  edges: Graph.Edge[],
  config: Graph.ConfigProps,
  centerPointId?: string
) => {
  const { mode, nodeRadius, basicDistence } = config
  const mainPoint = d3.select(`#${centerPointId || 'main'}`)
  const x = +mainPoint.attr('cx')
  const y = +mainPoint.attr('cy')!
  pagination.page = (pagination.page + 1) % total === 0 ? total : (pagination.page + 1) % total
  const nodes = calcMode(originNodes, pagination.page, mode)
  d3.select(`#${nodes[0].type}`).selectChildren().remove()
  const insideContainer =
    d3.select(`#${nodes[0].type}`)
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(
        d3.drag<any, any, Graph.Node>()
          .on('start', dragStart)
          .on('end', dragEnd)
          .on('drag', function (event: any, node: Graph.Node) {
            dragging(this, event, node, edges, config)
          })
      )
  insideContainer
    .append('circle')
    .attr('r', nodeRadius)
    .attr('fill', '#1890ff')
    .attr('id', (node) => node.id)
    .attr('x', (_, idx) => {
      const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
      return x - calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
    })
    .attr('y', (_, idx) => {
      const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
      return y + calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
    })
    .attr('cx', x)
    .attr('cy', y)
    .transition()
    .duration(1000)
    .attr('cx', (_, idx) => {
      const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
      return x - calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
    })
    .attr('cy', (_, idx) => {
      const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
      return y + calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
    })
  insideContainer
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('id', node => node.id + 'text')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', '#fff')
    .text(node => node.type)
    .transition()
    .duration(1000)
    .attr('x', (_, idx) => {
      const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
      return x - calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
    })
    .attr('y', (_, idx) => {
      const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
      return y + calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
    })
  insideContainer
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('text-anchor', 'middle')
    .style('font-size', 10)
    .text(item => item.name)
    .attr('id', item => `${item.id}name`)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .attr('x', (_, idx) => {
      const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
      return x - calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
    })
    .attr('y', (_, idx) => {
      const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
      return y + calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI) + nodeRadius + 10
    })
    .style('opacity', 1);
  d3.selectAll('.edge')
    .filter((item: any) => {
      return item.fromId.includes(originNodes[0].type) || item.toId.includes(originNodes[0].type)
    })
    .remove()
  drawEdgeArea(edges)
  d3.select(`#${nodes[0].type}-text`).text(`${pagination.page}/${total}`)
}

/**
 * 描述 出边下一页事件
 * @date 2022-07-18
 * @param {any} pagination:{page:number
 * @param {any} pageSize:number}
 * @param {any} originNodes:Graph.Node[]
 * @param {any} total:number
 * @param {any} index:number
 * @param {any} insideMaxAngle:number
 * @param {any} x:number
 * @param {any} y:number
 * @param {any} edges:Graph.Edge[]
 * @param {any} mode:number|undefined
 * @returns {any}
 */
const outsideNextPage = (
  pagination: { page: number, pageSize: number },
  originNodes: Graph.Node[],
  total: number,
  index: number,
  outSideMaxAngle: number,
  edges: Graph.Edge[],
  config: Graph.ConfigProps,
  centerPointId?: string
) => {
  const { mode, nodeRadius, basicDistence } = config
  const mainPoint = d3.select(`#${centerPointId || 'main'}`)
  const x = +mainPoint.attr('cx')
  const y = +mainPoint.attr('cy')!
  pagination.page = (pagination.page + 1) % total === 0 ? total : (pagination.page + 1) % total
  const nodes = calcMode(originNodes, pagination.page, mode)
  d3.select(`#${nodes[0].type}`).selectChildren().remove()
  const outsideContainer = d3.select(`#${nodes[0].type}`)
    .selectAll('g')
    .data(nodes)
    .join('g')
    .call(
      d3.drag<any, any, Graph.Node>()
        .on('start', dragStart)
        .on('end', dragEnd)
        .on('drag', function (event: any, node: Graph.Node) {
          dragging(this, event, node, edges, config)
        })
    )
  outsideContainer
    .append('circle')
    .attr('r', nodeRadius)
    .attr('x', (_, idx) => {
      const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
      return x + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
    })
    .attr('y', (_, idx) => {
      const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
      return y + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
    })
    .attr('fill', '#1890ff')
    .attr('id', (node) => node.id)
    .attr('cx', x)
    .attr('cy', y)
    .transition()
    .duration(1000)
    .attr('cx', (_, idx) => {
      const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
      return x + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
    })
    .attr('cy', (_, idx) => {
      const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
      return y + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
    })
  outsideContainer
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('id', node => node.id + 'text')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', '#fff')
    .text(node => node.type)
    .transition()
    .duration(1000)
    .attr('x', (_, idx) => {
      const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
      return x + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
    })
    .attr('y', (_, idx) => {
      const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
      return y + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
    })
  outsideContainer
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('text-anchor', 'middle')
    .style('font-size', 10)
    .text(item => item.name)
    .attr('id', item => `${item.id}name`)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .attr('x', (_, idx) => {
      const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
      return x + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
    })
    .attr('y', (_, idx) => {
      const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
      return y + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI) + nodeRadius + 10
    })
    .style('opacity', 1)
  d3.selectAll('.edge')
    .filter((item: any) => {
      return item.fromId.includes(originNodes[0].type) || item.toId.includes(originNodes[0].type)
    })
    .remove()
  drawEdgeArea(edges)
  d3.select(`#${nodes[0].type}-text`).text(`${pagination.page}/${total}`)
}


/**
 * 描述 拖拽开始事件
 * @date 2022-07-15
 * @param {any} this:any
 * @param {any} event:any
 * @param {any} node:Graph.Node
 * @returns {any}
 */
function dragStart(this: any, event: any, node: Graph.Node) {
  d3.select(this).style('cursor', 'grabbing')
}

/**
 * 描述 拖拽结束事件
 * @date 2022-07-15
 * @param {any} this:any
 * @param {any} event:any
 * @param {any} node:Graph.Node
 * @returns {any}
 */
function dragEnd(this: any, event: any, node: Graph.Node) {
  d3.select(this).style('cursor', 'pointer')
}

/**
 * 描述 拖拽进行事件
 * @date 2022-07-15
 * @param {any} that:any
 * @param {any} event:any
 * @param {any} node:Graph.Node
 * @param {any} edges:Graph.Edge[]
 * @returns {any}
 */
function dragging(that: any, event: any, node: Graph.Node, edges: Graph.Edge[], config: Graph.ConfigProps) {
  const { nodeRadius } = config
  requestAnimationFrame(() => {
    d3.select(`#${node.id}`)
      .attr('cx', event.x)
      .attr('cy', event.y)
      .attr('x', event.x)
      .attr('y', event.y)
    d3.select(`#${node.id}text`)
      .attr('x', event.x)
      .attr('y', event.y)
    d3.select(`#${node.id}name`)
      .attr('x', event.x)
      .attr('y', event.y + nodeRadius + 10)
    const fromEdges = edges.filter(edge => edge.fromId === node.id)
    const toEdges = edges.filter(edge => edge.toId === node.id)
    fromEdges.forEach(edge => {
      const toNode = d3.select(`#${edge.toId}`)
      const curEdge = d3.select(`#${edge.fromId}${edge.toId}`)
      if (toNode.nodes().length !== 0 && curEdge.nodes().length !== 0) {
        const middlePointX = (event.x + +toNode.attr('cx')) / 2
        const middlePointY = (event.y + +toNode.attr('cy')) / 2
        curEdge
          .attr('d', `M ${event.x} ${event.y} L ${middlePointX} ${middlePointY} L ${toNode.attr('cx')} ${toNode.attr('cy')}`)
          .style('marker-mid', 'url(#arrow)')
      }
    })
    toEdges.forEach(edge => {
      const fromNode = d3.select(`#${edge.fromId}`)
      const curEdge = d3.select(`#${edge.fromId}${edge.toId}`)
      if (fromNode.nodes().length !== 0 && curEdge.nodes().length !== 0) {
        const middlePointX = (event.x + +fromNode.attr('cx')) / 2
        const middlePointY = (event.y + +fromNode.attr('cy')) / 2
        curEdge.attr('d', `M ${fromNode.attr('cx')} ${fromNode.attr('cy')} L ${middlePointX} ${middlePointY} L ${event.x} ${event.y}`)
      }
    })
  })
}

/**
 * 描述 绘制节点
 * @date 2022-07-15
 * @param {any} container:SVGGElement 画布
 * @param {any} nodes:Graph.Node[] 节点数据
 * @param {any} x:number  根节点x偏移
 * @param {any} y:number  根节点y偏移
 * @returns {any}
 */
export const drawNodeArea = (
  container: SVGGElement,
  nodes: Graph.Node[],
  edges: Graph.Edge[],
  x: number,
  y: number,
  config: Graph.ConfigProps
): any => {
  // rerender时先清除画布
  // d3.select(container).selectAll().remove
  /** 处理节点数据 */
  // 根节点
  const { nodeRadius, basicDistence, arcAreaDistence, arcAreaLength, mode } = config
  const mainNode = nodes.find(node => node.mode === 0)
  // 入边节点
  const insideNodes = nodes.filter(node => node.mode === 1)
  const insideTypes = Array.from(new Set(insideNodes.map(node => node.type)))
  const insideTypeNodes = insideTypes.map(type => insideNodes.filter(node => node.type === type))
  const insideMaxAngle = 180 / insideTypeNodes.length

  // 出边节点
  const outsideNodes = nodes.filter(node => node.mode === 2)
  const outSideTypes = Array.from(new Set(outsideNodes.map(node => node.type)))
  const outsideTypeNodes = outSideTypes.map(type => outsideNodes.filter(node => node.type === type))
  const outSideMaxAngle = 180 / outsideTypeNodes.length

  // 创建根节点
  const mainNodeContainer = d3.select(container)
    .append('g')
    .attr('x', x)
    .attr('y', y)
    .call(
      d3.drag<any, any, Graph.Node>()
        .on('start', dragStart)
        .on('end', dragEnd)
        .on('drag', function (event: any, node: Graph.Node) {
          dragging(this, event, mainNode as Graph.Node, edges, config)
          d3.selectAll('.arc')
            .attr('transform', `translate(${event.x - x}, ${event.y - y})`)
            .attr('transform-origin', '0 0')
        })
    )
  mainNodeContainer
    .append('circle')
    .attr('r', nodeRadius)
    .attr('cx', x)
    .attr('cy', y)
    .attr('x', x)
    .attr('y', y)
    .attr('fill', '#1890ff')
    .style('cursor', 'pointer')
    .attr('id', mainNode?.id || '')
  mainNodeContainer
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('id', mainNode?.id + 'text')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', '#fff')
    .text(mainNode?.type || '')


  // 创建入边节点
  insideTypeNodes.forEach((originNodes, index) => {
    const nodes = calcMode(originNodes, 1, mode)
    const pagination = { page: 1, pageSize: 5 }
    if (mode === 2 && originNodes.length > 5) {
      const arc = d3.select(container)
        .append('g')
        .classed('arc', true)
        .append('g')
        .attr('transform', `rotate(${-90 - (index + 1) * insideMaxAngle})`)
        .attr('transform-origin', `${x} ${y}`)
      arc
        .append('path')
        .attr('d',
          `M ${x} ${y} 
            m ${arcAreaDistence} 0 
            a ${arcAreaDistence} ${arcAreaDistence} 0 0 1 ${calcArcX(arcAreaDistence, insideMaxAngle)} ${calcArcY(arcAreaDistence, insideMaxAngle)}`
        )
        .attr('fill', 'none')
        .attr('stroke', 'rgba(24, 144, 255, 0.1)')
        .attr('stroke-width', arcAreaLength)
      arc
        .append('g')
        .attr('transform', `translate(${x + arcAreaDistence - arcAreaLength / 4} ${y})`)
        .append('path')
        .attr('d', 'm0,10.4772l5.5,-9.4772l5.5,9.4772l-2.75,0l0,9.5228l-5.5,0l0,-9.5228l-2.75,0z')
        .attr('fill', '#1890ff')
        .style('cursor', 'pointer')
        .on('mouseover', function () {
          d3.select(this).attr('fill', 'blue')
        })
        .on('mouseleave', function () {
          d3.select(this).attr('fill', '#1890ff')
        })
        .on('click', () => {
          insideNextPage(
            pagination,
            originNodes,
            originNodes.length % 5 === 0 ? +(originNodes.length / 5).toFixed(0) : Math.floor(originNodes.length / 5) + 1,
            index,
            insideMaxAngle,
            edges,
            config
          )
        })
      arc
        .append('g')
        .classed('arc-text', true)
        .attr('transform', `translate(${x + arcAreaDistence - arcAreaLength / 5}, ${y})`)
        .append('g')
        .attr('transform-origin', `${-arcAreaDistence + arcAreaLength / 5} ${0}`)
        .attr('transform', `rotate(${insideMaxAngle / 2})`)
        .append('text')
        .attr('transform', `rotate(${90})`)
        .text(`1/${originNodes.length % 5 === 0 ? (originNodes.length / 5).toFixed(0) : Math.floor(originNodes.length / 5) + 1}`)
        .attr('id', `${nodes[0].type}-text`)
        .attr('text-anchor', 'right')
    }
    const insideContainer = d3.select(container)
      .append('g')
      .attr('id', nodes[0].type)
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(
        d3.drag<any, any, Graph.Node>()
          .on('start', dragStart)
          .on('end', dragEnd)
          .on('drag', function (event: any, node: Graph.Node) {
            dragging(this, event, node, edges, config)
          })
      )
    insideContainer
      .append('circle')
      .attr('r', nodeRadius)
      .attr('fill', '#1890ff')
      .attr('id', (node) => node.id)
      .attr('cx', x)
      .attr('cy', y)
      .attr('x', (_, idx) => {
        const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
        return x - calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('y', (_, idx) => {
        const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
        return y + calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
      })
      .transition()
      .duration(1000)
      .attr('cx', (_, idx) => {
        const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
        return x - calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('cy', (_, idx) => {
        const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
        return y + calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
      })

    insideContainer
      .append('text')
      .attr('id', node => node.id + 'text')
      .style('cursor', 'pointer')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#fff')
      .attr('x', x)
      .attr('y', y)
      .transition()
      .duration(1000)
      .attr('x', (_, idx) => {
        const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
        return x - calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('y', (_, idx) => {
        const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
        return y + calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
      })
      .text(node => node.type)
    insideContainer
      .append('text')
      .attr('x', x)
      .attr('y', y + nodeRadius + 10)
      .attr('text-anchor', 'middle')
      .style('font-size', 10)
      .text(item => item.name)
      .attr('id', item => `${item.id}name`)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .attr('x', (_, idx) => {
        const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
        return x - calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('y', (_, idx) => {
        const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
        return y + calcBasicDistence(nodes.length, insideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI) + nodeRadius + 10
      })
      .style('opacity', 1)
  })

  // 创建出边节点
  outsideTypeNodes.forEach((originNodes, index) => {
    const nodes = calcMode(originNodes, 1, mode)
    const pagination = { page: 1, pageSize: 5 }
    if (mode === 2 && originNodes.length > 5) {
      const arc = d3.select(container)
        .append('g')
        .classed('arc', true)
        .append('g')
        .attr('transform', `rotate(${-90 + index * outSideMaxAngle})`)
        .attr('transform-origin', `${x} ${y}`);
      arc
        .append('path')
        .attr('d',
          `M ${x} ${y} 
            m ${arcAreaDistence} 0 
            a ${arcAreaDistence} ${arcAreaDistence} 0 0 1 ${calcArcX(arcAreaDistence, outSideMaxAngle)} ${calcArcY(arcAreaDistence, outSideMaxAngle)}`
        )
        .attr('fill', 'none')
        .attr('stroke', 'rgba(24, 144, 255, 0.1)')
        .attr('stroke-width', arcAreaLength)
      arc
        .append('g')
        .attr('transform', `translate(${x + arcAreaDistence - arcAreaLength / 4} ${y})`)
        .append('path')
        .attr('d', 'm0,10.4772l5.5,-9.4772l5.5,9.4772l-2.75,0l0,9.5228l-5.5,0l0,-9.5228l-2.75,0z')
        .attr('fill', '#1890ff')
        .style('cursor', 'pointer')
        .on('mouseover', function () {
          d3.select(this).attr('fill', 'blue')
        })
        .on('mouseleave', function () {
          d3.select(this).attr('fill', '#1890ff')
        })
        .on('click', () => {
          outsideNextPage(
            pagination,
            originNodes,
            originNodes.length % 5 === 0 ? +(originNodes.length / 5).toFixed(0) : Math.floor(originNodes.length / 5) + 1,
            index,
            outSideMaxAngle,
            edges,
            config
          )
        })
      arc
        .append('g')
        .classed('arc-text', true)
        .attr('transform', `translate(${x + arcAreaDistence - arcAreaLength / 5}, ${y})`)
        .append('g')
        .attr('transform-origin', `${-arcAreaDistence + arcAreaLength / 5} ${0}`)
        .attr('transform', `rotate(${outSideMaxAngle / 2})`)
        .append('text')
        .attr('transform', `rotate(${90})`)
        .text(`1/${originNodes.length % 5 === 0 ? (originNodes.length / 5).toFixed(0) : Math.floor(originNodes.length / 5) + 1}`)
        .attr('id', `${nodes[0].type}-text`)
        .attr('text-anchor', 'right')
    }
    const outsideContainer = d3.select(container)
      .append('g')
      .attr('id', nodes[0].type)
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(
        d3.drag<any, any, Graph.Node>()
          .on('start', dragStart)
          .on('end', dragEnd)
          .on('drag', function (event: any, node: Graph.Node) {
            dragging(this, event, node, edges, config)
          })
      )
    outsideContainer
      .append('circle')
      .attr('r', nodeRadius)
      .attr('cx', x)
      .attr('cy', y)
      .attr('x', (_, idx) => {
        const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
        return x + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('y', (_, idx) => {
        const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
        return y + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
      })
      .attr('fill', '#1890ff')
      .attr('id', (node) => node.id)
      .transition()
      .duration(1000)
      .attr('cx', (_, idx) => {
        const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
        return x + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('cy', (_, idx) => {
        const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
        return y + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
      })
    outsideContainer
      .append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('id', node => node.id + 'text')
      .style('cursor', 'pointer')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#fff')
      .text(node => node.type)
      .transition()
      .duration(1000)
      .attr('x', (_, idx) => {
        const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
        return x + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('y', (_, idx) => {
        const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
        return y + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
      })
    outsideContainer
      .append('text')
      .attr('x', x)
      .attr('y', y + nodeRadius + 10)
      .style('opacity', 0)
      .attr('text-anchor', 'middle')
      .style('font-size', 10)
      .text(item => item.name)
      .attr('id', item => `${item.id}name`)
      .transition()
      .duration(1000)
      .attr('x', (_, idx) => {
        const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
        return x + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('y', (_, idx) => {
        const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
        return y + calcBasicDistence(nodes.length, outSideMaxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI) + nodeRadius + 10
      })
      .style('opacity', 1)
  })
}