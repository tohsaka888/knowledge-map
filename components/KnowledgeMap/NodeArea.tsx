import React, { useContext, useEffect, useRef } from 'react'
import { PageContext } from './context';
import { drawNodeArea } from './drawNodeArea';

function NodeArea({ nodes, edges, mode }: { nodes: Graph.Node[]; edges: Graph.Edge[]; mode: number }) {

  const nodesContainerRef = useRef<SVGGElement>(null!)
  const { page, setPage } = useContext(PageContext)!

  useEffect(() => {
    drawNodeArea(nodesContainerRef.current, nodes, edges, 700, 400, page, setPage, mode)
  }, [edges, mode, nodes, page, setPage])

  return (
    <g ref={nodesContainerRef} />
  )
}

export default NodeArea