import React, { useContext, useEffect, useRef } from 'react'
import { clearCanvas } from './clearCanvas';
import { PageContext } from './context';
import { drawNodeArea } from './drawNodeArea';
import * as d3 from 'd3'

function NodeArea({ nodes, edges, mode }: { nodes: Graph.Node[]; edges: Graph.Edge[]; mode: number }) {

  const nodesContainerRef = useRef<SVGGElement>(null!)
  const { page, setPage } = useContext(PageContext)!

  useEffect(() => {
    const container = nodesContainerRef.current
    drawNodeArea(container, nodes, edges, 700, 400, mode)
    return () => {
      d3.select(container).selectAll('*').remove()
    }
  }, [edges, mode, nodes, page, setPage])

  return (
    <g ref={nodesContainerRef} />
  )
}

export default NodeArea