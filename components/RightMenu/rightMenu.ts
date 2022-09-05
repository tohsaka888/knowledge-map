/*
 * @Author: tohsaka888
 * @Date: 2022-09-05 08:37:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-05 09:18:34
 * @Description: 请填写简介
 */

import { MouseEvent } from "react"
import * as d3 from "d3"
import { Graph } from "../..";

type Props = {
  e: MouseEvent;
  node: Graph.Vertice;
}

export const currentNode: { node: Graph.Vertice } = { node: null! }

export const rightMenuClick = ({ e, node }: Props) => {
  if (e.button === 2) {
    document.oncontextmenu = () => {
      return false;
    };
    e.preventDefault();
    // 显示菜单
    d3.select('#right-menu')
      .style('display', 'block')
      .select('#right-menu-content')
      .style('transform', `translate3d(${e.clientX}px, ${e.clientY}px, 0)`)
    currentNode.node = node;
  }
}