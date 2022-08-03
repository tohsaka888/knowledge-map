/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-03 14:13:59
 * @Description: 请填写简介
 */
import React, { useContext, useEffect, useRef } from 'react'
import { canvasDrag } from './canvasDrag';
import EdgeArea from './EdgeArea';
import style from './index.module.css'
import NodeArea from './NodeArea';
import { Graph } from '../..';
import CustomPopover from '../CustomPopover';
import { VisibleContext } from '../context';

function Canvas({ nodes, edges, config }: { nodes: Graph.Node[]; edges: Graph.Edge[]; config: Graph.ConfigProps }) {
  const canvasRef = useRef<SVGSVGElement>(null!)
  const { setVisible } = useContext(VisibleContext)!

  useEffect(() => {
    canvasDrag(canvasRef.current, nodes, setVisible, config)
  }, [config, setVisible, config.isSelect, nodes])
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={style['canvas-container']}
        ref={canvasRef}
      >
        {/* 画布缩放 */}
        <g id="scale">
          {/* 画布移动 */}
          <g transform={`translate(0, 0)`} id="drag">
            <CustomPopover />
            <EdgeArea edges={edges} config={config}>
              <NodeArea nodes={nodes} edges={edges} config={config} />
            </EdgeArea>
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Canvas