/*
 * @Author: tohsaka888
 * @Date: 2022-08-17 08:50:59
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-17 14:57:44
 * @Description: 请填写简介
 */

import { Graph } from "../../..";

type Props = {
  distance: number;
  angle: number;
  isInside: boolean;
  centerPoint: Graph.Vertice;
  atanAngle?: number;
}

export const calcNodePosition = ({ distance, angle, isInside, centerPoint, atanAngle = 0 }: Props) => {
  const x = centerPoint.x!
  const y = centerPoint.y!
  const position: { x: number, y: number } = { x, y }
  position.x = isInside
    ? x - distance * Math.cos((angle - 90) / 180 * Math.PI + atanAngle)
    : x + distance * Math.cos((angle - 90) / 180 * Math.PI + atanAngle)
  position.y = isInside
    ? y + distance * Math.sin((angle - 90) / 180 * Math.PI + atanAngle)
    : y + distance * Math.sin((angle - 90) / 180 * Math.PI + atanAngle)
  return position
}
