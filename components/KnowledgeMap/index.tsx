/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-07 10:01:11
 * @Description: 请填写简介
 */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { canvasDrag, multiDrag, normalDrag } from './canvasDrag';
import EdgeArea from './EdgeArea';
import NodeArea from './NodeArea';
import { Graph } from '../..';
import { VisibleContext } from '../context';
import { createForceGraph } from './createForceGraph';
import NodeMenu from '../NodeMenu';
import { Drawer } from 'antd';
import { DrawContext } from '../../context';

type Props = {
  nodes: Graph.Node[];
  edges: Graph.Line[];
  config: Graph.ConfigProps;
  mainVertice: Graph.Vertice;
  insideVertices: Graph.Vertice[];
  outsideVertices: Graph.Vertice[];
  children: React.ReactNode;
}

const SVGCanvas = ({ nodes, edges, config, mainVertice, insideVertices, outsideVertices, children }: Props) => {
  const canvasRef = useRef<SVGSVGElement>(null!)
  const { setVisible } = useContext(VisibleContext)!
  useEffect(() => {
    canvasDrag(canvasRef.current, setVisible)
    normalDrag(canvasRef.current)
    if (config.mode === 3) {
      // createForceGraph({ nodes, edges, config })
    }
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.shiftKey) {
        multiDrag({ config })
      }
    })

    window.addEventListener('keyup', (event) => {
      // normalDrag(canvasRef.current)
    })

    // window.addEventListener('mouseover', () => {
    // unShowNodeMenu()
    // })

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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
      id='svg'
      ref={canvasRef}
    >
      {/* 画布缩放 */}
      <g id="scale" transform={`scale(1)`}>
        {/* 画布移动 */}
        <g transform={`translate(0, 0)`} id="drag">
          {children}
          {/* <CustomPopover /> */}
          {config.mode !== 3 && <>
            <EdgeArea mainVertice={mainVertice} vertices={[mainVertice, ...insideVertices, ...outsideVertices]} edges={edges} config={config}>
              <NodeArea mainVertice={mainVertice} insideVertices={insideVertices} outsideVertices={outsideVertices} edges={edges} config={config} />
            </EdgeArea>
          </>}
        </g>
      </g>
    </svg>
  )
}

const UnMemoSVGCanvas = ({ children }: { children: React.ReactNode }) => {
  const [drawerShow, setDrawerShow] = useState<boolean>(false)
  return (
    <DrawContext.Provider value={{ drawerShow, setDrawerShow }}>
      <div style={{ width: '100%', height: '100%' }}>
        {children}
        <Drawer visible={drawerShow} onClose={() => {
          setDrawerShow(false)
        }} />
      </div>
    </DrawContext.Provider>
  )
}

const UnMemoCanvas = (props: Omit<Props, 'children'>) => {
  return (
    <UnMemoSVGCanvas>
      <SVGCanvas {...props}>
        <NodeMenu />
      </SVGCanvas>
    </UnMemoSVGCanvas>
  )
}

const Canvas = React.memo(UnMemoCanvas)

export default Canvas