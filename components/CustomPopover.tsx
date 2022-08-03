/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-03 11:21:06
 * @Description: 请填写简介
 */
import { Popover } from 'antd'
import React, { useContext, useRef } from 'react'
import { VisibleContext } from './context'
import * as d3 from 'd3'

function CustomPopover() {
  const { visible, setVisible } = useContext(VisibleContext)!
  const popoverRef = useRef<SVGForeignObjectElement>(null)!

  return (
    <foreignObject
      id='popover-container'
      ref={popoverRef}
      onMouseOver={(e) => {
        e.stopPropagation()
        setVisible(true)
      }}
      onMouseLeave={(e) => {
        setVisible(false)
      }}
    >
      <Popover
        id='popover'
        arrowPointAtCenter
        visible={visible}
        content={<>111111</>}
        style={{ marginTop: '38px' }}
      >
      </Popover>
    </foreignObject>
  )
}

export default CustomPopover