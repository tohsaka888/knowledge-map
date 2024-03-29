/*
 * @Author: tohsaka888
 * @Date: 2022-08-23 08:35:52
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-30 15:56:50
 * @Description: 请填写简介
 */

import { Divider, Input, message, Popover, Tooltip } from 'antd'
import React, { useContext, useState } from 'react'
import style from './index.module.css'
import { BsSearch, BsSnow, BsFillGeoAltFill, BsFullscreen, BsGearWideConnected, BsGrid1X2, BsFonts, BsShare, BsUpload, BsFillInfoCircleFill } from 'react-icons/bs'
import { ConfigContext } from '../../context'
import { downloadSvg } from '../KnowledgeMap/utils/download'
import { resetCanvas } from '../KnowledgeMap/resetCanvas'
import PopoverContent from './PopoverContent'
import { debounce } from 'lodash'

const alert = debounce(() => {
  resetCanvas(false)
  message.success('已复位画布')
}, 1000)

function BottomController() {

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const { config, dispatch } = useContext(ConfigContext)!
  const [maskVisible, setMaskVisible] = useState<boolean>(false)

  return (
    <div className={style['bottom-container']}>
      <div style={{ position: 'fixed', width: '100vw', height: '100vh', display: maskVisible ? 'block' : 'none' }}></div>
      <Input
        placeholder='请输入节点名称搜索'
        addonAfter={null}
        style={{ maxWidth: '300px', color: '#fff' }}
        className={style['search-container']}
        suffix={<BsSearch color={'#fff'} />}
      />
      {/* 重绘 */}
      <div className={style['button-container']}>
        <Tooltip placement="top" trigger={'hover'} title="重绘">
          <div className={style['button-background']}
            onClick={() => {
              resetCanvas()
              dispatch({ type: 'reset', payload: undefined })
            }}
          >
            <BsSnow color='#fff' size={18} />
          </div>
        </Tooltip>
      </div>
      {/* 复位画布 */}
      <div className={style['button-container']}>
        <Tooltip placement="top" trigger={'hover'} title="原比例居中">
          <div className={style['button-background']}
            onClick={() => {
              alert()
            }}
          >
            <BsFillGeoAltFill color='#fff' size={15} />
          </div>
        </Tooltip>
      </div>
      <div className={style['button-container']}>
        <Tooltip placement="top" trigger={'hover'} title="全屏">
          <div className={style['button-background']}
            onClick={() => {
              if (!isFullScreen) {
                document.documentElement.requestFullscreen()
              } else {
                document.exitFullscreen()
              }
              setIsFullScreen(!isFullScreen)
            }}
          >
            <BsFullscreen color='#fff' size={15} />
          </div>
        </Tooltip>
      </div>

      <Divider type={'vertical'} style={{ background: '#cecece', fontSize: '24px' }} />

      <div className={style['button-container']}>
        <Popover trigger={'click'} title="显示开关" content={<PopoverContent type='show-switch' />}
          onVisibleChange={(visible) => {
            setMaskVisible(visible)
          }}
        >
          <Tooltip placement="top" trigger={'hover'} title="显示开关">
            <div className={style['button-background']}>
              <BsGearWideConnected color='#fff' size={16} />
            </div>
          </Tooltip>
        </Popover>
      </div>
      <div className={style['button-container']}>
        <Popover trigger={'click'} title="概念设置" content={<PopoverContent type='concept-setting' />}
          onVisibleChange={(visible) => {
            setMaskVisible(visible)
          }}
        >
          <Tooltip placement="top" trigger={'hover'} title="概念设置">
            <div className={style['button-background']}>
              <BsFonts color='#fff' size={16} />
            </div>
          </Tooltip>
        </Popover>
      </div>
      <div className={style['button-container']}>
        <Popover trigger={'click'} title="关系设置" content={<PopoverContent type='relation-setting' />}
          onVisibleChange={(visible) => {
            setMaskVisible(visible)
          }}
        >
          <Tooltip placement="top" trigger={'hover'} title="关系配置">
            <div className={style['button-background']}>
              <BsShare color='#fff' size={16} />
            </div>
          </Tooltip>
        </Popover>
      </div>
      <div className={style['button-container']}>
        <Popover trigger={'click'} title="布局设置" content={<PopoverContent type='layout-setting' />}
          onVisibleChange={(visible) => {
            setMaskVisible(visible)
          }}
        >
          <Tooltip placement="top" trigger={'hover'} title="布局配置">
            <div className={style['button-background']}>
              <BsGrid1X2 color='#fff' size={16} />
            </div>
          </Tooltip>
        </Popover>
      </div>

      <Divider type={'vertical'} style={{ background: '#cecece', fontSize: '24px' }} />
      {/* 导出图片 */}
      <div className={style['button-container']}>
        <Tooltip placement="top" trigger={'hover'} title="导出图片">
          <div className={style['button-background']}
            onClick={() => {
              downloadSvg()
            }}
          >
            <BsUpload color='#fff' size={16} />
          </div>
        </Tooltip>
      </div>
      <div className={style['button-container']}>
        <Tooltip placement="top" trigger={'hover'} title="帮助">
          <div className={style['button-background']}>
            <BsFillInfoCircleFill color='#fff' size={16} />
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

export default BottomController