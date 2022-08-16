/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 09:30:47
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-16 10:07:00
 * @Description: 请填写简介
 */
import React, { useEffect } from 'react'
import { drawEdgeArea } from '../../components/KnowledgeMap/drawEdgeArea'
import { drawEdges } from '../../components/MultiLine/drawEdges'
import { FakeEdges } from '../../components/MultiLine/fake_edges'
import { FakeNodes } from '../../components/MultiLine/fake_nodes'
import useScreenSize from '../../hooks/useScreenSize'

function MultiLine() {
  const { width, height } = useScreenSize()

  useEffect(() => {
    drawEdges({ nodes: FakeNodes, edges: FakeEdges })
  }, [])

  return (
    <div style={{ width, height: height - 6 }}>
      <svg width={'100%'} height={'100%'}>
        <g id='edgeArea' />
        <g id='nodeArea'>
          {FakeNodes.map((node, index) => {
            return (
              <g id={node.id} key={node.id}>
                <circle cx={node.x} cy={node.y} r={20} fill={'#1890ff'} />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

export default MultiLine