import { Popover } from 'antd'
import React, { useContext, useRef } from 'react'
import { VisibleContext } from './context'
import * as d3 from 'd3'

function CustomPopover() {
  const { visible } = useContext(VisibleContext)!
  const popoverRef = useRef<SVGForeignObjectElement>(null)!

  return (
    <foreignObject id='popover-container' ref={popoverRef}>
      <Popover visible={visible} content={<>111111</>}>
      </Popover>
    </foreignObject>
  )
}

export default CustomPopover