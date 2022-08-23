/*
 * @Author: tohsaka888
 * @Date: 2022-08-23 10:17:26
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-23 11:13:03
 * @Description: 请填写简介
 */

import { Divider, Slider, Switch } from 'antd';
import React, { useContext } from 'react'
import { ConfigContext } from '../../context';
import { resetCanvas } from '../KnowledgeMap/resetCanvas';
import style from './index.module.css'

type Props = {
  type: string;
}

function PopoverContent({ type }: Props) {
  const { config, dispatch } = useContext(ConfigContext)!
  return (
    <>
      {/* 显示开关面板 */}
      {type === 'show-switch' && <>
        <div className={style['flex-between']}>
          <div className={style['label']}>概念名称</div>
          <Switch size='small' checked={config.nameVisible}
            onChange={(value) => {
              resetCanvas()
              dispatch({ type: 'setNameVisible', payload: value })
            }}
          />
        </div>
        <Divider style={{ margin: '8px 0px' }} />
        <div className={style['flex-between']}>
          <div className={style['label']}>关系名称</div>
          <Switch size='small' checked={config.showDisctription}
            onChange={(value) => {
              resetCanvas()
              dispatch({ type: 'setShowDiscription', payload: value })
            }}
          />
        </div>
      </>}

      {type === 'concept-setting' &&
        <div style={{ width: '200px' }}>
          <div className={style['label']}>概念文字大小</div>
          <Slider min={12} max={24} />
          <Divider style={{ margin: '8px 0px' }} />

          <div className={style['label']}>概念图标大小</div>
          <Slider min={5} max={50}
            value={config.nodeRadius}
            onChange={(value) => {
              resetCanvas()
              dispatch({ type: 'setNodeRadius', payload: value })
            }}
          />
          <Divider style={{ margin: '8px 0px' }} />

          <div className={style['label']}>概念之间距离</div>
          <Slider min={100} max={600}
            value={config.basicDistence}
            onChange={(value) => {
              resetCanvas()
              dispatch({ type: 'setBasicDistence', payload: value });
            }}
          />
        </div>}
    </>
  )
}

export default PopoverContent