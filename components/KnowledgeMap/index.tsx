import React, { useEffect, useReducer, useRef, useState } from 'react'
import { canvasDrag } from './canvasDrag';
import { createArrow } from './createArrow';
import EdgeArea from './EdgeArea';
import style from './index.module.css'
import NodeArea from './NodeArea';
import { Graph } from '../..';

function Canvas({ nodes, edges, config }: { nodes: Graph.Node[]; edges: Graph.Edge[]; config: Graph.ConfigProps }) {
  const [scaleSize, setScaleSize] = useState<number>(1)
  const canvasRef = useRef<SVGSVGElement>(null!)
  const dragRef = useRef<SVGGElement>(null!)
  

  useEffect(() => {
    createArrow(dragRef.current)
    canvasDrag(canvasRef.current, dragRef.current)
  }, [])
  return (
      <div style={{ width: '100%', height: '100%' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={style['canvas-container']}
          onWheel={(e) => {
            setScaleSize(e.deltaY < 0 ? scaleSize * 1.05 : scaleSize * 0.95)
          }}
          ref={canvasRef}
        >
          {/* 画布缩放 */}
          <g transform={`scale(${scaleSize})`}>
            {/* 画布移动 */}
            <g ref={dragRef} transform={`translate(0, 0)`}>
              <EdgeArea edges={edges} config={config}>
                <NodeArea nodes={nodes} edges={edges} config={config} />
              </EdgeArea>
              {/* <LineArea line={edge} /> */}
            </g>
          </g>
        </svg>
      </div>
  )
}

export default Canvas