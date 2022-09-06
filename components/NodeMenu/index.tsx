/*
 * @Author: tohsaka888
 * @Date: 2022-09-06 08:28:08
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-06 13:52:56
 * @Description: 请填写简介
 */

import React, { useContext, useEffect, useRef } from 'react'
import { ConfigContext } from '../../context'
import { nodeMenuWidth } from '../KnowledgeMap/global'
// import { createNodeMenu } from './createNodeMenu'
import styles from './index.module.css'
import { unShowNodeMenu } from './nodeMenu'

function NodeMenu() {
  const { config } = useContext(ConfigContext)!
  const nodeMenuRef = useRef<HTMLDivElement>(null!)

  return (
    <foreignObject style={{ overflow: 'visible' }}>
      <div
        ref={nodeMenuRef}
        style={{
          width: config.nodeRadius * 2 + nodeMenuWidth * 2 + 'px',
          height: config.nodeRadius * 2 + nodeMenuWidth * 2 + 'px',
          border: `${nodeMenuWidth + 1}px solid #dec0a2`
        }}
        className={styles['node-menu']}
        id="node-menu"
        onMouseLeave={() => {
          unShowNodeMenu()
        }}
      >
        <div className={styles['icon-container']} style={{ left: config.nodeRadius - nodeMenuWidth / 2 - 3 + 'px', top: -15 + 'px' }}></div>
        <div className={styles['icon-container']} style={{ left: config.nodeRadius - nodeMenuWidth / 2 - 3 + 'px', top: config.nodeRadius * 2 + 'px' }}></div>
      </div>

    </foreignObject>
  )
}

export default NodeMenu
