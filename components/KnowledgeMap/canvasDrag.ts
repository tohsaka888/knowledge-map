import * as d3 from 'd3'

let size = 1

export const resetSize = () => {
  size = 1
}

export const canvasDrag = (canvas: SVGSVGElement) => {
  d3.select(canvas).call(
    d3.drag<SVGSVGElement, unknown>()
      .on('start', function () {
        d3.select(this).style('cursor', 'pointer')
      })
      .on('drag', function (event: any) {
        const currentElement = d3.select('#drag')
        const tempArr = currentElement.attr("transform").split(",");
        // 获取当前的x和y坐标
        const x = +(tempArr?.[0]?.split("(")[1] || 0);
        const y = +(tempArr?.[1]?.split(")")[0] || 0);
        // 当前坐标加上拖拽的相对坐标
        // 即新坐标相比原坐标的偏移量
        currentElement.attr(
          "transform",
          `translate(${x + event.dx / size}, ${y + event.dy / size})`
        );
      })
      .on('end', function () {
        d3.select(this).style('cursor', 'auto')
      })
  )
    .on('wheel', function (event: any) {
      if (event.deltaY < 0) {
        d3.select('#scale')
          .attr('transform', `scale(${size *= 1.05})`)
      } else {
        d3.select('#scale')
          .attr('transform', `scale(${size *= 0.95})`)
      }
    })
}