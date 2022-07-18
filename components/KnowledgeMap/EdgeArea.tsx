import React, { ReactNode, useEffect, useRef } from 'react'
import { drawEdgeArea } from './drawEdgeArea';

function EdgeArea({ children, edges, mode }: { children: ReactNode; edges: Graph.Edge[]; mode: number}) {
  const edgeAreaContainer = useRef<SVGGElement>(null!)

  useEffect(() => {
    drawEdgeArea(edges, mode)
  }, [edges, mode])

  return (
    <g ref={edgeAreaContainer} id="edge-area">
      {children}
    </g>
  )
}

export default EdgeArea