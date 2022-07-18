import * as d3 from 'd3'
import React from 'react'
import { arcAreaDistence, arcAreaLength, nodeRadius } from './defaultConfig'
import { calcArcX, calcArcY } from './utils/calcArc'
import { calcBasicDistence } from './utils/calcBasicDistance'


const calcMode = (nodes: Graph.Node[], page: number, mode?: number,) => {
  if (mode === 1 || !mode) {
    return nodes
  } else {
    return nodes.length < 5 ? nodes : nodes.slice((page - 1) * 5, 5 * page - 1)
  }
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
function dragging(that: any, event: any, node: Graph.Node, edges: Graph.Edge[]) {
  requestAnimationFrame(() => {
    d3.select(`#${node.id}`).attr('cx', event.x).attr('cy', event.y)
    d3.select(`#${node.id}text`).attr('x', event.x).attr('y', event.y)
    const fromEdges = edges.filter(edge => edge.fromId === node.id)
    const toEdges = edges.filter(edge => edge.toId === node.id)
    fromEdges.forEach(edge => {
      const toNode = d3.select(`#${edge.toId}`)
      const curEdge = d3.select(`#${edge.fromId}${edge.toId}`)
      if (toNode.nodes().length !== 0 && curEdge.nodes().length !== 0) {
        curEdge.attr('d', `M ${event.x} ${event.y} L ${toNode.attr('cx')} ${toNode.attr('cy')}`)
      }
    })
    toEdges.forEach(edge => {
      const fromNode = d3.select(`#${edge.fromId}`)
      const curEdge = d3.select(`#${edge.fromId}${edge.toId}`)
      if (fromNode.nodes().length !== 0 && curEdge.nodes().length !== 0) {
        curEdge.attr('d', `M ${fromNode.attr('cx')} ${fromNode.attr('cy')} L ${event.x} ${event.y}`)
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
  mode?: number
) => {
  // rerender时先清除画布
  d3.select(container).selectChildren().remove
  /** 处理节点数据 */
  // 根节点
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
  mainNodeContainer
    .append('circle')
    .attr('r', nodeRadius)
    .attr('cx', x)
    .attr('cy', y)
    .attr('fill', '#1890ff')
    .style('cursor', 'pointer')
    .attr('id', mainNode?.id || '')
    .call(
      d3.drag<SVGCircleElement, any, Graph.Node>()
        .on('start', dragStart)
        .on('end', dragEnd)
        .on('drag', function (event: any, node: Graph.Node) {
          dragging(this, event, mainNode as Graph.Node, edges)
        })
    )
  mainNodeContainer
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('id', mainNode?.id + 'text')
    .style('cursor', 'pointer')
    .call(
      d3.drag<SVGTextElement, any, Graph.Node>()
        .on('start', dragStart)
        .on('end', dragEnd)
        .on('drag', function (event: any, node: Graph.Node) {
          dragging(this, event, mainNode as Graph.Node, edges)
        })
    )
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', '#fff')
    .text(mainNode?.type || '')


  // 创建入边节点
  insideTypeNodes.forEach((originNodes, index) => {
    const nodes = calcMode(originNodes, (index + 1) / 5 + 1, mode)
    if (mode === 2 && nodes.length >= 5) {
      d3.select(container)
        .append('path')
        .attr('d', `M ${x} ${y} m ${arcAreaDistence} 0 a ${arcAreaDistence} ${arcAreaDistence} 0 0 1 ${calcArcX(arcAreaDistence, insideMaxAngle)} ${calcArcY(arcAreaDistence, insideMaxAngle)}"`)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(24, 144, 255, 0.1)')
        .attr('stroke-width', arcAreaLength)
        .attr('transform', `rotate(${-90 - (index + 1) * insideMaxAngle})`)
        .attr('transform-origin', `${x} ${y}`);
      d3.select(container)
        .append('g')
        .attr('transform', `translate(${x}, ${y - arcAreaDistence + arcAreaLength / 4})`)
        .append('g')
        .attr('transform', `rotate(${-0.5 * insideMaxAngle - index * insideMaxAngle})`)
        .attr('transform-origin', `${0} ${arcAreaDistence - arcAreaLength / 4}`)
        .append('text')
        .text(`1/${originNodes.length % 5 === 0 ? (originNodes.length / 5).toFixed(0) : +(originNodes.length / 5).toFixed(0) + 1}`)
        .attr('text-anchor', 'middle');
    }
    const insideContainer = d3.select(container)
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
    insideContainer
      .append('circle')
      .attr('r', nodeRadius)
      .attr('cx', (_, idx) => {
        const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
        return x - calcBasicDistence(nodes.length, insideMaxAngle) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('cy', (_, idx) => {
        const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
        return y + calcBasicDistence(nodes.length, insideMaxAngle) * Math.sin((angle - 90) / 180 * Math.PI)
      })
      .attr('fill', '#1890ff')
      .attr('id', (node) => node.id)
      .call(
        d3.drag<SVGCircleElement, any, Graph.Node>()
          .on('start', dragStart)
          .on('end', dragEnd)
          .on('drag', function (event: any, node: Graph.Node) {
            dragging(this, event, node, edges)
          })
      )
    insideContainer
      .append('text')
      .attr('x', (_, idx) => {
        const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
        return x - calcBasicDistence(nodes.length, insideMaxAngle) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('y', (_, idx) => {
        const angle: number = (idx + 1) * insideMaxAngle / (nodes.length + 1) + index * insideMaxAngle
        return y + calcBasicDistence(nodes.length, insideMaxAngle) * Math.sin((angle - 90) / 180 * Math.PI)
      })
      .attr('id', node => node.id + 'text')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGTextElement, any, Graph.Node>()
          .on('start', dragStart)
          .on('end', dragEnd)
          .on('drag', function (event: any, node: Graph.Node) {
            dragging(this, event, node, edges)
          })
      )
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#fff')
      .text(node => node.type)
  })

  // 创建出边节点
  outsideTypeNodes.forEach((originNodes, index) => {
    const nodes = calcMode(originNodes, (index + 1) / 5 + 1, mode)
    if (mode === 2 && nodes.length >= 5) {
      d3.select(container)
        .append('path')
        .attr('d', `M ${x} ${y} m ${arcAreaDistence} 0 a ${arcAreaDistence} ${arcAreaDistence} 0 0 1 ${calcArcX(arcAreaDistence, outSideMaxAngle)} ${calcArcY(arcAreaDistence, outSideMaxAngle)}"`)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(24, 144, 255, 0.1)')
        .attr('stroke-width', arcAreaLength)
        .attr('transform', `rotate(${-90 + index * outSideMaxAngle})`)
        .attr('transform-origin', `${x} ${y}`);
      d3.select(container)
        .append('g')
        .attr('transform', `translate(${x}, ${y - arcAreaDistence + arcAreaLength / 4})`)
        .append('g')
        .attr('transform', `rotate(${0.5 * outSideMaxAngle + index * outSideMaxAngle})`)
        .attr('transform-origin', `${0} ${arcAreaDistence - arcAreaLength / 4}`)
        .append('text')
        .text(`1/${originNodes.length % 5 === 0 ? (originNodes.length / 5).toFixed(0) : +(originNodes.length / 5).toFixed(0) + 1}`)
        .attr('text-anchor', 'middle');
    }
    const outsideContainer = d3.select(container)
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
    outsideContainer
      .append('circle')
      .attr('r', nodeRadius)
      .attr('cx', (_, idx) => {
        const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
        return x + calcBasicDistence(nodes.length, outSideMaxAngle) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('cy', (_, idx) => {
        const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
        return y + calcBasicDistence(nodes.length, outSideMaxAngle) * Math.sin((angle - 90) / 180 * Math.PI)
      })
      .attr('fill', '#1890ff')
      .attr('id', (node) => node.id)
      .call(
        d3.drag<SVGCircleElement, any, Graph.Node>()
          .on('start', dragStart)
          .on('end', dragEnd)
          .on('drag', function (event: any, node: Graph.Node) {
            dragging(this, event, node, edges)
          })
      )
    outsideContainer
      .append('text')
      .attr('x', (_, idx) => {
        const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
        return x + calcBasicDistence(nodes.length, outSideMaxAngle) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('y', (_, idx) => {
        const angle: number = (idx + 1) * outSideMaxAngle / (nodes.length + 1) + index * outSideMaxAngle
        return y + calcBasicDistence(nodes.length, outSideMaxAngle) * Math.sin((angle - 90) / 180 * Math.PI)
      })
      .attr('id', node => node.id + 'text')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGTextElement, any, Graph.Node>()
          .on('start', dragStart)
          .on('end', dragEnd)
          .on('drag', function (event: any, node: Graph.Node) {
            dragging(this, event, node, edges)
          })
      )
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#fff')
      .text(node => node.type)
  })
}