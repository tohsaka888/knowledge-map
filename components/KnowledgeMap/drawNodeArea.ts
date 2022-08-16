import * as d3 from 'd3'
import { Graph } from '../..'
import { drawEdgeArea } from './drawEdgeArea'
import { drawSideNodes } from './drawSideNodes'
import { verticePrefix } from './prefix'
import { calcArcX, calcArcY } from './utils/calcArc'
import { calcBasicDistence } from './utils/calcBasicDistance'
import { calcMode } from './utils/calcMode'
import { transferLabelName } from './utils/transferLabelName'

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
// const nextPage = (
//   pagination: { page: number, pageSize: number },
//   originNodes: Graph.Node[],
//   total: number,
//   index: number,
//   maxAngle: number,
//   edges: Graph.Edge[],
//   config: Graph.ConfigProps,
//   isInside: boolean,
//   centerPoint: Graph.Node
// ) => {
//   const { mode, nodeRadius, basicDistence, setVisible } = config
//   d3.select('#border').select('circle').attr('r', 0)
//   const x = centerPoint.x!
//   const y = centerPoint.y!

//   pagination.page = (pagination.page + 1) % total === 0 ? total : (pagination.page + 1) % total
//   const nodes = calcMode(originNodes, pagination.page, mode)
//   d3.select(`#${nodes[0].type}`).selectChildren().remove()
//   const container =
//     d3.select(`#${nodes[0].type}`)
//       .selectAll('g')
//       .data(nodes)
//       .join('g')
//   container
//     .append('circle')
//     .attr('r', nodeRadius)
//     .attr('fill', '#1890ff')
//     .attr('id', (node) => node.id)
//     .attr('cx', x)
//     .attr('cy', y)
//     .transition()
//     .duration(1000)
//     .attr('cx', (node, idx) => {
//       const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
//       node.x = isInside
//         ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
//         : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
//       return node.x as number
//     })
//     .attr('cy', (node, idx) => {
//       const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
//       node.y = isInside
//         ? y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
//         : y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
//       return node.y
//     })
//   container
//     .append('text')
//     .attr('x', x || 0)
//     .attr('y', y || 0)
//     .attr('id', node => node.id + 'text')
//     .style('cursor', 'pointer')
//     .attr('text-anchor', 'middle')
//     .attr('dominant-baseline', 'middle')
//     .attr('fill', '#fff')
//     .style('font-size', 14)
//     .text(node => node.type)
//     .transition()
//     .duration(1000)
//     .attr('x', (node, idx) => {
//       return node.x as number
//     })
//     .attr('y', (node, idx) => {
//       return node.y as number
//     })
//   container
//     .append('text')
//     .attr('x', x)
//     .attr('y', y)
//     .attr('text-anchor', 'middle')
//     .style('font-size', 10)
//     .text(item => item.name)
//     .attr('id', item => `${item.id}name`)
//     .style('opacity', 0)
//     .transition()
//     .duration(1000)
//     .attr('x', (node, idx) => {
//       return node.x as number;
//     })
//     .attr('y', (node, idx) => {
//       return node.y as number + nodeRadius + 10;
//     })
//     .style('opacity', 1);

//   // 延迟1s挂在事件,防止在节点移动中显示悬浮窗 
//   window.setTimeout(() => {
//     container.call(
//       d3.drag<any, any, Graph.Node>()
//         .on('start', function (event: any, node: Graph.Node) {
//           dragStart(this, event, node, config)
//         })
//         .on('end', function (event: any, node: Graph.Node) {
//           dragEnd(this, event, node, config)
//         })
//         .on('drag', function (event: any, node: Graph.Node) {
//           dragging(this, event, node, edges, config)
//         })
//     ).on('mouseover', function (event, d) {
//       event.stopPropagation();
//       const node = d3.select(`#${d.id}`)
//       const x = +node.attr('cx')
//       const y = +node.attr('cy')
//       d3.select('#border')
//         .attr('transform', `translate(${x}, ${y})`)
//         .select('circle')
//         .attr('stroke-width', 8)
//         .attr('r', nodeRadius + 4)
//       d3.select('#popover-container')
//         .attr('width', nodeRadius * 2 + 10)
//         .attr('height', nodeRadius * 2 + 10)
//         .attr('x', +x)
//         .attr('y', +y - 10)
//       setVisible && setVisible(true)
//     })
//   }, 1000)

//   edges.forEach((edge) => {
//     if (edge.fromId.includes(nodes[0].type) || edge.toId.includes(nodes[0].type)) {
//       d3.select(`#${edge.fromId}${edge.toId}`).remove()
//       d3.select(`#${edge.fromId}${edge.toId}description`).remove()
//       d3.select(`#${edge.fromId}${edge.toId}icon`).remove()
//     }
//   })
//   drawEdgeArea([...nodes, centerPoint], edges, config, centerPoint.id)
//   d3.select(`#${nodes[0].type}-text`).text(`${pagination.page}/${total}`)
// }

