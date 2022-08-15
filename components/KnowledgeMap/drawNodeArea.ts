import * as d3 from 'd3'
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
  centerPoint: Graph.Node
) => {
  const { mode, nodeRadius, basicDistence, setVisible } = config
  d3.select('#border').select('circle').attr('r', 0)
  const x = centerPoint.x!
  const y = centerPoint.y!

  pagination.page = (pagination.page + 1) % total === 0 ? total : (pagination.page + 1) % total
  const nodes = calcMode(originNodes, pagination.page, mode)
  d3.select(`#${nodes[0].type}`).selectChildren().remove()
  const container =
    d3.select(`#${nodes[0].type}`)
      .selectAll('g')
      .data(nodes)
      .join('g')
  container
    .append('circle')
    .attr('r', nodeRadius)
    .attr('fill', '#1890ff')
    .attr('id', (node) => node.id)
    .attr('cx', x)
    .attr('cy', y)
    .transition()
    .duration(1000)
    .attr('cx', (node, idx) => {
      const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
      node.x = isInside
        ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
        : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      return node.x as number
    })
    .attr('cy', (node, idx) => {
      const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
      node.y = isInside
        ? y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
        : y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
      return node.y
    })
  container
    .append('text')
    .attr('x', x || 0)
    .attr('y', y || 0)
    .attr('id', node => node.id + 'text')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', '#fff')
    .style('font-size', 14)
    .text(node => node.type)
    .transition()
    .duration(1000)
    .attr('x', (node, idx) => {
      return node.x as number
    })
    .attr('y', (node, idx) => {
      return node.y as number
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
    .attr('x', (node, idx) => {
      return node.x as number;
    })
    .attr('y', (node, idx) => {
      return node.y as number + nodeRadius + 10;
    })
    .style('opacity', 1);

  // 延迟1s挂在事件,防止在节点移动中显示悬浮窗 
  window.setTimeout(() => {
    container.call(
      d3.drag<any, any, Graph.Node>()
        .on('start', function (event: any, node: Graph.Node) {
          dragStart(this, event, node, config)
        })
        .on('end', function (event: any, node: Graph.Node) {
          dragEnd(this, event, node, config)
        })
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
        .attr('width', nodeRadius * 2 + 10)
        .attr('height', nodeRadius * 2 + 10)
        .attr('x', +x)
        .attr('y', +y - 10)
      setVisible && setVisible(true)
    })
  }, 1000)

  edges.forEach((edge) => {
    if (edge.fromId.includes(nodes[0].type) || edge.toId.includes(nodes[0].type)) {
      d3.select(`#${edge.fromId}${edge.toId}`).remove()
      d3.select(`#${edge.fromId}${edge.toId}description`).remove()
      d3.select(`#${edge.fromId}${edge.toId}icon`).remove()
    }
  })
  drawEdgeArea([...nodes, centerPoint], edges, config, centerPoint.id)
  d3.select(`#${nodes[0].type}-text`).text(`${pagination.page}/${total}`)
}

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
  centerPoint: Graph.Node
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
            isInside,
            centerPoint
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
        .text(`1/${originNodes.length % 5 === 0 ? (originNodes.length / 5).toFixed(0) : Math.floor(originNodes.length / 5) + 1} `)
        .attr('id', `${nodes[0].type}-text`)
        .attr('text-anchor', 'right')
    }
    const sideContainer = d3.select(container)
      .append('g')
      .attr('id', nodes[0].type)
      .selectAll('g')
      .data(nodes)
      .join('g')

    window.setTimeout(() => {
      sideContainer.on('mouseover', function (event, d) {
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
          .attr('width', nodeRadius * 2 + 10)
          .attr('height', nodeRadius * 2 + 10)
          .attr('x', +x)
          .attr('y', +y - 10)
        setVisible && setVisible(true)
      })
        .call(
          d3.drag<any, any, Graph.Node>()
            .on('start', function (event: any, node: Graph.Node) {
              dragStart(this, event, node, config)
            })
            .on('end', function (event: any, node: Graph.Node) {
              dragEnd(this, event, node, config)
            })
            .on('drag', function (event: any, node: Graph.Node) {
              dragging(this, event, node, edges, config)
            })
        )
    }, 1000)

    sideContainer
      .append('circle')
      .attr('r', nodeRadius)
      .attr('fill', '#1890ff')
      .attr('id', (node) => node.id)
      .attr('cx', x)
      .attr('cy', y)
      .transition()
      .duration(1000)
      .attr('cx', (node, idx) => {
        const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
        node.x = isInside
          ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
          : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
        return node.x
      })
      .attr('cy', (node, idx) => {
        const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
        node.y = isInside
          ? y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
          : y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
        return node.y
      })

    sideContainer
      .append('text')
      .attr('id', node => node.id + 'text')
      .style('cursor', 'pointer')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#fff')
      .style('font-size', 14)
      .attr('x', x)
      .attr('y', y)
      .transition()
      .duration(1000)
      .attr('x', (node, idx) => {
        return node.x as number
      })
      .attr('y', (node, idx) => {
        return node.y as number
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
      .attr('x', (node, idx) => {
        return node.x as number
      })
      .attr('y', (node, idx) => {
        return node.y as number + nodeRadius + 10
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
  d3.selectAll('.force-graph').remove()
  // 根节点
  const { nodeRadius, setVisible } = config
  const mainNode = nodes.find(node => node.mode === 0)!
  if (mainNode) {
    mainNode.x = x
    mainNode.y = y
  }
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
      event.stopPropagation()
      const node = d3.select(`#${mainNode?.id || 'main'}`)
      const x = node.attr('cx')
      const y = node.attr('cy')
      d3.select('#border')
        .attr('transform', `translate(${x}, ${y})`)
        .select('circle')
        .attr('stroke-width', 8)
        .attr('r', nodeRadius + 4)
      d3.select('#popover-container')
        .attr('width', nodeRadius * 2 + 10)
        .attr('height', nodeRadius * 2 + 10)
        .attr('x', +x)
        .attr('y', +y - 10)
      setVisible && setVisible(true)
    })
    .call(
      d3.drag<any, any, Graph.Node>()
        .on('start', function (event: any, node: Graph.Node) {
          dragStart(this, event, node, config)
        })
        .on('end', function (event: any, node: Graph.Node) {
          dragEnd(this, event, node, config)
        })
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
    .style('font-size', 14)
    .text(mainNode?.type || '')
  mainNodeContainer
    .append('text')
    .attr('x', x)
    .attr('y', y + nodeRadius + 10)
    .attr('id', mainNode?.id + 'name')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', 10)
    .text(mainNode?.name || '')

  // 创建入边节点
  drawSideNodes(
    insideTypeNodes,
    config,
    container,
    insideMaxAngle,
    x,
    y,
    edges,
    true,
    mainNode
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
    false,
    mainNode
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
    .on('mouseleave', () => {
      d3.select('#border')
        .select('circle')
        .attr('stroke-width', 0)
        .attr('r', 0)
    })
}