/*
 * @Author: tohsaka888
 * @Date: 2022-08-08 08:29:23
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-08 11:00:58
 * @Description: 请填写简介
 */
import React, { useContext, useEffect, useRef } from 'react'
import { drawNodeArea } from './drawNodeArea';
import * as d3 from 'd3'
import { Graph } from '../..';
import { VisibleContext } from '../context';

function NodeArea({ nodes, edges, config }: { nodes: Graph.Node[]; edges: Graph.Edge[]; config: Graph.ConfigProps }) {

  const nodesContainerRef = useRef<SVGGElement>(null!)
  const { setVisible } = useContext(VisibleContext)!

  // 状态改变时清除画布
  useEffect(() => {
    const container = nodesContainerRef.current
    drawNodeArea(container, nodes, edges, 700, 400, {...config, setVisible})
    return () => {
      d3.select(container).selectAll('*').remove()
      // 清除记住的节点坐标
      nodes.forEach((node) => {
        node.x = 0
        node.y = 0
      })
    }
  }, [config, edges, nodes, setVisible])

  return (
    <g ref={nodesContainerRef} id="node-area" />
  )
}

export default NodeArea