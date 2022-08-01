import * as d3 from 'd3'
import { Dispatch, SetStateAction } from 'react'
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
const nextPage = (
  pagination: { page: number, pageSize: number },
  originNodes: Graph.Node[],
  total: number,
  index: number,
  maxAngle: number,
  edges: Graph.Edge[],
  config: Graph.ConfigProps,
  isInside: boolean,
  centerPointId?: string,
) => {
  const { mode, nodeRadius, basicDistence, setVisible } = config
  const mainPoint = d3.select(`#${centerPointId || 'main'}`)
  const x = +mainPoint.attr('cx')
  const y = +mainPoint.attr('cy')!
  pagination.page = (pagination.page + 1) % total === 0 ? total : (pagination.page + 1) % total
  const nodes = calcMode(originNodes, pagination.page, mode)
  d3.select(`#${nodes[0].type}`).selectChildren().remove()
  const container =
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
      ).on('mouseover', function (event, d) {
        event.stopPropagation();
        const node = d3.select(`#${d.id}`)
        const x = +node.attr('cx')
        const y = +node.attr('cy')
        d3.select('#border')
          .attr('transform', `translate(${x}, ${y})`)
          .select('circle')
          .attr('stroke-width', 8)
          .attr('r', nodeRadius + 4)
        d3.select('#popover-container')
          .attr('width', 1000)
          .attr('height', 300)
          .attr('x', x)
          .attr('y', +y - 10)
        setVisible && setVisible(true)
      })
      .on('mouseleave', () => {
        setVisible && setVisible(false)
      })
  container
    .append('circle')
    .attr('r', nodeRadius)
    .attr('fill', '#1890ff')
    .attr('id', (node) => node.id)
    .attr('x', (_, idx) => {
      const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
      return isInside
        ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
        : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
    })
    .attr('y', (_, idx) => {
      const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
      return isInside
        ? y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
        : y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
    })
    .attr('cx', x)
    .attr('cy', y)
    .transition()
    .duration(1000)
    .attr('cx', (_, idx) => {
      const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
      return isInside
        ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
        : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
    })
    .attr('cy', (_, idx) => {
      const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
      return isInside
        ? y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
        : y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
    })
  container
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
      const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
      return isInside
        ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
        : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
    })
    .attr('y', (_, idx) => {
      const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
      return isInside
        ? y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
        : y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
    })
  container
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
      const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
      return isInside
        ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
        : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
    })
    .attr('y', (_, idx) => {
      const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
      return isInside
        ? y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI) + nodeRadius + 10
        : y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI) + nodeRadius + 10
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
  const { nodeRadius, setVisible } = config
  requestAnimationFrame(() => {
    // 更改相关节点的位置
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

    d3.select('#popover-container')
      .attr('width', 1000)
      .attr('height', 300)
      .attr('x', event.x)
      .attr('y', +event.y - 10)
    setVisible && setVisible(true)

    const currentNode = d3.select(`#${node?.id || 'main'}`)
    const x = currentNode.attr('cx')
    const y = currentNode.attr('cy')
    d3.select('#border')
      .attr('transform', `translate(${x}, ${y})`)
      .select('circle')
      .attr('stroke-width', 8)
      .attr('r', nodeRadius + 4)
    // 筛选出和当前节点有关的边
    const fromEdges = edges.filter(edge => edge.fromId === node.id)
    const toEdges = edges.filter(edge => edge.toId === node.id)
    // 更改入边相关的位置
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
    // 更改出边相关的位置
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
 * 描述 创建入边出边节点
 * @date 2022-07-21
 * @param {any} typeNodes:Graph.Node[][]
 * @param {any} config:Graph.ConfigProps
 * @param {any} container:SVGGElement
 * @param {any} maxAngle:number
 * @param {any} x:number
 * @param {any} y:number
 * @param {any} edges:Graph.Edge[]
 * @param {any} isInside:boolean
 * @returns {any}
 */
const drawSideNodes = (
  typeNodes: Graph.Node[][],
  config: Graph.ConfigProps,
  container: SVGGElement,
  maxAngle: number,
  x: number,
  y: number,
  edges: Graph.Edge[],
  isInside: boolean,
) => {
  const { nodeRadius, arcAreaDistence, arcAreaLength, mode, basicDistence, setVisible } = config
  typeNodes.forEach((originNodes, index) => {
    const nodes = calcMode(originNodes, 1, mode)
    const pagination = { page: 1, pageSize: 5 }
    if (mode === 2 && originNodes.length > 5) {
      const arc = d3.select(container)
        .append('g')
        .classed('arc', true)
        .append('g')
        .attr('transform', `rotate(${isInside ? -90 - (index + 1) * maxAngle : -90 + index * maxAngle})`)
        .attr('transform-origin', `${x} ${y}`)
      arc
        .append('path')
        .attr('d',
          `M ${x} ${y} 
            m ${arcAreaDistence} 0 
            a ${arcAreaDistence} ${arcAreaDistence} 0 0 1 ${calcArcX(arcAreaDistence, maxAngle)} ${calcArcY(arcAreaDistence, maxAngle)}`
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
          nextPage(
            pagination,
            originNodes,
            originNodes.length % 5 === 0 ? +(originNodes.length / 5).toFixed(0) : Math.floor(originNodes.length / 5) + 1,
            index,
            maxAngle,
            edges,
            config,
            isInside
          )
        })

      arc
        .append('g')
        .classed('arc-text', true)
        .attr('transform', `translate(${x + arcAreaDistence - arcAreaLength / 5}, ${y})`)
        .append('g')
        .attr('transform-origin', `${-arcAreaDistence + arcAreaLength / 5} ${0}`)
        .attr('transform', `rotate(${maxAngle / 2})`)
        .append('text')
        .attr('transform', `rotate(${90})`)
        .text(`1 / ${originNodes.length % 5 === 0 ? (originNodes.length / 5).toFixed(0) : Math.floor(originNodes.length / 5) + 1} `)
        .attr('id', `${nodes[0].type}-text`)
        .attr('text-anchor', 'right')
    }
    const sideContainer = d3.select(container)
      .append('g')
      .attr('id', nodes[0].type)
      .selectAll('g')
      .data(nodes)
      .join('g')
      .on('mouseover', function (event, d) {
        event.stopPropagation();
        const node = d3.select(`#${d.id}`)
        const x = +node.attr('cx')
        const y = +node.attr('cy')
        d3.select('#border')
          .attr('transform', `translate(${x}, ${y})`)
          .select('circle')
          .attr('stroke-width', 8)
          .attr('r', nodeRadius + 4)
        d3.select('#popover-container')
          .attr('width', 1000)
          .attr('height', 300)
          .attr('x', x)
          .attr('y', +y - 10)
        setVisible && setVisible(true)
      })
      .on('mouseleave', () => {
        setVisible && setVisible(false)
      })
      .call(
        d3.drag<any, any, Graph.Node>()
          .on('start', dragStart)
          .on('end', dragEnd)
          .on('drag', function (event: any, node: Graph.Node) {
            dragging(this, event, node, edges, config)
          })
      )
    sideContainer
      .append('circle')
      .attr('r', nodeRadius)
      .attr('fill', '#1890ff')
      .attr('id', (node) => node.id)
      .attr('cx', x)
      .attr('cy', y)
      .attr('x', (_, idx) => {
        const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
        return isInside
          ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
          : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('y', (_, idx) => {
        const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
        return isInside
          ? y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
          : y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
      })
      .transition()
      .duration(1000)
      .attr('cx', (_, idx) => {
        const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
        return isInside
          ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
          : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('cy', (_, idx) => {
        const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
        return isInside
          ? y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
          : y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
      })

    sideContainer
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
        const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
        return isInside
          ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
          : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('y', (_, idx) => {
        const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
        return y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
      })
      .text(node => node.type)
    sideContainer
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
        const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
        return isInside
          ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
          : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      })
      .attr('y', (_, idx) => {
        const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
        return isInside
          ? y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI) + nodeRadius + 10
          : y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI) + nodeRadius + 10
      })
      .style('opacity', 1)
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
  config: Graph.ConfigProps,
): any => {
  // 根节点
  const { nodeRadius, setVisible } = config
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
    .on('mouseover', function (event) {
      const node = d3.select(`#${mainNode?.id || 'main'}`)
      const x = node.attr('cx')
      const y = node.attr('cy')
      d3.select('#border')
        .attr('transform', `translate(${x}, ${y})`)
        .select('circle')
        .attr('stroke-width', 8)
        .attr('r', nodeRadius + 4)
      d3.select('#popover-container')
        .attr('width', 1000)
        .attr('height', 300)
        .attr('x', x)
        .attr('y', +y - 10)
      setVisible && setVisible(true)
    })
    .on('mouseleave', () => {
      setVisible && setVisible(false)
    })
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
  drawSideNodes(
    insideTypeNodes,
    config,
    container,
    insideMaxAngle,
    x,
    y,
    edges,
    true
  )

  // 创建出边节点
  drawSideNodes(
    outsideTypeNodes,
    config,
    container,
    outSideMaxAngle,
    x,
    y,
    edges,
    false
  )

  // 创建悬停边框
  d3.select(container)
    .insert('g', ':first-child')
    .attr('id', 'border')
    .append('circle')
    .attr('fill', 'transparent')
    .attr('stroke', 'rgba(24,144,255, .3)')
    .attr('stroke-width', 0)
    .attr('r', nodeRadius)
    .attr('stroke-linecap', 'round')
    .on('mouseleave', () => {
      d3.select('#border')
        .select('circle')
        .attr('stroke-width', 0)
        .attr('r', 0)
    })
}