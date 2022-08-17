import * as d3 from 'd3'
import React from 'react'
import { Graph } from '../..'

let size = 1
let canvasX = 0
let canvasY = 0


/**
 * 描述 重置画布大小
 * @date 2022-08-16
 * @returns {any}
 */
export const resetSize = () => {
  size = 1
}

/**
 * 描述 多选拖拽事件
 * @date 2022-08-16
 * @param {any} nodes:Graph.Node[]
 * @param {any} edges:Graph.Edge[]
 * @param {any} event:any
 * @param {any} config:Graph.ConfigProps
 * @returns {any}
 */
const draggingEvent = (nodes: Graph.Node[], edges: Graph.Edge[], event: any, config: Graph.ConfigProps) => {
  nodes.forEach((node) => {
    const item = d3.select(`#${node.id}`)
    node.x += event.dx
    node.y += event.dy
    item
      .attr('cx', node.x as number)
      .attr('cy', node.y as number)

    const itemText = d3.select(`#${node.id}text`)
    itemText
      .attr('x', node.x as number)
      .attr('y', node.y as number)

    const itemName = d3.select(`#${node.id}name`)
    itemName
      .attr('x', node.x as number)
      .attr('y', node.y as number + config.nodeRadius + 10)

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
            .attr('d', `M ${node.x as number + event.dx} ${node.y as number + event.dy} L ${toNode.attr('cx')} ${toNode.attr('cy')}`)
        } else {
          let perX = 0
          if (toNode.nodes().length !== 0) {
            perX = (+toNode.attr('cx') - (node.x || 0) + event.dx) / config.besselRate
          }
          curEdge.attr('d', `
             M ${node.x as number + event.dx} ${node.y as number + event.dy},
             C ${node.x as number + event.dx + perX} ${node.y as number + event.dy},
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

          curEdge.attr('d', `M ${fromNode.attr('cx')} ${fromNode.attr('cy')} L ${node.x as number + event.dx} ${node.y as number + event.dy}`)
        } else {
          let perX = 0
          if (fromNode.nodes().length !== 0) {
            perX = (+fromNode.attr('x') - (node.x as number) + event.dx) / config.besselRate
          }
          curEdge.attr('d', `
           M ${fromNode.attr('x')} ${fromNode.attr('y')},
           C ${+fromNode.attr('x') - perX} ${fromNode.attr('y')},
           ${node.x as number + event.dx + perX} ${node.y as number + event.dy},
           ${node.x as number + event.dx} ${node.y as number + event.dy}
       `)
        }
      }
    })
  })
}

/**
 * 描述 拖拽及缩放画布
 * @date 2022-08-16
 * @param {any} canvas:SVGSVGElement
 * @param {any} nodes:Graph.Node[]
 * @param {any} edges:Graph.Edge[]
 * @param {any} setVisible:React.Dispatch<React.SetStateAction<boolean>>
 * @param {any} config:Graph.ConfigProps
 * @returns {any}
 */
export const canvasDrag = (
  canvas: SVGSVGElement,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  d3.select(canvas)
    .on('mouseover', () => {
      if (setVisible) {
        setVisible(false)
      }
      d3.select('#border')
        .select('circle')
        .attr('stroke-width', 0)
        .attr('r', 0)
    })
    .on('wheel', function (event: any) {
      if (event.deltaY < 0) {
        d3.select('#scale')
          .attr('transform', `scale(${size *= 1.05})`)
      } else {
        d3.select('#scale')
          .attr('transform', `scale(${size *= 0.95})`)
      }
    })
    .on('click', () => {
      d3.select('#selector-result').remove()
    })
  d3.select('#popover')
    .on('mouseover', function (event: any) {
      event.stopPropagation();
    })
}

/**
 * 拖拽画布
 * @date 2022-08-16
 * @param {any} canvas:SVGSVGElement
 * @returns {any}
 */
export const normalDrag = (
  canvas: SVGSVGElement
) => {
  const mainCanvas = d3.select(canvas)
  const currentElement = d3.select('#drag')
  mainCanvas.call(
    d3.drag<SVGSVGElement, unknown>()
      .on('start', function () {
        d3.select(this).style('cursor', 'pointer')
      })
      .on('drag', function (event: any) {
        requestAnimationFrame(() => {
          canvasX += event.dx / size
          canvasY += event.dy / size
          // 当前坐标加上拖拽的相对坐标
          // 即新坐标相比原坐标的偏移量
          currentElement.attr(
            "transform",
            `translate(${canvasX}, ${canvasY})`
          );
        })
      })
      .on('end', function () {
        d3.select(this).style('cursor', 'auto')
      })
  )
}

/**
 * 描述 多选拖拽
 * @date 2022-08-16
 * @param {any} canvas:SVGSVGElement
 * @param {any} nodes:Graph.Node[]
 * @param {any} edges:Graph.Edge[]
 * @param {any} config:Graph.ConfigProps
 * @returns {any}
 */
export const multiDrag = (
  canvas: SVGSVGElement,
  nodes: Graph.Node[],
  edges: Graph.Edge[],
  config: Graph.ConfigProps
) => {
  let startX = 0, startY = 0
  let endX = 0, endY = 0
  let minX = 0, minY = 0, maxX = 0, maxY = 0
  const mainCanvas = d3.select(canvas)
  mainCanvas.call(d3.drag<SVGSVGElement, unknown>()
    .on('start', function (e) {
      d3.select(`#selector-result`).remove()
      startX = e.x
      startY = e.y
      d3.select(this)
        .append('path')
        .attr('id', 'selector')
        .attr('d', `M ${e.x} ${e.y}`)
        .attr('fill', 'rgba(24, 144, 255, 0.1)')
        .attr('stroke', '#1890ff')
        .attr('stroke-width', 1)
    })
    .on('drag', function (e) {
      const selector = d3.select('#selector')
      selector.attr('d', `M ${startX} ${startY},L ${e.x} ${startY},L ${e.x} ${e.y}, L ${startX} ${e.y} Z`)
    })
    .on('end', function (e) {
      endX = e.x
      endY = e.y
      // 获取偏移量
      const x = canvasX;
      const y = canvasY;
      // 移除偏移影响
      const areaNodes = nodes.filter((node) => {
        return node.x && node.y
          && node.y as number - config.nodeRadius < Math.max(startY, endY) / size - y
          && node.y as number + config.nodeRadius > Math.min(startY, endY) / size - y
          && node.x as number - config.nodeRadius < Math.max(startX, endX) / size - x
          && node.x as number + config.nodeRadius > Math.min(startX, endX) / size - x
      })
      areaNodes.forEach((node, index) => {
        if (index === 0) {
          minX = node.x as number
          maxX = minX
          minY = node.y as number
          maxY = minY
        } else {
          if (node.x as number < minX) { minX = node.x as number }
          if (node.y as number < minY) { minY = node.y as number }
          if (node.x as number > maxX) { maxX = node.x as number }
          if (node.y as number > maxY) { maxY = node.y as number }
        }
      })
      d3.select('#selector').remove()
      d3.select(this)
        .select('#drag')
        .append('path')
        .attr('fill', 'rgba(24, 144, 255, 0.1)')
        .attr('stroke', '#1890ff')
        .attr('stroke-width', 1)
        .attr('id', 'selector-result')
        .attr('transform', 'translate(0, 0)')
        .attr('d',
          `M ${minX - config.nodeRadius - 10} ${minY - config.nodeRadius - 10},
             L ${maxX + config.nodeRadius + 10} ${minY - config.nodeRadius - 10}, 
             L ${maxX + config.nodeRadius + 10} ${maxY + config.nodeRadius + 10},
             L ${minX - config.nodeRadius - 10} ${maxY + config.nodeRadius + 10} Z`
        )
        .call(
          d3.drag<SVGPathElement, unknown, null>()
            .on('start', function () {
              d3.select(this).style('cursor', 'move')
            })
            .on('drag', function (event: any) {
              requestAnimationFrame(() => {
                const currentElement = d3.select(this)
                const tempArr = currentElement.attr("transform").split(",");
                // 获取当前的x和y坐标
                const x = +(tempArr?.[0]?.split("(")[1] || 0);
                const y = +(tempArr?.[1]?.split(")")[0] || 0);
                // 当前坐标加上拖拽的相对坐标
                // 即新坐标相比原坐标的偏移量
                currentElement
                  .attr(
                    "transform",
                    `translate(${x + event.dx}, ${y + event.dy})`
                  )
                  .style('cursor', 'move')
                draggingEvent(areaNodes, edges, event, config)
              })
            })
            .on('end', function (event: any) {
              requestAnimationFrame(() => {
                const currentElement = d3.select(this)
                const tempArr = currentElement.attr("transform").split(",");
                // 获取当前的x和y坐标
                const x = +(tempArr?.[0]?.split("(")[1] || 0);
                const y = +(tempArr?.[1]?.split(")")[0] || 0);
                // 当前坐标加上拖拽的相对坐标
                // 即新坐标相比原坐标的偏移量
                currentElement
                  .attr(
                    "transform",
                    `translate(${x + event.dx}, ${y + event.dy})`
                  )
                  .style('cursor', 'move')
                draggingEvent(areaNodes, edges, event, config)
              })
              d3.select(this).style('cursor', 'default')
            })
        )
    })
  )
}