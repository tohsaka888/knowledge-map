/*
 * @Author: tohsaka888
 * @Date: 2022-08-17 16:58:47
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-17 17:12:39
 * @Description: 请填写简介
 */

import { Graph } from "../.."
import * as d3 from 'd3'
import { translate } from "./canvasDrag"

type Props = {
  node: Graph.Vertice
}

export const moveNodeToCenter = ({ node }: Props) => {

  const canvas = document.getElementById('svg')
  const centerX = canvas?.getBoundingClientRect().width! / 2
  const centerY = canvas?.getBoundingClientRect().height! / 2
  const offsetX = centerX - node.x!
  const offsetY = centerY - node.y!
  d3.select('#drag')
    .transition()
    .duration(1000)
    .attr('transform', `translate(${offsetX}, ${offsetY})`)
  translate.x = offsetX
  translate.y = offsetY
}