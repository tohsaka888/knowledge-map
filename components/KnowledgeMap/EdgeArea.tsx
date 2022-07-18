import React, { ReactNode, useEffect, useRef } from 'react'
import { drawEdgeArea } from './drawEdgeArea';
import * as d3 from 'd3'

function EdgeArea({ children, edges, mode }: { children: ReactNode; edges: Graph.Edge[]; mode: number }) {
  const edgeAreaContainer = useRef<SVGGElement>(null!)

  useEffect(() => {
    const container = edgeAreaContainer.current
    drawEdgeArea(edges, mode)
    return () => {
      d3.select(container).selectAll(':first-child').remove()
    }
  }, [edges, mode])

  return (
    <g ref={edgeAreaContainer} id="edge-area">
      {children}
    </g>
  )
}

export default EdgeArea