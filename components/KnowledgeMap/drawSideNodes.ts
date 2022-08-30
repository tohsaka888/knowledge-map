/**
 * 描述 创建入边出边节点
 * @date 2022-07-21
 * @param {any} typeNodes:Graph.Node[][]
 * @param {any} config:Graph.ConfigProps
 * @param {any} container:SVGGElement
 * @param {any} maxAngle:number
 * @param {any} x:number
 * @param {any} y:number
 * @param {any} edges:Graph.Edge[]
 * @param {any} isInside:boolean
 * @returns {any}
 */

import { Graph } from "../.."
import { calcMode } from "./utils/calcMode";
import * as d3 from 'd3'
import { fPrefix, verticePrefix } from "./prefix";
import { normalLayout } from "./layouts/normal/normalLayout";
import { paginationLayout } from "./layouts/pagination/paginationLayout";
import { globalNodes, isReset } from "./global";
import { insideAutoExplore, outsideAutoExplore } from "./autoExplore";

type Props = {
  typeNodes: Graph.Vertice[][];
  config: Graph.ConfigProps;
  isInside: boolean;
  centerPoint: Graph.Vertice;
  maxAngle: number;
  edges: Graph.Line[],
  fId?: string; // 父节点id
  atanAngle?: number;
  insideLength: number;
  outsideLength: number;
  nextContainer?: d3.Selection<any, any, any, any>;
  duration: number;
  init?: boolean
}

export const drawSideNodes = (
  {
    typeNodes,
    config,
    isInside,
    centerPoint,
    maxAngle,
    edges,
    fId,
    atanAngle = 0,
    insideLength,
    outsideLength,
    nextContainer,
    duration,
  }: Props
) => {
  const container = d3.select('#node-area')
  const { mode } = config

  if (isReset) {
    if (isInside) {
      setTimeout(() => {
        insideAutoExplore({ typeNodes, config, centerPoint })
      })
    } else {
      setTimeout(() => {
        outsideAutoExplore({ typeNodes, config, centerPoint })
      })
    }
  }
  typeNodes.forEach((originNodes, index) => {
    // const nodes = calcMode(originNodes, 1, mode)
    const filteredNodes = originNodes.filter(node => {
      return !globalNodes.find(gN => {
        return gN.id === node.id
      })
    })
    const nodes = calcMode(filteredNodes, 1, config)

    // 判断会和父节点连线
    const needRotate = filteredNodes.length !== originNodes.length

    originNodes.forEach((node) => {
      if (node.needRotate === undefined) {
        node.needRotate = needRotate
      }
    })

    const parent = [fId!, ...centerPoint.p!]
    const parentClass = parent.map(p => verticePrefix + p).join(' ')

    const typeContainer = nextContainer ? nextContainer : container
      .append('g')
      .classed(nodes.length > 0 && nodes[0].labelName || '', true)
      .classed(parentClass || '', true)
      .attr('id', fPrefix + fId)

    if (config.mode === 1) {
      normalLayout(
        {
          nodes,
          maxAngle,
          index,
          typeContainer,
          parent,
          atanAngle,
          isInside,
          insideLength,
          outsideLength,
          edges,
          config,
          centerPoint,
          duration
        }
      )
    } else if (config.mode === 2) {
      paginationLayout({
        nodes,
        maxAngle,
        index,
        typeContainer,
        parent,
        atanAngle,
        isInside,
        insideLength,
        outsideLength,
        edges,
        config,
        centerPoint,
        originNodes: filteredNodes,
        parentClass,
      })
      normalLayout(
        {
          nodes,
          maxAngle,
          index,
          typeContainer,
          parent,
          atanAngle,
          isInside,
          insideLength,
          outsideLength,
          edges,
          config,
          centerPoint,
          duration
        }
      )
    }
  })
}