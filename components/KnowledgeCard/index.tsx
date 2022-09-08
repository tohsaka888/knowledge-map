/*
 * @Author: tohsaka888
 * @Date: 2022-09-08 08:22:00
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-08 09:53:47
 * @Description: 请填写简介
 */

import { Tag } from 'antd'
import React, { useContext } from 'react'
import { currentNode } from '../NodeMenu/nodeMenu'
import styles from './index.module.css'
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai'
import { DrawContext } from '../../context'
import BasicInfo from './BasicInfo'
import ModelPropertyList from './ModelPropertyList'

function KnowledgeCard() {
  console.log(currentNode.node)
  const { setDrawerShow } = useContext(DrawContext)!
  return (
    <div className={styles['card-container']}>
      <div className={styles['flex-align-center']} style={{ justifyContent: 'space-between' }}>
        <div className={styles['flex-align-center']}>
          <div className={styles['card-title']}>{currentNode.node?.name || ''}</div>
          <Tag color="green">{currentNode.node?.labelName || ''}</Tag>
        </div>
        <AiOutlineClose size={20} style={{ cursor: 'pointer' }}
          onClick={() => setDrawerShow(false)}
        />
      </div>

      {currentNode.node?.propertyMap.dkg_sys_tags?.map(tag => {
        return <Tag color="cyan" key={tag} style={{ marginTop: '8px' }}>{tag}</Tag>
      })}

      <BasicInfo />
      <ModelPropertyList />
    </div>
  )
}

export default KnowledgeCard