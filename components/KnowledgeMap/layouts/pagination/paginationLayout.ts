/*
 * @Author: tohsaka888
 * @Date: 2022-08-19 10:47:29
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-22 14:16:00
 * @Description: 请填写简介
 */

import { Graph } from "../../../..";
import { calcArcX, calcArcY } from "../../utils/calcArc";
import * as d3 from 'd3'
import { fPrefix, verticePrefix } from "../../prefix";
import { normalLayout } from "../normal/normalLayout";
import { nextPage } from "./nextPage";

type Props = {
  nodes: Graph.Vertice[];
  maxAngle: number;
  index: number;
  typeContainer: d3.Selection<any, any, any, any>;
  parent: string[];
  isInside: boolean;
  centerPoint: Graph.Vertice;
  atanAngle: number;
  insideLength: number;
  outsideLength: number;
  config: Graph.ConfigProps;
  edges: Graph.Line[];
  originNodes: Graph.Vertice[],
  parentClass: string;
}

export const paginationLayout = (
  {
    nodes,
    maxAngle,
    index,
    isInside,
    centerPoint,
    atanAngle,
    insideLength,
    outsideLength,
    config,
    edges,
    originNodes,
    parentClass
  }: Props
) => {
  const pagination = { page: 1, pageSize: 5 }
  const { arcAreaDistence, arcAreaLength } = config
  const container = d3.select('#node-area')
  let calcedAngle = 0
  if (insideLength === 0 && outsideLength !== 0) {
    calcedAngle = isInside ? -90 - (index + 1) * maxAngle : -90 + index * maxAngle + 180 + atanAngle / Math.PI * 180
  } else {
    calcedAngle = isInside ? -90 - (index + 1) * maxAngle : -90 + index * maxAngle + atanAngle / Math.PI * 180
  }
  if (originNodes.length > 5) {
    const arc = container
      .append('g')
      .classed('arc', true)
      .classed(parentClass, true)
      .attr('id', fPrefix + centerPoint.id)
      .attr('transform', `translate(0, 0)`)
      .append('g')
      .attr('transform', `rotate(${calcedAngle})`)
      .attr('transform-origin', `${centerPoint.x} ${centerPoint.y}`)

    arc
      .style('opacity', 0)
      .transition()
      .duration(1500)
      .style('opacity', 1)

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
      .attr('transform', `translate(${centerPoint.x! + arcAreaDistence - arcAreaLength / 6} ${centerPoint.y})`)
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
          {
            pagination,
            originNodes,
            total: originNodes.length % 5 === 0 ? +(originNodes.length / 5).toFixed(0) : Math.floor(originNodes.length / 5) + 1,
            maxAngle,
            edges,
            config,
            isInside,
            centerPoint,
            insideLength,
            outsideLength,
            atanAngle,
            isPrev: true
          }
        )
      })

    arc
      .append('g')
      .attr('transform', `translate(${centerPoint.x! + arcAreaDistence - arcAreaLength / 6} ${centerPoint.y})`)
      .append('g')
      .attr('transform-origin', `${-arcAreaDistence + arcAreaLength / 6} ${0}`)
      .attr('transform', `rotate(${maxAngle})`)
      .append('g')
      .attr('transform', `translate(10, 0)`)
      .append('path')
      .attr('transform', `rotate(${180})`)
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
          {
            pagination,
            originNodes,
            total: originNodes.length % 5 === 0 ? +(originNodes.length / 5).toFixed(0) : Math.floor(originNodes.length / 5) + 1,
            maxAngle,
            edges,
            config,
            isInside,
            centerPoint,
            insideLength,
            outsideLength,
            atanAngle,
            isPrev: false
          }
        )
      })

    arc
      .append('g')
      .classed('arc-text', true)
      .attr('transform', `translate(${centerPoint.x! + arcAreaDistence - arcAreaLength / 6}, ${centerPoint.y})`)
      .append('g')
      .attr('transform-origin', `${-arcAreaDistence + arcAreaLength / 6} ${0}`)
      .attr('transform', `rotate(${maxAngle / 2})`)
      .append('text')
      .attr('transform', `rotate(${90})`)
      .text(`1/${originNodes.length % 5 === 0 ? (originNodes.length / 5).toFixed(0) : Math.floor(originNodes.length / 5) + 1} `)
      .attr('id', `${verticePrefix + nodes[0].labelName}-text`)
      .attr('text-anchor', 'middle')
  }

}