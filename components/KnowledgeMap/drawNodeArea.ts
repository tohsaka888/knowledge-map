import * as d3 from 'd3'
import { Graph } from '../..'
import { createNode } from './createNode'
import { drawSideNodes } from './drawSideNodes'

/**
 * 描述 绘制节点
 * @date 2022-07-15
 * @param {any} container:SVGGElement 画布
 * @param {any} nodes:Graph.Node[] 节点数据
 * @param {any} x:number  根节点x偏移
 * @param {any} y:number  根节点y偏移
 * @returns {any}
 */

type Props = {
  container: SVGGElement,
  mainVertice: Graph.Vertice,
  insideVertices: Graph.Vertice[],
  outsideVertices: Graph.Vertice[],
  x?: number,
  y?: number,
  config: Graph.ConfigProps,
  init: boolean,
  edges: Graph.Line[]
}

export const drawNodeArea = (
  {
    container,
    mainVertice,
    insideVertices,
    outsideVertices,
    x,
    y,
    config,
    init,
    edges
  }: Props
): any => {
  d3.selectAll('.force-graph').remove()
  const { nodeRadius, setVisible } = config

  // 设置主节点坐标
  if (init) {
    mainVertice.x = x
    mainVertice.y = y
  }

  // 创建入边出边types数组
  const insideTypes = Array.from(new Set(insideVertices.map(v => v.labelName)))
  const insideTypeVertices = insideTypes.map((type) => {
    return insideVertices.filter(v => v.labelName === type)
  })
  const insideMaxAngle = 180 / insideTypes.length

  const outsideTypes = Array.from(new Set(outsideVertices.map(v => v.labelName)))
  const outsideTypeVertices = outsideTypes.map((type) => {
    return outsideVertices.filter(v => v.labelName === type)
  })
  const outsideMaxAngle = 180 / outsideTypes.length

  // 创建根节点
  const mainNodeContainer = d3.select(container)
    .append('g')
    .attr('x', mainVertice.x!)
    .attr('y', mainVertice.y!)

  // .on('mouseover', function (event) {
  //   event.stopPropagation()
  //   const node = d3.select(`${verticePrefix + verticePrefix + mainVertice.id || 'main'}`)
  //   const x = node.attr('cx')
  //   const y = node.attr('cy')
  //   d3.select('#border')
  //     .attr('transform', `translate(${x}, ${y})`)
  //     .select('circle')
  //     .attr('stroke-width', 8)
  //     .attr('r', nodeRadius + 4)
  //   d3.select('#popover-container')
  //     .attr('width', nodeRadius * 2 + 10)
  //     .attr('height', nodeRadius * 2 + 10)
  //     .attr('x', +x)
  //     .attr('y', +y - 10)
  //   setVisible && setVisible(true)
  // })
  // .call(
  //   d3.drag<any, any, Graph.Node>()
  //     .on('start', function (event: any, node: Graph.Node) {
  //       dragStart(this, event, node, config)
  //     })
  //     .on('end', function (event: any, node: Graph.Node) {
  //       dragEnd(this, event, node, config)
  //     })
  //     .on('drag', function (event: any, node: Graph.Node) {
  //       dragging(this, event, mainVertice as Graph.Node, edges, config)
  //       d3.selectAll('.arc')
  //         .attr('transform', `translate(${event.x - x}, ${event.y - y})`)
  //         .attr('transform-origin', '0 0')
  //     })
  // )
  createNode({ container: mainNodeContainer, config, vertice: mainVertice, edges })

  // 创建入边节点
  drawSideNodes(
    {
      typeNodes: insideTypeVertices,
      config,
      isInside: true,
      centerPoint: mainVertice,
      maxAngle: insideMaxAngle,
      edges,
      insideLength: insideVertices.length,
      outsideLength: outsideVertices.length,
      duration: 1000
    }
  )

  // 创建出边节点
  drawSideNodes(
    {
      typeNodes: outsideTypeVertices,
      config,
      isInside: false,
      centerPoint: mainVertice,
      maxAngle: outsideMaxAngle,
      edges,
      insideLength: insideVertices.length,
      outsideLength: outsideVertices.length,
      duration: 1000
    }
  )

  // 创建悬停边框
  // d3.select(container)
  //   .insert('g', ':first-child')
  //   .attr('id', 'border')
  //   .append('circle')
  //   .attr('fill', 'transparent')
  //   .attr('stroke', 'rgba(24,144,255, .3)')
  //   .attr('stroke-width', 0)
  //   .attr('r', nodeRadius)
  //   .on('mouseleave', () => {
  //     d3.select('#border')
  //       .select('circle')
  //       .attr('stroke-width', 0)
  //       .attr('r', 0)
  //   })
}