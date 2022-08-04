import * as d3 from 'd3'

export const svgDrag = () => {
  const y = document.getElementById('test')?.getBoundingClientRect().top as number
  const x = document.getElementsByClassName('ant-layout-sider-children')[0]?.getBoundingClientRect().width as number

  d3.select('#test-circle')
    .call(d3.drag<any, any>()
      .on('start', (e) => {
        const node = d3.select('#test-circle')
          .clone(true)
          .attr('id', 'move-temp-item')
        const container = d3.select('body')
          .insert('div', ':first-child')
          .style('position', 'fixed')
          .style('background-color', 'transparent')
          .style('width', '200px')
          .style('height', '200px')
          .style('z-index', 100)
          .attr('id', 'move-temp')
          .style('transform', `translate3d(${e.x - 50}px,${e.y - 50 + y}px, 0)`)
          .append('svg')
          .attr('id', 'move-temp-container')
          .node()
        if (container) {
          container.appendChild(node.node() as SVGCircleElement)
        }
      })
      .on('drag', (e: any) => {
        requestAnimationFrame(() => {
          d3.select('#move-temp')
            .style('transform', `translate3d(${e.x - 50}px,${e.y - 50 + y}px, 0)`)
        })
      })
      .on('end', (e: any) => {
        d3.select('#move-temp').remove()
        const node = d3.select('#test-circle')
          .clone(true)
          .attr('id', 'new-node')
          .attr('cx', e.x - x)
          .attr('cy', e.y + y - 64)
          .node() as SVGCircleElement
        document.getElementById('node-area')?.append(node)
      })
    )
}