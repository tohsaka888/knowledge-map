import React, { useEffect, useRef } from 'react'
import { drawNodeArea } from './drawNodeArea';
import * as d3 from 'd3'
import { Graph } from '../..';

function NodeArea({ nodes, edges, config }: { nodes: Graph.Node[]; edges: Graph.Edge[]; config: Graph.ConfigProps }) {

  const nodesContainerRef = useRef<SVGGElement>(null!)

  useEffect(() => {
    const container = nodesContainerRef.current
    drawNodeArea(container, nodes, edges, 700, 400, config)
    return () => {
      d3.select(container).selectAll('*').remove()
    }
  }, [config, edges, nodes])

  return (
    <g ref={nodesContainerRef} />
  )
}

export default NodeArea