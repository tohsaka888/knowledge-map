/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 15:53:09
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-09-07 09:20:55
 * @Description: 请填写简介
 */

import * as d3 from 'd3'
import { throttle } from 'lodash';
import { Graph } from '../..';
import { debounceIsShowNodeMenu, isShowNodeMenu, setDelay, unShowNodeMenu } from '../NodeMenu/nodeMenu';
import { rightMenuClick } from '../RightMenu/rightMenu';
import { explore } from './explore';
import { changeInitDraw, changeIsReset, explorePath, exploreTimer, fontMargin, globalNodes, initDraw, isReset } from './global';
import { dragEnd, dragging, dragStart } from './nodeDrag';
import { verticePrefix } from './prefix';
import { canExplore } from './utils/test/canExplore';
import { transferLabelName } from './utils/transferLabelName';
type Props = {
  container: d3.Selection<any, any, any, any>;
  config: Graph.ConfigProps;
  vertice: Graph.Vertice;
  edges: Graph.Line[]
}

export const createNode = (
  {
    container,
    config,
    vertice,
    edges
  }: Props
) => {
  const { nodeRadius } = config
  vertice.p = []
  const memoNode = globalNodes.find(v => v.id === vertice.id)
  if (!memoNode) {
    globalNodes.push(vertice)
  }
  container
    .on('mousedown', (e: any) => {
      rightMenuClick({ e, node: vertice })
    })
    .call(
      d3.drag<any, any>()
        .on('start', function (event) {
          dragStart({ current: this, event, node: vertice, config, edges })
        })
        .on('drag', function (event) {
          dragging({ current: this, event, node: vertice, config, edges })
        })
        .on('end', function (event) {
          dragEnd({ current: this, event, node: vertice, config, edges })
        })
    )
  container
    .append('circle')
    .attr('r', nodeRadius)
    .attr('cx', vertice.x!)
    .attr('cy', vertice.y!)
    .attr('fill', '#1890ff')
    .style('cursor', 'pointer')
    .attr('id', verticePrefix + vertice.id || '')
    .on('mouseover', (e: any) => {
      debounceIsShowNodeMenu({ e, node: vertice, config, delay: 0 })
    })
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
    .classed('node-name', true)
    .attr('x', vertice.x!)
    .attr('y', vertice.y! + nodeRadius + config.nameSize + fontMargin)
    .attr('id', verticePrefix + vertice.id + 'name')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', config.nameSize)
    .attr('fill', '#fff')
    .text(config.nameVisible ? vertice.name : '')
}

type SideProps = {
  container: d3.Selection<any, any, any, any>;
  config: Graph.ConfigProps;
  vertice: Graph.Vertice;
  mainVertice: Graph.Vertice;
  edges: Graph.Line[];
  duration: number;
}

const fn = throttle(function ({
  config,
  vertice,
  mainVertice,
  isExplore
}: {
  isExplore: { explore: boolean };
  config: Graph.ConfigProps;
  vertice: Graph.Vertice;
  mainVertice: Graph.Vertice;
}) {
  isExplore.explore = !isExplore.explore
  explore({ current: vertice, isExplore: isExplore.explore, config, mainPoint: mainVertice, needExplore: false });
}, 1100, { 'trailing': false })

let timer = -1

export const createSideNode = (
  {
    container,
    config,
    vertice,
    mainVertice,
    edges,
    duration
  }: SideProps
) => {
  const { nodeRadius } = config
  let delay = initDraw ? 0 : duration
  setDelay(delay)
  changeInitDraw(false)
  let isExplore = { explore: false }
  if (!globalNodes.find(v => v.id === vertice.id)) {
    globalNodes.push(vertice)
  }


  if (isReset) {
    const paths = explorePath.filter(path => path.mainId === vertice.id)

    if (paths.length > 0 && globalNodes.length > 0) {
      isExplore.explore = true
    }
  }


  // 探索
  window.setTimeout(() => {
    setTimeout(() => {
      container.on('mouseover', (e: any) => {
        e.stopPropagation();
        debounceIsShowNodeMenu({ e, node: vertice, config, delay })
      })
    }, delay)
    container
      .on('mousedown', (e: any) => {
        rightMenuClick({ e, node: vertice })
      })
      .call(
        d3.drag<any, any>()
          .on('start', function (event) {
            dragStart({ current: this, event, node: vertice, config, edges })
          })
          .on('drag', function (event) {
            dragging({ current: this, event, node: vertice, config, edges })
          })
          .on('end', function (event) {
            dragEnd({ current: this, event, node: vertice, config, edges })
          })
      )
      .on('click', (e) => {
        unShowNodeMenu({ node: vertice, config })
        window.clearInterval(timer)
        container.call(
          d3.drag<any, any>()
            .on('start', () => { })
            .on('drag', () => { })
            .on('end', () => { })
        )

        timer = window.setTimeout(() => {
          unShowNodeMenu({ node: vertice, config })
          container
            .call(
              d3.drag<any, any>()
                .on('start', function (event) {
                  dragStart({ current: this, event, node: vertice, config, edges })
                })
                .on('drag', function (event) {
                  dragging({ current: this, event, node: vertice, config, edges })
                })
                .on('end', function (event) {
                  dragEnd({ current: this, event, node: vertice, config, edges })
                })
            )
        }, isReset ? exploreTimer : duration + 100)
        fn({ isExplore, config, vertice, mainVertice })
      })
  }, duration)

  container
    .append('circle')
    .attr('r', nodeRadius)
    .attr('cx', mainVertice.x!)
    .attr('cy', mainVertice.y!)
    .attr('fill', canExplore({ node: vertice }) ? 'tomato' : '#1890ff')
    .style('cursor', 'pointer')
    .attr('id', verticePrefix + vertice.id || '')
    .style('opacity', 0)
    .transition()
    .delay(isReset ? exploreTimer : delay)
    .duration(isReset ? exploreTimer : duration)
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
    .delay(isReset ? exploreTimer : delay)
    .duration(isReset ? exploreTimer : duration)
    .attr('x', vertice.x!)
    .attr('y', vertice.y!)
    .style('opacity', 1)
  container
    .append('text')
    .classed('node-name', true)
    .attr('x', mainVertice.x!)
    .attr('y', mainVertice.y! + nodeRadius + config.nameSize + fontMargin)
    .attr('id', verticePrefix + vertice.id + 'name')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', config.nameSize)
    .text(config.nameVisible ? vertice.name : '')
    .attr('fill', '#fff')
    .style('opacity', 0)
    .transition()
    .delay(isReset ? exploreTimer : delay)
    .duration(isReset ? exploreTimer : duration)
    .attr('x', vertice.x!)
    .attr('y', vertice.y! + nodeRadius + config.nameSize + fontMargin)
    .style('opacity', 1)
}