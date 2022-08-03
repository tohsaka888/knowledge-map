/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-03 17:08:28
 * @Description: 请填写简介
 */
import React, { ReactNode, useEffect, useRef } from 'react'
import { drawEdgeArea } from './drawEdgeArea';
import * as d3 from 'd3'
import { Graph } from '../..';

function EdgeArea({ children, edges, config }: { children: ReactNode; edges: Graph.Edge[], config: Graph.ConfigProps }) {
  const edgeAreaContainer = useRef<SVGGElement>(null!)

  useEffect(() => {
    const container = edgeAreaContainer.current
    drawEdgeArea(edges, config)
    return () => {
      d3.select(container).selectAll(':first-child').remove()
      d3.select('#selector-result').remove()
    }
  }, [edges, config])

  return (
    <g ref={edgeAreaContainer} id="edge-area">
      {children}
    </g>
  )
}

export default EdgeArea