/*
 * @Author: tohsaka888
 * @Date: 2022-08-24 16:06:02
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-24 17:09:40
 * @Description: 请填写简介
 */

import { debounce } from "lodash"
import { Graph } from "../..";
import { explore } from "./explore";
import { explorePath, exploreTimer } from "./global"

type Props = {
  typeNodes: Graph.Vertice[][];
  config: Graph.ConfigProps;
  // isInside: boolean;
  centerPoint: Graph.Vertice;
  // maxAngle: number;
  // edges: Graph.Line[],
  // fId?: string; // 父节点id
  // atanAngle?: number;
  // insideLength: number;
  // outsideLength: number;
  // nextContainer?: d3.Selection<any, any, any, any>;
  // duration: number;
  // init?: boolean
}

export const insideAutoExplore = debounce(
  ({ typeNodes, centerPoint, config }: Props) => {
    console.log(typeNodes)
    typeNodes.forEach(nodes => {
      nodes.forEach(node => {
        let currentPath = explorePath.find(path => path.mainId === node.id)
        if (currentPath) {
          explore(
            {
              mainPoint: centerPoint,
              current: node,
              isExplore: true,
              config,
              needExplore: true,
              inGraphData: currentPath.inData,
              outGraphData: currentPath.outData,
              path: currentPath
            }
          )
        }
      })
    })
  }
  , exploreTimer)

export const outsideAutoExplore = debounce(
  ({ typeNodes, centerPoint, config }: Props) => {
    // console.log(typeNodes)
    typeNodes.forEach(nodes => {
      nodes.forEach(node => {
        let currentPath = explorePath.find(path => path.mainId === node.id)
        if (currentPath) {
          explore(
            {
              mainPoint: centerPoint,
              current: node,
              isExplore: true,
              config,
              needExplore: true,
              inGraphData: currentPath.inData,
              outGraphData: currentPath.outData,
              path: currentPath
            }
          )
        }
      })
    })
  }
  , exploreTimer)

