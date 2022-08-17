/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-17 08:29:22
 * @Description: 请填写简介
 */
import React, { ReactNode, useEffect, useRef } from 'react'
import { drawEdgeArea } from './drawEdgeArea';
import * as d3 from 'd3'
import { Graph } from '../..';

type Props = {
  children: ReactNode;
  vertices: Graph.Vertice[];
  edges: Graph.Line[];
  config: Graph.ConfigProps;
  mainVertice: Graph.Vertice;
}

function EdgeArea({ children, vertices, edges, config, mainVertice }: Props) {
  const edgeAreaContainer = useRef<SVGGElement>(null!)

  useEffect(() => {
    const container = edgeAreaContainer.current
    drawEdgeArea(vertices, edges, config, mainVertice, true)
    return () => {
      d3.select(container).selectAll(':first-child').remove()
      d3.select('#selector-result').remove()
    }
  }, [edges, config, vertices, mainVertice])

  return (
    <g ref={edgeAreaContainer} id="edge-area">
      {children}
    </g>
  )
}

export default EdgeArea