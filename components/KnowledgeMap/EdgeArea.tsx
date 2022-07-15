import React, { ReactNode, useEffect, useRef } from 'react'
import { drawEdgeArea } from './drawEdgeArea';

function EdgeArea({ children, edges, mode }: { children: ReactNode; edges: Graph.Edge[]; mode: number}) {
  const edgeAreaContainer = useRef<SVGGElement>(null!)

  useEffect(() => {
    drawEdgeArea(edgeAreaContainer.current, edges)
  }, [edges])

  return (
    <g ref={edgeAreaContainer}>
      {children}
    </g>
  )
}

export default EdgeArea