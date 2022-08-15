/*
 * @Author: tohsaka888
 * @Date: 2022-08-15 08:50:59
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-15 13:39:15
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

function ticked({ nodeContainer, link, config }: any) {
  requestAnimationFrame(() => {
    link
      .attr("x1", (d: { source: { x: any; }; }) => d.source.x)
      .attr("y1", (d: { source: { y: any; }; }) => d.source.y)
      .attr("x2", (d: { target: { x: any; }; }) => d.target.x)
      .attr("y2", (d: { target: { y: any; }; }) => d.target.y);


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
    event.subject.fx = null;
    event.subject.fy = null;
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
  const forceNode = d3.forceCollide(nodes.length).strength(0.1)
  const forceLink = d3.forceLink(l).id((_, i) => computedNodes[i]).distance(nodes.length * config.nodeRadius / 5)

  const container = d3.select('#drag')
  container.selectAll('*').remove()

  const link = container.append("g")
    .attr("class", "force-graph")
    .attr("stroke", "#cecece")
    .attr("stroke-width", 1)
    .selectAll("line")
    .data(l)
    .join("line");

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
}

