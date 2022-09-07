/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 08:37:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-07 09:32:31
 * @Description: 请填写简介
 */

import { MouseEvent } from "react"
import * as d3 from "d3"
import { Graph } from "../..";
import { fontMargin, nodeMenuWidth, setFontMargin } from "../KnowledgeMap/global";
import { debounce } from "lodash";
import { verticePrefix } from "../KnowledgeMap/prefix";

export let delay = 0

export const setDelay = (mydelay: number) => {
  delay = mydelay;
}

type Props = {
  e: MouseEvent;
  node: Graph.Vertice;
  config: Graph.ConfigProps;
  // isShow: boolean;
  delay: number;
}

export const currentNode: { node: Graph.Vertice } = { node: null! }

export const isShowNodeMenu = ({ e, node, config }: Props) => {
  window.setTimeout(() => {
    setFontMargin(10)
    d3.select(`#${verticePrefix + node.id}name`)
      .attr('y', node.y! + config.nodeRadius + config.nameSize + fontMargin)
    const x = node.x! - config.nodeRadius - nodeMenuWidth
    const y = node.y! - config.nodeRadius - nodeMenuWidth
    e.preventDefault();
    // 显示菜单
    d3.select('#node-menu')
      .style('transform', `translate3d(${x}px, ${y}px, 0)`)
      .style('display', 'block')
    currentNode.node = node;
  }, delay)
}

type UnShowProps = {
  node?: Graph.Vertice;
  config: Graph.ConfigProps;
  // isShow: boolean;
}

export const unShowNodeMenu = debounce(({ node, config }: UnShowProps) => {
  setFontMargin(0)
  if (currentNode.node) {
    d3.select(`#${verticePrefix + currentNode.node.id}name`)
      .attr('y', currentNode.node.y! + config.nodeRadius + config.nameSize)
  }
  d3.select('#node-menu').style('display', 'none')
}, 0, { leading: true })

export const debounceIsShowNodeMenu = debounce(isShowNodeMenu, 0, { leading: true })