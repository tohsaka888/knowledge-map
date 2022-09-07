/*
 * @Author: tohsaka888
 * @Date: 2022-09-06 08:28:08
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-07 09:52:43
 * @Description: 请填写简介
 */

import React, { useContext, useEffect, useRef } from 'react'
import { ConfigContext, DrawContext } from '../../context'
import { nodeMenuWidth } from '../KnowledgeMap/global'
// import { createNodeMenu } from './createNodeMenu'
import styles from './index.module.css'
import { unShowNodeMenu } from './nodeMenu'

function NodeMenu() {
  const { config } = useContext(ConfigContext)!
  const nodeMenuRef = useRef<HTMLDivElement>(null!)
  const { setDrawerShow } = useContext(DrawContext)!

  useEffect(() => {
    window.addEventListener('mouseover', () => {
      unShowNodeMenu({ config })
    })
  }, [config])

  return (
    <foreignObject style={{ overflow: 'visible' }}
      onMouseOver={(e) => {
        e.stopPropagation()
      }}
    >
      <div
        ref={nodeMenuRef}
        style={{
          width: config.nodeRadius * 2 + nodeMenuWidth * 2 + 'px',
          height: config.nodeRadius * 2 + nodeMenuWidth * 2 + 'px',
          border: `${nodeMenuWidth + 1}px solid #dec0a2`
        }}
        className={styles['node-menu']}
        id="node-menu"
        onMouseOver={(e) => {
          e.stopPropagation()
        }}
      >
        <div className={styles['icon-container']} style={{ left: config.nodeRadius - nodeMenuWidth / 2 - 3 + 'px', top: -15 + 'px' }}
          onClick={() => {
            setDrawerShow(true)
          }}
        />
        <div className={styles['icon-container']} style={{ left: config.nodeRadius - nodeMenuWidth / 2 - 3 + 'px', top: config.nodeRadius * 2 + 'px' }}
          onClick={() => {
            console.log(2)
          }}
        />
      </div>

    </foreignObject>
  )
}

export default NodeMenu
