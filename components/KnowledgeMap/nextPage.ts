/*
 * @Author: tohsaka888
 * @Date: 2022-08-16 17:13:59
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-16 17:17:48
 * @Description: 请填写简介
 */

import { Graph } from "../.."

// const nextPage = (
//   pagination: { page: number, pageSize: number },
//   originNodes: Graph.Node[],
//   total: number,
//   index: number,
//   maxAngle: number,
//   edges: Graph.Edge[],
//   config: Graph.ConfigProps,
//   isInside: boolean,
//   centerPoint: Graph.Node
// ) => {
//   const { mode, nodeRadius, basicDistence, setVisible } = config
//   d3.select('#border').select('circle').attr('r', 0)
//   const x = centerPoint.x!
//   const y = centerPoint.y!

//   pagination.page = (pagination.page + 1) % total === 0 ? total : (pagination.page + 1) % total
//   const nodes = calcMode(originNodes, pagination.page, mode)
//   d3.select(`#${nodes[0].type}`).selectChildren().remove()
//   const container =
//     d3.select(`#${nodes[0].type}`)
//       .selectAll('g')
//       .data(nodes)
//       .join('g')
//   container
//     .append('circle')
//     .attr('r', nodeRadius)
//     .attr('fill', '#1890ff')
//     .attr('id', (node) => node.id)
//     .attr('cx', x)
//     .attr('cy', y)
//     .transition()
//     .duration(1000)
//     .attr('cx', (node, idx) => {
//       const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
//       node.x = isInside
//         ? x - calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
//         : x + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.cos(Math.abs(angle - 90) / 180 * Math.PI)
//       return node.x as number
//     })
//     .attr('cy', (node, idx) => {
//       const angle: number = (idx + 1) * maxAngle / (nodes.length + 1) + index * maxAngle
//       node.y = isInside
//         ? y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
//         : y + calcBasicDistence(nodes.length, maxAngle, basicDistence) * Math.sin((angle - 90) / 180 * Math.PI)
//       return node.y
//     })
//   container
//     .append('text')
//     .attr('x', x || 0)
//     .attr('y', y || 0)
//     .attr('id', node => node.id + 'text')
//     .style('cursor', 'pointer')
//     .attr('text-anchor', 'middle')
//     .attr('dominant-baseline', 'middle')
//     .attr('fill', '#fff')
//     .style('font-size', 14)
//     .text(node => node.type)
//     .transition()
//     .duration(1000)
//     .attr('x', (node, idx) => {
//       return node.x as number
//     })
//     .attr('y', (node, idx) => {
//       return node.y as number
//     })
//   container
//     .append('text')
//     .attr('x', x)
//     .attr('y', y)
//     .attr('text-anchor', 'middle')
//     .style('font-size', 10)
//     .text(item => item.name)
//     .attr('id', item => `${item.id}name`)
//     .style('opacity', 0)
//     .transition()
//     .duration(1000)
//     .attr('x', (node, idx) => {
//       return node.x as number;
//     })
//     .attr('y', (node, idx) => {
//       return node.y as number + nodeRadius + 10;
//     })
//     .style('opacity', 1);

//   // 延迟1s挂在事件,防止在节点移动中显示悬浮窗 
//   window.setTimeout(() => {
//     container.call(
//       d3.drag<any, any, Graph.Node>()
//         .on('start', function (event: any, node: Graph.Node) {
//           dragStart(this, event, node, config)
//         })
//         .on('end', function (event: any, node: Graph.Node) {
//           dragEnd(this, event, node, config)
//         })
//         .on('drag', function (event: any, node: Graph.Node) {
//           dragging(this, event, node, edges, config)
//         })
//     ).on('mouseover', function (event, d) {
//       event.stopPropagation();
//       const node = d3.select(`#${d.id}`)
//       const x = +node.attr('cx')
//       const y = +node.attr('cy')
//       d3.select('#border')
//         .attr('transform', `translate(${x}, ${y})`)
//         .select('circle')
//         .attr('stroke-width', 8)
//         .attr('r', nodeRadius + 4)
//       d3.select('#popover-container')
//         .attr('width', nodeRadius * 2 + 10)
//         .attr('height', nodeRadius * 2 + 10)
//         .attr('x', +x)
//         .attr('y', +y - 10)
//       setVisible && setVisible(true)
//     })
//   }, 1000)

//   edges.forEach((edge) => {
//     if (edge.fromId.includes(nodes[0].type) || edge.toId.includes(nodes[0].type)) {
//       d3.select(`#${edge.fromId}${edge.toId}`).remove()
//       d3.select(`#${edge.fromId}${edge.toId}description`).remove()
//       d3.select(`#${edge.fromId}${edge.toId}icon`).remove()
//     }
//   })
//   drawEdgeArea([...nodes, centerPoint], edges, config, centerPoint.id)
//   d3.select(`#${nodes[0].type}-text`).text(`${pagination.page}/${total}`)
// }

type Props = {
  pagination: { page: number, pageSize: number },
  originNodes: Graph.Vertice[],
  total: number,
  index: number,
  maxAngle: number,
  // edges: Graph.Edge[],
  config: Graph.ConfigProps,
  isInside: boolean,
  centerPoint: Graph.Node
}

export const nextPage = (
  {
    pagination,
    originNodes,
    total,
    index,
    maxAngle,
    config,
    isInside,
    centerPoint
  }: Props
) => {

}
