/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 08:30:23
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 09:25:13
 * @Description: 请填写简介
 */

import { Menu } from 'antd'
import React, { useCallback, useRef, useState } from 'react'
import { moveNodeToCenter } from '../KnowledgeMap/moveNodeToCenter'
import style from './index.module.css'
import { currentNode } from './rightMenu'

const menuItems = [
  { label: '测试选项1', key: '1' },
  { label: '测试选项2', key: '2' },
  { label: '当前实体居中', key: '3' },
  { label: '测试选项4', key: '4' },
]

function RightMenu() {
  const rightMenuRef = useRef<HTMLDivElement>(null!)
  const [selectedKey, setSelectedKey] = useState<string>('')

  const clearRightMenu = useCallback(() => {
    // 点击清除右侧菜单
    rightMenuRef.current.style.display = 'none'
    setSelectedKey('')
  }, [])

  return (
    <div className={style['right-menu-container']} id="right-menu"
      ref={rightMenuRef}
      onClick={(e) => {
        clearRightMenu()
      }}
    >
      <div className={style['right-menu-content']} id="right-menu-content">
        <Menu items={menuItems} style={{ background: 'transparent' }} theme={'dark'}
          selectedKeys={[selectedKey]}
          onClick={(props) => {
            props.domEvent.stopPropagation()
            setSelectedKey(props.key)
            if (props.key === '3') {
              moveNodeToCenter({ node: currentNode.node })
              clearRightMenu()
            }
          }}
        />
      </div>
    </div>
  )
}

export default RightMenu
