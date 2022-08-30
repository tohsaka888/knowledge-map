/*
 * @Author: tohsaka888
 * @Date: 2022-08-19 10:46:57
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-30 16:21:43
 * @Description: 请填写简介
 */

import * as d3 from "d3"
import config from "next/config"
import { Graph } from "../../../.."
import { createSideNode } from "../../createNode"
import { verticePrefix } from "../../prefix"
import { calcBasicDistence } from "../../utils/calcBasicDistance"
import { calcNodePosition } from "../../utils/calcNodePosition"

type Props = {
  nodes: Graph.Vertice[];
  maxAngle: number;
  index: number;
  typeContainer: d3.Selection<any, any, any, any>;
  parent: string[];
  isInside: boolean;
  centerPoint: Graph.Vertice;
  atanAngle: number;
  insideLength: number;
  outsideLength: number;
  config: Graph.ConfigProps;
  edges: Graph.Line[];
  duration: number;
}

export const normalLayout = (
  {
    nodes,
    maxAngle,
    index,
    typeContainer,
    parent,
    isInside,
    centerPoint,
    atanAngle,
    insideLength,
    outsideLength,
    edges,
    config,
    duration
  }: Props
) => {
  let idx = 0
  nodes.forEach((node) => {
    node.p = parent
    // if (document.getElementById(verticePrefix + node.id) === null) {
      // document.getElementById(verticePrefix + node.id)?.parentElement?.remove()
      // 记录节点信息
      node.angle = (idx + (node.needRotate ? 0.75 : 1)) * maxAngle / (nodes.length + 1) + index * maxAngle
      node.distance = calcBasicDistence(nodes.length, maxAngle, config.basicDistence)
      node.isInside = isInside
      const position = calcNodePosition(
        {
          distance: node.distance,
          angle: node.angle,
          centerPoint,
          isInside: node.isInside,
          atanAngle,
          insideLength,
          outsideLength
        }
      )
      node.x = position.x
      node.y = position.y

      const sideContainer = typeContainer.append('g')
      createSideNode({ container: sideContainer, vertice: node, mainVertice: centerPoint, config, edges, duration })

      idx++
    // }
  })
}
