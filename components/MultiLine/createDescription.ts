/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 10:30:53
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-16 10:44:52
 * @Description: 请填写简介
 */

import { Graph } from "../..";
import * as d3 from 'd3'

type Props = {
  edgeId: string;
  edge: Graph.Edge;
  container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
}

export const createDescription = ({ edgeId, edge, container }: Props) => {
  container.append('text')
    .append('textPath')
    .attr('id', edgeId + 'description')
    .attr('href', '#' + edgeId)
    .text(edge.discription)
    .attr('fill', '#999999')
    .attr('startOffset', '50%')
    .attr('dominant-baseline', 'text-after-edge')
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
  container.append('text')
    .append('textPath')
    .attr('id', edgeId + 'description')
    .attr('href', '#' + edgeId)
    .attr('fill', '#999999')
    .attr('startOffset', '50%')
    .attr('dominant-baseline', 'central')
    .attr('text-anchor', 'middle')
    .append('tspan')
    .text('▸')
    .attr('font-size', 18)
    .style('font-family', "Times New Roman")
}
