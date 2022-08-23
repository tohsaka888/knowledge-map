/*
 * @Author: tohsaka888
 * @Date: 2022-08-08 08:29:23
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-23 16:20:28
 * @Description: 请填写简介
 */
import React, { useEffect, useRef } from 'react'
import { drawNodeArea } from './drawNodeArea';
import * as d3 from 'd3'
import { Graph } from '../..';
// import { VisibleContext } from '../context';

type Props = {
  mainVertice: Graph.Vertice;
  edges: Graph.Line[];
  config: Graph.ConfigProps;
  insideVertices: Graph.Vertice[];
  outsideVertices: Graph.Vertice[];
}

function NodeArea({ mainVertice, insideVertices, outsideVertices, edges, config }: Props) {

  const nodesContainerRef = useRef<SVGGElement>(null!)

  // 状态改变时清除画布
  useEffect(() => {
    const container = nodesContainerRef.current
    drawNodeArea(
      {
        container,
        mainVertice,
        insideVertices,
        outsideVertices,
        config,
        x: 700,
        y: 400,
        init: true,
        edges
      }
    )
    return () => {
      d3.select(container).selectAll('*').remove()
      // 清除记住的节点坐标
      insideVertices.forEach((node) => {
        node.x = 0
        node.y = 0
      })
      outsideVertices.forEach((node) => {
        node.x = 0
        node.y = 0
      })
      mainVertice.x = 0
      mainVertice.y = 0
    }
  }, [config, edges, insideVertices, mainVertice, outsideVertices])

  return (
    <g ref={nodesContainerRef} id="node-area" />
  )
}

export default NodeArea