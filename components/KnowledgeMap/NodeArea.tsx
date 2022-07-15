import React, { useEffect, useRef } from 'react'
import { drawNodeArea } from './drawNodeArea';

function NodeArea({ nodes, edges }: { nodes: Graph.Node[]; edges: Graph.Edge[]; }) {

  const nodesContainerRef = useRef<SVGGElement>(null!)

  useEffect(() => {
    drawNodeArea(nodesContainerRef.current, nodes, edges, 700, 400)
  }, [edges, nodes])

  return (
    <g ref={nodesContainerRef} />
  )
}

export default NodeArea