/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 11:36:12
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-16 11:55:25
 * @Description: 请填写简介
 */

import { Graph } from "../..";

type Props = {
  edgeArea: d3.Selection<any, any, any, any>;
  config: Graph.ConfigProps;
  edge: Graph.Edge;
  edgeId: string;
}

/**
 * 描述 创建描述及箭头
 * @date 2022-08-16
 * @param {any} {edge
 * @param {any} edgeArea
 * @param {any} config
 * @param {any} edgeId}:Props
 * @returns {any}
 */
export const createDescription = ({ edge, edgeArea, config, edgeId }: Props) => {
  if (config.showDisctription) {
    edgeArea
      .append('text')
      .attr('id', edgeId + 'description')
      .append('textPath')
      .style('opacity', 0)
      .attr('text-anchor', 'center')
      .attr('href', `#${edgeId}`)
      .classed('discription', true)
      .attr('fill', '#999999')
      .attr('font-size', 12)
      .attr('dominant-baseline', 'text-after-edge')
      .attr('startOffset', '50%')
      .attr('dy', 20)
      .text(edge.discription)
      .transition()
      .duration(1000)
      .style('opacity', 1)
  }
  edgeArea
    .append('text')
    .attr('id', edgeId + 'icon')
    .append('textPath')
    .attr('text-anchor', 'center')
    .attr('href', `#${edgeId}`)
    .classed('discription-icon', true)
    .attr('fill', '#999999')
    .attr('font-size', 12)
    .attr('dominant-baseline', 'central')
    .style('font-family', 'Times New Roman')
    .attr('startOffset', `${config.arrowPosition}%`)
    .append('tspan')
    .attr('dx', 0)
    .attr('dy', 0.1)
    .text(`\u25B8`)
    .style('font-size', 18)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 1)
}
