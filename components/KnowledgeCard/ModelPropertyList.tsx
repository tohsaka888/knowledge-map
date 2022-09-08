/*
 * @Author: tohsaka888
 * @Date: 2022-09-08 09:52:32
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-08 09:53:35
 * @Description: 请填写简介
 */

import React, { useState } from 'react'
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai'
import styles from './index.module.css'

function ModelPropertyList() {
  const [isShow, setIsShow] = useState<boolean>(true)
  return (
    <>
      <div className={styles['flex-align-center']} style={{ justifyContent: 'space-between', marginTop: '16px' }}>
        <div className={styles['card-part-title']}>
          模型属性列表
        </div>
        {!isShow
          ? <AiOutlineRight size={20} style={{ cursor: 'pointer' }}
            onClick={() => {
              setIsShow(!isShow)
            }}
          />
          : <AiOutlineDown size={20} style={{ cursor: 'pointer' }}
            onClick={() => {
              setIsShow(!isShow)
            }}
          />}
      </div>

      <div style={{ display: isShow ? 'block' : 'none' }}>
        <div className={styles['basic-info-col']}>
          模型名称:
        </div>
        <div className={styles['basic-info-col']}>
          标签:
        </div>
        <div className={styles['basic-info-col']}>
          责任人:
        </div>
        <div className={styles['basic-info-col']}>
          模型描述:
        </div>
        <div className={styles['basic-info-col']}>
          业务编码:
        </div>
      </div>
    </>
  )
}

export default ModelPropertyList
