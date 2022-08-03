import * as d3 from 'd3'
import React from 'react'
import { Graph } from '../..'

let size = 1

export const resetSize = () => {
  size = 1
}

export const canvasDrag = (canvas: SVGSVGElement, nodes: Graph.Node[], setVisible: React.Dispatch<React.SetStateAction<boolean>>, config: Graph.ConfigProps) => {
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
  if (!config.isSelect) {
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
  } else {
    let startX = 0, startY = 0
    let endX = 0, endY = 0
    let minX = 0, minY = 0, maxX = 0, maxY = 0
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
        // 获取当前的x和y坐标
        const x = +(tempArr?.[0]?.split("(")[1] || 0);
        const y = +(tempArr?.[1]?.split(")")[0] || 0);
        startX -= x
        startY -= y;
        endX -= x;
        endY -= y;
        const areaNodes = nodes.filter((node) => {
          const item = d3.select(`#${node.id}`)
          return item.nodes().length !== 0
            && +item.attr('cy') - config.nodeRadius < Math.max(startY, endY)
            && +item.attr('cy') + config.nodeRadius > Math.min(startY, endY)
            && +item.attr('cx') - config.nodeRadius < Math.max(startX, endX)
            && +item.attr('cx') + config.nodeRadius > Math.min(startX, endX)
        })
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
          .attr('d',
            `M ${minX - config.nodeRadius - 10} ${minY - config.nodeRadius - 10},
             L ${maxX + config.nodeRadius + 10} ${minY - config.nodeRadius - 10}, 
             L ${maxX + config.nodeRadius + 10} ${maxY + config.nodeRadius + 10},
             L ${minX - config.nodeRadius - 10} ${maxY + config.nodeRadius + 10} Z`
          )
      })
    )
  }
  d3.select('#popover')
    .on('mouseover', function (event: any) {
      event.stopPropagation();
    })
}