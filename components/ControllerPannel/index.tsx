/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 13:34:39
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-04 11:14:10
 * @Description: 请填写简介
 */
import { Form, Select, Input, Button, message } from 'antd'
import React, { useContext } from 'react'
import { ConfigContext } from '../../context'
import { resetCanvas } from '../KnowledgeMap/resetCanvas'
import { downloadSvg } from '../KnowledgeMap/utils/download'
import style from './index.module.css'

function ControllerPannel() {
  const { config, dispatch } = useContext(ConfigContext)!
  return (
    <>
      <Form
        style={{ marginTop: '16px', padding: '0px 8px' }}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}>
        <Form.Item label={'显示模式'} required>
          <Select
            defaultValue={1}
            onSelect={(value: number) => {
              resetCanvas()
              dispatch({ type: 'setMode', payload: value })
            }}
            value={config.mode}
            options={[
              {
                label: '延长半径',
                value: 1
              },
              {
                label: '分页',
                value: 2
              }
            ]} />
        </Form.Item>

        <Form.Item label={"显示描述"} required>
          <Select
            value={config.showDisctription}
            options={[{ label: '是', value: true }, { label: '否', value: false }]}
            onChange={(value) => {
              dispatch({ type: 'setShowDiscription', payload: value })
            }}
          />
        </Form.Item>
        <Form.Item label={"线条样式"} required>
          <Select
            value={config.isStraight}
            options={[{ label: '直线', value: true }, { label: '曲线', value: false }]}
            onChange={(value) => {
              dispatch({ type: 'setIsStraight', payload: value })
            }}
          />
        </Form.Item>
        <Form.Item label={"线条粗细"} required>
          <Input
            placeholder="请输入"
            value={config.lineWidth}
            type='number'
            onChange={(e) => {
              dispatch({ type: 'setLineWidth', payload: +e.target.value });
            }}
          />
        </Form.Item>
        <Form.Item label={"箭头位置"} required>
          <Input
            placeholder="请输入"
            value={config.arrowPosition}
            type='number'
            onChange={(e) => {
              dispatch({ type: 'setArrowPosition', payload: +e.target.value });
            }}
          />
        </Form.Item>
        {!config.isStraight && <>
          <Form.Item label={"弯曲程度"} required>
            <Input
              placeholder="请输入"
              value={config.besselRate}
              type='number'
              onChange={(e) => {
                dispatch({ type: 'setBesselRate', payload: +e.target.value });
              }}
            />
          </Form.Item>
        </>}
        <Form.Item label={"节点半径"} required>
          <Input
            type='number'
            placeholder='请输入半径'
            value={config.nodeRadius}
            onChange={(e) => dispatch({ type: 'setNodeRadius', payload: +e.target.value })}
          />
        </Form.Item>
        <Form.Item label={"基础半径"} required>
          <Input
            type='number'
            placeholder='请输入基础半径'
            value={config.basicDistence}
            onChange={(e) => dispatch({ type: 'setBasicDistence', payload: +e.target.value })}
          />
        </Form.Item>
        {config.mode === 2 && <>
          <Form.Item label={"弧线距离"} required>
            <Input
              type='number'
              placeholder='请弧线距离'
              value={config.arcAreaDistence}
              onChange={(e) => dispatch({ type: 'setAreaDistence', payload: +e.target.value })}
            />
          </Form.Item>
          <Form.Item label={"弧线宽度"} required>
            <Input
              type='number'
              placeholder='请弧线宽度'
              value={config.arcAreaLength}
              onChange={(e) => dispatch({ type: 'setAreaLength', payload: +e.target.value })}
            />
          </Form.Item>
        </>}
      </Form>
      <div className={style['flex-center']}>
        <Button type='primary'
          onClick={() => {
            resetCanvas()
            window.setTimeout(() => {
              message.success('已复位画布')
            }, 1000)
          }}
        >
          画布复位
        </Button>
      </div>
      <div className={style['flex-center']}>
        <Button type='primary'
          onClick={() => {
            downloadSvg()
          }}
        >
          下载图片
        </Button>
      </div>
    </>
  )
}

export default ControllerPannel