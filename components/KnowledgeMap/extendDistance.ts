/*
 * @Author: tohsaka888
 * @Date: 2022-08-18 10:08:24
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-18 10:36:46
 * @Description: 请填写简介
 */

import { Graph } from "../..";

type Props = {
  node: Graph.Vertice;
  mainPoint: Graph.Vertice;
  isInside: boolean;
  size: number;
  isExplore: boolean;
  config: Graph.ConfigProps;
}

export const extendDistance = ({ node, mainPoint, isInside, size, isExplore, config }: Props) => {
  const distance = Math.sqrt(Math.pow((node.x! - mainPoint.x!), 2) + Math.pow((node.y! - mainPoint.y!), 2)) + (isExplore ? size : -size) * config.basicDistence
  const angle = Math.atan2(node.y! - mainPoint.y!, node.x! - mainPoint.x!);

  const position: { x: number, y: number } = { x: 0, y: 0 }
  const x = mainPoint.x!
  const y = mainPoint.y!
  position.x = isInside
    ? x + distance * Math.cos(angle)
    : x + distance * Math.cos(angle)
  position.y = isInside
    ? y + distance * Math.sin(angle)
    : y + distance * Math.sin(angle)
  return position
}
