/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 15:53:09
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-17 17:14:03
 * @Description: 请填写简介
 */

import * as d3 from 'd3'
import { Graph } from '../..';
import { explore } from './explore';
import { verticePrefix } from './prefix';
import { transferLabelName } from './utils/transferLabelName';
type Props = {
  container: d3.Selection<any, any, any, any>;
  config: Graph.ConfigProps;
  vertice: Graph.Vertice;
}

export const createNode = (
  {
    container,
    config,
    vertice
  }: Props
) => {
  const { nodeRadius } = config
  vertice.p = []
  container
    .append('circle')
    .attr('r', nodeRadius)
    .attr('cx', vertice.x!)
    .attr('cy', vertice.y!)
    .attr('fill', '#1890ff')
    .style('cursor', 'pointer')
    .attr('id', verticePrefix + vertice.id || '')
  container
    .append('text')
    .attr('x', vertice.x!)
    .attr('y', vertice.y!)
    .attr('id', verticePrefix + vertice.id + 'text')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('fill', '#fff')
    .style('font-size', 12)
    .text(transferLabelName(vertice.labelName) || '')
  container
    .append('text')
    .attr('x', vertice.x!)
    .attr('y', vertice.y! + nodeRadius + 10)
    .attr('id', verticePrefix + vertice.id + 'name')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', 10)
    .text(vertice.name || '')
}

type SideProps = {
  container: d3.Selection<any, any, any, any>;
  config: Graph.ConfigProps;
  vertice: Graph.Vertice;
  mainVertice: Graph.Vertice;
  edges: Graph.Line[]
}

export const createSideNode = (
  {
    container,
    config,
    vertice,
    mainVertice,
    edges
  }: SideProps
) => {
  const { nodeRadius } = config
  let isExplore = false
  // 探索
  container.on('click', (e) => {
    e.stopPropagation()
    isExplore = !isExplore
    explore({ current: vertice, isExplore, config, mainPoint: mainVertice, edges });
  })

  container
    .append('circle')
    .attr('r', nodeRadius)
    .attr('cx', mainVertice.x!)
    .attr('cy', mainVertice.y!)
    .attr('fill', '#1890ff')
    .style('cursor', 'pointer')
    .attr('id', verticePrefix + vertice.id || '')
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .attr('cx', vertice.x!)
    .attr('cy', vertice.y!)
    .style('opacity', 1)
  container
    .append('text')
    .attr('x', mainVertice.x!)
    .attr('y', mainVertice.y!)
    .attr('id', verticePrefix + vertice.id + 'text')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('fill', '#fff')
    .style('font-size', 12)
    .text(transferLabelName(vertice.labelName) || '')
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .attr('x', vertice.x!)
    .attr('y', vertice.y!)
    .style('opacity', 1)
  container
    .append('text')
    .attr('x', mainVertice.x!)
    .attr('y', mainVertice.y! + nodeRadius + 10)
    .attr('id', verticePrefix + vertice.id + 'name')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', 10)
    .text(vertice.name || '')
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .attr('x', vertice.x!)
    .attr('y', vertice.y! + nodeRadius + 10)
    .style('opacity', 1)
}
