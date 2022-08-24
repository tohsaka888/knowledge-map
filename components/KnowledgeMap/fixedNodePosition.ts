/*
 * @Author: tohsaka888
 * @Date: 2022-08-18 08:32:54
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-24 08:23:47
 * @Description: 请填写简介
 */

import { Graph } from "../.."
import * as d3 from 'd3'
import { translate } from "./canvasDrag";
import { exploreTimer, isReset } from "./global";

type Props = {
  node: Graph.Vertice;
  x: number;
  y: number;
}

export const fixedNodePosition = ({ node, x, y }: Props) => {
  const offsetX = x - node.x! + translate.x;
  const offsetY = y - node.y! + translate.y
  d3.select('#drag')
    .transition()
    .duration(isReset ? exploreTimer : 1000)
    .attr('transform', `translate(${offsetX}, ${offsetY})`)
  translate.x = offsetX
  translate.y = offsetY
}
