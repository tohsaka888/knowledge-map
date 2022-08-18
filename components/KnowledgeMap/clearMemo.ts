/*
 * @Author: tohsaka888
 * @Date: 2022-08-18 15:13:41
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-18 15:24:40
 * @Description: 请填写简介
 */
import { globalEdges, globalNodes } from "./global"

type Props = {
  nodeId: string
}

export const clearMemo = ({ nodeId }: Props) => {
  const nodeIndex = globalNodes.findIndex(gN => gN.id === nodeId)
  if (nodeIndex !== -1) {
    globalNodes.splice(nodeIndex, 1)
  }

  // const edgeIndex = globalEdges.findIndex(gE => gE.fromVertexId === nodeId)
}
