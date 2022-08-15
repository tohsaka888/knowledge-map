/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-15 13:31:57
 * @Description: 请填写简介
 */
import React, { useContext, useEffect, useRef } from 'react'
import { canvasDrag, multiDrag, normalDrag } from './canvasDrag';
import EdgeArea from './EdgeArea';
import style from './index.module.css'
import NodeArea from './NodeArea';
import { Graph } from '../..';
import CustomPopover from '../CustomPopover';
import { VisibleContext } from '../context';
import { createForceGraph } from './createForceGraph';

function Canvas({ nodes, edges, config }: { nodes: Graph.Node[]; edges: Graph.Edge[]; config: Graph.ConfigProps }) {
  const canvasRef = useRef<SVGSVGElement>(null!)
  const { setVisible } = useContext(VisibleContext)!

  useEffect(() => {
    canvasDrag(canvasRef.current, nodes, edges, setVisible, config)
    normalDrag(canvasRef.current)
    if (config.mode === 3) {
      createForceGraph({ nodes, edges, config })
    }
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.shiftKey) {
        multiDrag(canvasRef.current, nodes, edges, config)
      }
    })

    window.addEventListener('keyup', (event) => {
      normalDrag(canvasRef.current)
    })

    return () => {
      window.removeEventListener('keydown', () => {
        console.log('remove')
      })
      window.removeEventListener('keyup', () => {
        console.log('remove')
      })
    }
  }, [config, setVisible, nodes, edges])
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={style['canvas-container']}
        id='svg'
        ref={canvasRef}
      >
        {/* 画布缩放 */}
        <g id="scale">
          {/* 画布移动 */}
          <g transform={`translate(0, 0)`} id="drag">
            <CustomPopover />
            {config.mode !== 3 && <>
              <EdgeArea nodes={nodes} edges={edges} config={config}>
                <NodeArea nodes={nodes} edges={edges} config={config} />
              </EdgeArea>
            </>}
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Canvas