/**
 *  拖拽开始事件
 * @date 2022-08-03
 * @param {any} this:any
 * @param {any} event:any
 * @param {any} node:Graph.Node
 * @param {any} config:Graph.ConfigProps
 * @returns {any}
 */
function dragStart(that: any, event: any, node: Graph.Node, config: Graph.ConfigProps) {
  const { setVisible } = config
  if (setVisible) {
    setVisible(false)
  }
  d3.select(that).style('cursor', 'grabbing')
}

/**
 * 描述 拖拽结束事件
 * @date 2022-07-15
 * @param {any} this:any
 * @param {any} event:any
 * @param {any} node:Graph.Node
 * @param {any} config:Graph.ConfigProps
 * @returns {any}
 */
function dragEnd(that: any, event: any, node: Graph.Node, config: Graph.ConfigProps) {
  const { setVisible } = config
  if (setVisible) {
    setVisible(false)
  }
  d3.select(that).style('cursor', 'pointer')
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
  node.x = event.x
  node.y = event.y
  if (setVisible) {
    setVisible(false)
  }

  requestAnimationFrame(() => {
    // 更改相关节点的位置
    d3.select(`#${node.id}`)
      .attr('cx', event.x)
      .attr('cy', event.y)
    d3.select(`#${node.id}text`)
      .attr('x', event.x)
      .attr('y', event.y)
    d3.select(`#${node.id}name`)
      .attr('x', event.x)
      .attr('y', event.y + nodeRadius + 10)

    const x = node.x
    const y = node.y
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
        if (config.isStraight) {
          curEdge
            .attr('d', `M ${event.x} ${event.y} L ${toNode.attr('cx')} ${toNode.attr('cy')}`)
        } else {
          let perX = 0
          if (toNode.nodes().length !== 0) {
            perX = (+toNode.attr('cx') - +event.x) / config.besselRate
          }
          curEdge.attr('d', `
            M ${event.x} ${event.y},
            C ${+event.x + perX} ${event.y},
            ${+toNode.attr('cx') - perX} ${toNode.attr('cy')},
            ${toNode.attr('cx')} ${toNode.attr('cy')}
        `)
        }
      }
    })
    // 更改出边相关的位置
    toEdges.forEach(edge => {
      const fromNode = d3.select(`#${edge.fromId}`)
      const curEdge = d3.select(`#${edge.fromId}${edge.toId}`)
      if (fromNode.nodes().length !== 0 && curEdge.nodes().length !== 0) {
        if (config.isStraight) {
          curEdge.attr('d', `M ${fromNode.attr('cx')} ${fromNode.attr('cy')} L ${event.x} ${event.y}`)
        } else {
          let perX = 0
          if (fromNode.nodes().length !== 0) {
            perX = (+fromNode.attr('cx') - +event.x) / config.besselRate
          }
          curEdge.attr('d', `
          M ${fromNode.attr('cx')} ${fromNode.attr('cy')},
          C ${+fromNode.attr('cx') - perX} ${fromNode.attr('cy')},
          ${+event.x + perX} ${event.y},
          ${event.x} ${event.y}
      `)
        }
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

type Props = {
  container: SVGGElement,
  mainVertice: Graph.Vertice,
  insideVertices: Graph.Vertice[],
  outSideVertices: Graph.Vertice[],
  x?: number,
  y?: number,
  config: Graph.ConfigProps,
  init: boolean
}

export const drawNodeArea = (
  {
    container,
    mainVertice,
    insideVertices,
    outSideVertices,
    x,
    y,
    config,
    init
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

  const outsideTypes = Array.from(new Set(outSideVertices.map(v => v.labelName)))
  const outsideTypeVertices = outsideTypes.map((type) => {
    return outSideVertices.filter(v => v.labelName === type)
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
  mainNodeContainer
    .append('circle')
    .attr('r', nodeRadius)
    .attr('cx', mainVertice.x!)
    .attr('cy', mainVertice.y!)
    .attr('fill', '#1890ff')
    .style('cursor', 'pointer')
    .attr('id', verticePrefix + mainVertice.id || '')
  mainNodeContainer
    .append('text')
    .attr('x', mainVertice.x!)
    .attr('y', mainVertice.y!)
    .attr('id', verticePrefix + mainVertice.id + 'text')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('fill', '#fff')
    .style('font-size', 12)
    .text(transferLabelName(mainVertice.labelName) || '')
  mainNodeContainer
    .append('text')
    .attr('x', mainVertice.x!)
    .attr('y', mainVertice.y! + nodeRadius + 10)
    .attr('id', verticePrefix + mainVertice.id + 'name')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', 10)
    .text(mainVertice.name || '')

  // 创建入边节点
  drawSideNodes(
    {
      typeNodes: insideTypeVertices,
      config,
      container,
      isInside: true,
      centerPoint: mainVertice,
      maxAngle: insideMaxAngle
    }
  )

  // 创建出边节点
  // drawSideNodes(
  //   outsideTypeNodes,
  //   config,
  //   container,
  //   outSideMaxAngle,
  //   x,
  //   y,
  //   edges,
  //   false,
  //   mainNode
  // )

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