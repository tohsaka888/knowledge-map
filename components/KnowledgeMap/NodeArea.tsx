import React, { useContext, useEffect, useRef } from 'react'
import { drawNodeArea } from './drawNodeArea';
import * as d3 from 'd3'
import { Graph } from '../..';
import { VisibleContext } from '../context';

function NodeArea({ nodes, edges, config }: { nodes: Graph.Node[]; edges: Graph.Edge[]; config: Graph.ConfigProps }) {

  const nodesContainerRef = useRef<SVGGElement>(null!)
  const { setVisible } = useContext(VisibleContext)!

  useEffect(() => {
    const container = nodesContainerRef.current
    drawNodeArea(container, nodes, edges, 700, 400, config, setVisible)
    return () => {
      d3.select(container).selectAll('*').remove()
    }
  }, [config, edges, nodes, setVisible])

  return (
    <g ref={nodesContainerRef} />
  )
}

export default NodeArea