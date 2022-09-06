/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 08:37:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-06 13:55:28
 * @Description: 请填写简介
 */

import { MouseEvent } from "react"
import * as d3 from "d3"
import { Graph } from "../..";
import { nodeMenuWidth } from "../KnowledgeMap/global";
import { debounce, throttle } from "lodash";

type Props = {
  e: MouseEvent;
  node: Graph.Vertice;
  config: Graph.ConfigProps;
  // isShow: boolean;
}

export const currentNode: { node: Graph.Vertice } = { node: null! }

export const isShowNodeMenu = ({ e, node, config }: Props) => {
  const x = node.x! - config.nodeRadius - nodeMenuWidth
  const y = node.y! - config.nodeRadius - nodeMenuWidth
  e.preventDefault();
  // 显示菜单
  d3.select('#node-menu')
    .style('transform', `translate3d(${x}px, ${y}px, 0)`)
    .style('display', 'block')
  currentNode.node = node;
}

export const unShowNodeMenu = debounce(() => {
  d3.select('#node-menu').style('display', 'none')
}, 0, { leading: true })

export const debounceIsShowNodeMenu = debounce(isShowNodeMenu, 0, { leading: true })