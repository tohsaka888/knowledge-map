/*
 * @Author: tohsaka888
 * @Date: 2022-08-17 08:50:59
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-18 17:24:41
 * @Description: 请填写简介
 */

import { Graph } from "../../..";

type Props = {
  distance: number;
  angle: number;
  isInside: boolean;
  centerPoint: Graph.Vertice;
  atanAngle?: number;
  insideLength: number;
  outsideLength: number;
}

export const calcNodePosition = (
  {
    distance,
    angle,
    isInside,
    centerPoint,
    atanAngle = 0,
    insideLength = 0,
    outsideLength = 0
  }: Props
) => {
  const x = centerPoint.x!
  const y = centerPoint.y!
  const position: { x: number, y: number } = { x, y }

  let calcedAngle: number = (angle - 90) / 180 * Math.PI + atanAngle

  if (insideLength === 0 && outsideLength !== 0) {
    position.x = isInside
      ? x + distance * Math.cos(calcedAngle)
      : x - distance * Math.cos(calcedAngle)
    position.y = isInside
      ? y + distance * Math.sin(calcedAngle)
      : y - distance * Math.sin(calcedAngle)
  } else {
    position.x = isInside
      ? x - distance * Math.cos(calcedAngle)
      : x + distance * Math.cos(calcedAngle)
    position.y = isInside
      ? y - distance * Math.sin(calcedAngle)
      : y + distance * Math.sin(calcedAngle)
  }
  return position
}
