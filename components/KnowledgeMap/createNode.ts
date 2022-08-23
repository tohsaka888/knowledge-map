/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 15:53:09
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-23 17:16:42
 * @Description: 请填写简介
 */

import * as d3 from 'd3'
import { debounce, throttle } from 'lodash';
import { Graph } from '../..';
import { explore } from './explore';
import { changeIsReset, explorePath, globalNodes, isReset } from './global';
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
    .attr('y', vertice.y! + nodeRadius + config.nameSize)
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

const debouncedExplore = debounce(explore, 1000)
const debouncedReset = debounce((path, idx) => {
  path.isExplore = true
  if (!explorePath.find(p => p.isExplore !== true)) {
    changeIsReset(false)
  }
}, 1000)

let timer = -1

export const createSideNode = (
  {
    container,
    config,
    vertice,
    mainVertice,
    edges,
    duration,
  }: SideProps
) => {
  const { nodeRadius } = config
  let isExplore = { explore: false }
  if (!globalNodes.find(v => v.id === vertice.id)) {
    globalNodes.push(vertice)
  }


  if (isReset) {
    const paths = explorePath.filter(path => path.mainId === vertice.id)

    if (paths.length > 0) {
      isExplore.explore = true

      paths.forEach((path, idx) => {
        if (vertice.isInside) {
          debouncedExplore({
            mainPoint: mainVertice,
            isExplore: isExplore.explore,
            config,
            current: vertice,
            needExplore: true,
            inGraphData: path.inData,
            outGraphData: path.outData
          })
          debouncedReset(path, idx)
        } else {
          setTimeout(() => {
            debouncedExplore({
              mainPoint: mainVertice,
              isExplore: isExplore.explore,
              config,
              current: vertice,
              needExplore: true,
              inGraphData: path.inData,
              outGraphData: path.outData
            })
            debouncedReset(path, idx)
          }, 1000)
        }

      })
    }
  }


  // 探索
  window.setTimeout(() => {
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
      .on('click', (e) => {
        window.clearInterval(timer)
        container.call(
          d3.drag<any, any>()
            .on('start', () => { })
            .on('drag', () => { })
            .on('end', () => { })
        )

        timer = window.setTimeout(() => {
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
        }, duration + 100)
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
    .duration(duration)
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
    .duration(duration)
    .attr('x', vertice.x!)
    .attr('y', vertice.y!)
    .style('opacity', 1)
  container
    .append('text')
    .attr('x', mainVertice.x!)
    .attr('y', mainVertice.y! + nodeRadius + config.nameSize)
    .attr('id', verticePrefix + vertice.id + 'name')
    .style('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', config.nameSize)
    .text(config.nameVisible ? vertice.name : '')
    .attr('fill', '#fff')
    .style('opacity', 0)
    .transition()
    .duration(duration)
    .attr('x', vertice.x!)
    .attr('y', vertice.y! + nodeRadius + config.nameSize)
    .style('opacity', 1)
}