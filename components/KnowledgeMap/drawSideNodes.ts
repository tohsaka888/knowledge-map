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

import { Graph } from "../.."
import { calcMode } from "./utils/calcMode";
import * as d3 from 'd3'
import { calcArcX, calcArcY } from "./utils/calcArc";
import { calcBasicDistence } from "./utils/calcBasicDistance";
import { verticePrefix } from "./prefix";
import { createSideNode } from "./createNode";

type Props = {
  typeNodes: Graph.Vertice[][];
  config: Graph.ConfigProps;
  container: SVGGElement;
  isInside: boolean;
  centerPoint: Graph.Vertice;
  maxAngle: number;
}

export const drawSideNodes = (
  {
    typeNodes,
    config,
    container,
    isInside,
    centerPoint,
    maxAngle
  }: Props
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
        .attr('transform-origin', `${centerPoint.x} ${centerPoint.y}`)
      arc
        .append('path')
        .attr('d',
          `M ${centerPoint.x} ${centerPoint.y} 
            m ${arcAreaDistence} 0 
            a ${arcAreaDistence} ${arcAreaDistence} 0 0 1 ${calcArcX(arcAreaDistence, maxAngle)} ${calcArcY(arcAreaDistence, maxAngle)}`
        )
        .attr('fill', 'none')
        .attr('stroke', 'rgba(24, 144, 255, 0.1)')
        .attr('stroke-width', arcAreaLength)
      arc
        .append('g')
        .attr('transform', `translate(${centerPoint.x! + arcAreaDistence - arcAreaLength / 4} ${centerPoint.y})`)
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
          // nextPage(
          //   pagination,
          //   originNodes,
          //   originNodes.length % 5 === 0 ? +(originNodes.length / 5).toFixed(0) : Math.floor(originNodes.length / 5) + 1,
          //   index,
          //   maxAngle,
          //   edges,
          //   config,
          //   isInside,
          //   centerPoint
          // )
        })

      arc
        .append('g')
        .classed('arc-text', true)
        .attr('transform', `translate(${centerPoint.x! + arcAreaDistence - arcAreaLength / 5}, ${centerPoint.y})`)
        .append('g')
        .attr('transform-origin', `${-arcAreaDistence + arcAreaLength / 5} ${0}`)
        .attr('transform', `rotate(${maxAngle / 2})`)
        .append('text')
        .attr('transform', `rotate(${90})`)
        .text(`1/${originNodes.length % 5 === 0 ? (originNodes.length / 5).toFixed(0) : Math.floor(originNodes.length / 5) + 1} `)
        .attr('id', `${verticePrefix + nodes[0].labelName}-text`)
        .attr('text-anchor', 'right')
    }

    const typeContainer = d3.select(container)
      .append('g')
      .attr('id', verticePrefix + nodes[0].labelName)
    nodes.forEach((node, idx) => {
      // 
      const x = centerPoint.x!
      const y = centerPoint.y!
      const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
      node.x = isInside
        ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
        : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
      node.y = isInside
        ? y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
        : y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
      const sideContainer = typeContainer.append('g')
      createSideNode({ container: sideContainer, vertice: node, mainVertice: centerPoint, config })
      window.setTimeout(() => {
        sideContainer.on('mouseover', function (event) {
          event.stopPropagation();
          const x = node.x as number
          const y = node.y as number
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
          // setVisible && setVisible(true)
        })
        // .call(
        //   d3.drag<any, any, Graph.Node>()
        //     .on('start', function (event: any, node: Graph.Node) {
        //       dragStart(this, event, node, config)
        //     })
        //     .on('end', function (event: any, node: Graph.Node) {
        //       dragEnd(this, event, node, config)
        //     })
        //     .on('drag', function (event: any, node: Graph.Node) {
        //       dragging(this, event, node, edges, config)
        //     })
        // )
      }, 1000)
    })
  })
}