import React, { ReactNode, useEffect, useRef } from 'react'
import { drawEdgeArea } from './drawEdgeArea';
import * as d3 from 'd3'
import { Graph } from '../..';

function EdgeArea({ children, edges, config }: { children: ReactNode; edges: Graph.Edge[], config?: Graph.ConfigProps }) {
  const edgeAreaContainer = useRef<SVGGElement>(null!)

  useEffect(() => {
    const container = edgeAreaContainer.current
    drawEdgeArea(edges)
    return () => {
      d3.select(container).selectAll(':first-child').remove()
    }
  }, [edges, config])

  return (
    <g ref={edgeAreaContainer} id="edge-area">
      {children}
    </g>
  )
}

export default EdgeArea