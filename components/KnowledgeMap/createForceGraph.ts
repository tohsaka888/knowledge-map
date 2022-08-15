/*
 * @Author: tohsaka888
 * @Date: 2022-08-15 08:50:59
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-15 15:33:52
 * @Description: 请填写简介
 */

import * as d3 from 'd3'
import { Graph } from '../..'

type Props = {
  nodes: Graph.Node[];
  edges: Graph.Edge[];
  config: Graph.ConfigProps;
}

function intern(value: any) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}

const createDescription = (edgeArea: d3.Selection<any, any, any, any>, config: Graph.ConfigProps, edges: Graph.Edge[]) => {
  edges.forEach(edge => {
    if (config.showDisctription) {
      edgeArea
        .append('text')
        .attr('id', edge.fromId + edge.toId + 'description')
        .append('textPath')
        .style('opacity', 0)
        .attr('text-anchor', 'center')
        .attr('href', `#${edge.fromId + edge.toId}`)
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
      .attr('id', edge.fromId + edge.toId + 'icon')
      .append('textPath')
      .attr('text-anchor', 'center')
      .attr('href', `#${edge.fromId + edge.toId}`)
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
  })
}

function ticked({ nodeContainer, link, config }: { nodeContainer: any; link: any; config: Graph.ConfigProps }) {
  requestAnimationFrame(() => {
    if (config.isStraight) {
      link.attr('d', (d: any) => `
        M ${d.source.x} ${d.source.y},
        L ${d.target.x} ${d.target.y}
      `)
        .attr('id', (d: any) => d.source.id + d.target.id)
    } else {
      link.attr('d', (d: any) => {
        const fromNode = d.source
        const toNode = d.target
        const perX = (toNode.x - fromNode.x) / config.besselRate
        return `
        M ${fromNode.x} ${fromNode.y},
        C ${+fromNode.x + perX} ${fromNode.y},
        ${+toNode.x - perX} ${toNode.y}
        ${toNode.x} ${toNode.y}
        `
      })
        .attr('fill', 'transparent')
        .attr('id', (d: any) => d.source.id + d.target.id)
    }


    nodeContainer
      .selectAll('circle')
      .attr("cx", (d: { x: any; }) => d.x)
      .attr("cy", (d: { y: any; }) => d.y);

    nodeContainer
      .select('.type')
      .attr("x", (d: { x: any; }) => d.x)
      .attr("y", (d: { y: any; }) => d.y);

    nodeContainer
      .select('.name')
      .attr("x", (d: { x: any; }) => d.x)
      .attr("y", (d: { y: any; }) => d.y + config.nodeRadius + 10);
  })
}

function drag(simulation: any) {
  function dragstarted(event: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: any, d: any) {
    requestAnimationFrame(() => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    })
  }

  function dragended(event: any) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  return d3.drag<any, any>()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

export const createForceGraph = ({ nodes, edges, config }: Props) => {
  const computedNodes = d3.map(nodes, (node) => node.id).map(intern)
  const computedSource = d3.map(edges, (edge) => edge.fromId).map(intern);
  const computedTarget = d3.map(edges, (edge) => edge.toId).map(intern);

  // Replace the input nodes and links with mutable objects for the simulation.
  const n = d3.map(nodes, (_, i) => ({ id: computedNodes[i] as number }));
  const l = d3.map(edges, (_, i) => ({ source: computedSource[i], target: computedTarget[i] }));

  // Construct the forces.
  const forceNode = d3.forceCollide(config.nodeRadius * 2).strength(0.5)
  const forceLink = d3.forceLink(l).id((_, i) => computedNodes[i]).distance(nodes.length * config.nodeRadius / 2)

  const container = d3.select('#drag')
  container.selectAll('*').remove()

  const link = container.append("g")
    .attr("class", "force-graph")
    .attr("stroke", "#cecece")
    .attr("stroke-width", 1)
    .selectAll("path")
    .data(l)
    .join("path")

  const nodeContainer = container.append('g')
    .attr("class", "force-graph")
    .selectAll("g")
    .data(n)
    .join('g')

  nodeContainer
    .append('circle')
    .attr('r', config.nodeRadius)
    .attr('fill', '#1890ff')

  nodeContainer
    .append('text')
    .classed('type', true)
    .text((_, index) => nodes[index].type)
    .attr('id', node => node.id + 'name')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-size', 12)
    .attr('fill', '#fff')

  nodeContainer
    .append('text')
    .classed('name', true)
    .text((_, index) => nodes[index].name)
    .attr('id', node => node.id + 'name')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-size', 12)
    .attr('fill', '#000')

  const simulation = d3
    .forceSimulation(n as any)
    .force("link", forceLink)
    .force("charge", forceNode)
    .force("center", d3.forceCenter(700, 400))
    .alpha(0.3)
    .on("tick", () => ticked({ nodeContainer, link, config }))

  nodeContainer.call(drag(simulation))

  setTimeout(() => {
    createDescription(container, config, edges)
  })
}

