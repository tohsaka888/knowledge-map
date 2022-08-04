import * as d3 from 'd3'
import React from 'react'
import { Graph } from '../..'

// 缩放bug

let size = 1

export const resetSize = () => {
  size = 1
}

const draggingEvent = (nodes: Graph.Node[], edges: Graph.Edge[], event: any, config: Graph.ConfigProps) => {
  nodes.forEach((node) => {
    const item = d3.select(`#${node.id}`)
    item
      .attr('cx', +item.attr('cx') + event.dx)
      .attr('cy', +item.attr('cy') + event.dy)
      .attr('x', +item.attr('cx') + event.dx)
      .attr('y', +item.attr('cy') + event.dy)

    const itemText = d3.select(`#${node.id}text`)
    itemText
      .attr('x', +itemText.attr('x') + event.dx)
      .attr('y', +itemText.attr('y') + event.dy)

    const itemName = d3.select(`#${node.id}name`)
    itemName
      .attr('x', +itemName.attr('x') + event.dx)
      .attr('y', +itemName.attr('y') + event.dy)

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
            .attr('d', `M ${+item.attr('cx') + event.dx} ${+item.attr('cy') + event.dy} L ${toNode.attr('cx')} ${toNode.attr('cy')}`)
        } else {
          let perX = 0
          if (toNode.nodes().length !== 0) {
            perX = (+toNode.attr('x') - +item.attr('cx') + event.dx) / config.besselRate
          }
          curEdge.attr('d', `
             M ${+item.attr('cx') + event.dx} ${+item.attr('cy') + event.dy},
             C ${+item.attr('cx') + event.dx + perX} ${+item.attr('cy') + event.dy},
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

          curEdge.attr('d', `M ${fromNode.attr('cx')} ${fromNode.attr('cy')} L ${+item.attr('cx') + event.dx} ${+item.attr('cy') + event.dy}`)
        } else {
          let perX = 0
          if (fromNode.nodes().length !== 0) {
            perX = (+fromNode.attr('x') - +item.attr('cx') + event.dx) / config.besselRate
          }
          curEdge.attr('d', `
           M ${fromNode.attr('x')} ${fromNode.attr('y')},
           C ${+fromNode.attr('x') - perX} ${fromNode.attr('y')},
           ${+item.attr('cx') + event.dx + perX} ${+item.attr('cy') + event.dy},
           ${+item.attr('cx') + event.dx} ${+item.attr('cy') + event.dy}
       `)
        }
      }
    })
  })
}

export const canvasDrag = (
  canvas: SVGSVGElement,
  nodes: Graph.Node[],
  edges: Graph.Edge[],
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  config: Graph.ConfigProps
) => {
  const mainCanvas = d3.select(canvas)
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

export const normalDrag = (
  canvas: SVGSVGElement
) => {
  const mainCanvas = d3.select(canvas)
  mainCanvas.call(
    d3.drag<SVGSVGElement, unknown>()
      .on('start', function () {
        d3.select(this).style('cursor', 'pointer')
      })
      .on('drag', function (event: any) {
        const currentElement = d3.select('#drag')
        const tempArr = currentElement.attr("transform").split(",");
        // 获取当前的x和y坐标
        const x = +(tempArr?.[0]?.split("(")[1] || 0);
        const y = +(tempArr?.[1]?.split(")")[0] || 0);
        // 当前坐标加上拖拽的相对坐标
        // 即新坐标相比原坐标的偏移量
        currentElement.attr(
          "transform",
          `translate(${x + event.dx / size}, ${y + event.dy / size})`
        );
      })
      .on('end', function () {
        d3.select(this).style('cursor', 'auto')
      })
  )
}

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
      const drag = d3.select('#drag').attr('transform')
      const tempArr = drag.split(",");
      // 获取偏移量
      const x = +(tempArr?.[0]?.split("(")[1] || 0);
      const y = +(tempArr?.[1]?.split(")")[0] || 0);
      // 移除偏移影响
      // startX -= x;
      // startY -= y;
      // endX -= x;
      // endY -= y;
      const areaNodes = nodes.filter((node) => {
        const item = d3.select(`#${node.id}`)
        return item.nodes().length !== 0
          && +item.attr('cy') - config.nodeRadius < Math.max(startY, endY) / size - y
          && +item.attr('cy') + config.nodeRadius > Math.min(startY, endY) / size - y
          && +item.attr('cx') - config.nodeRadius < Math.max(startX, endX) / size - x
          && +item.attr('cx') + config.nodeRadius > Math.min(startX, endX) / size - x
      })
      console.log(areaNodes)
      areaNodes.forEach((node, index) => {
        const item = d3.select(`#${node.id}`)
        if (index === 0) {
          minX = +item.attr('cx')
          maxX = minX
          minY = +item.attr('cy')
          maxY = minY
        } else {
          if (+item.attr('cx') < minX) { minX = +item.attr('cx') }
          if (+item.attr('cy') < minY) { minY = +item.attr('cy') }
          if (+item.attr('cx') > maxX) { maxX = +item.attr('cx') }
          if (+item.attr('cy') > maxY) { maxY = +item.attr('cy') }
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