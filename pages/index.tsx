import { Button, Form, Input, Layout, message, Select } from 'antd'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useReducer, useRef, useState } from 'react'
import { Graph } from '..'
import Canvas from '../components/KnowledgeMap/index'
import { baseUrl } from '../config/baseUrl'
import useScreenSize from '../hooks/useScreenSize'
import { nodeRadius, basicDistence, arcAreaLength, arcAreaDistence, mode } from '../components/KnowledgeMap/defaultConfig'
import { ConfigContext } from '../context'
import style from '../styles/home.module.css'
import { resetCanvas } from '../components/KnowledgeMap/resetCanvas'
import { VisibleContext } from '../components/context'
import CustomPopover from '../components/CustomPopover'

const initState = {
  nodeRadius,
  basicDistence,
  arcAreaDistence,
  arcAreaLength,
  mode
}

const reducer = (state: typeof initState, action: Graph.ActionType) => {
  switch (action.type) {
    case 'setMode':
      return { ...state, mode: action.payload }
    case 'setAreaLength':
      return { ...state, arcAreaLength: action.payload }
    case 'setAreaDistence':
      return { ...state, arcAreaDistence: action.payload }
    case 'setNodeRadius':
      return { ...state, nodeRadius: action.payload }
    case 'setBasicDistence':
      return { ...state, basicDistence: action.payload }
  }
}

const Home: NextPage<{ data: { nodes: Graph.Node[]; edges: Graph.Edge[]; } }> = ({ data }) => {
  const { height } = useScreenSize()
  const [config, dispatch] = useReducer(reducer, initState)
  const [visible, setVisible] = useState<boolean>(false)
  return (
    <>
      <Head>
        <title>知识图谱</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Layout>
          <Layout.Header>
            <h1 style={{ color: '#fff' }}>知识图谱Demo</h1>
          </Layout.Header>
          <Layout style={{ minHeight: height - 70 }}>
            <ConfigContext.Provider value={{ config, dispatch }}>
              <Layout.Sider theme={'light'} style={{ minHeight: '90vh' }}>
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
              </Layout.Sider>
              <Layout.Content style={{ height: height - 70 }}>
                <VisibleContext.Provider value={{ visible, setVisible }}>
                  <Canvas nodes={data.nodes} edges={data.edges} config={config} />
                </VisibleContext.Provider>
              </Layout.Content>
            </ConfigContext.Provider>
          </Layout>
        </Layout>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${baseUrl}/api/graph`)
  const data: Api.GraphResponse = await res.json()
  return {
    props: {
      data: data.data
    },
  }
}

export default Home
