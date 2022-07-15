import * as d3 from 'd3'

export const canvasDrag = (canvas: SVGSVGElement, dragElement: SVGGElement) => {
  d3.select(canvas).call(
    d3.drag<SVGSVGElement, unknown>()
      .on('start', function () {
        d3.select(this).style('cursor', 'pointer')
      })
      .on('drag', function (event: any) {
        const currentElement = d3.select(dragElement)
        const tempArr = currentElement.attr("transform").split(",");
        // 获取当前的x和y坐标
        const x = +(tempArr?.[0]?.split("(")[1] || 0);
        const y = +(tempArr?.[1]?.split(")")[0] || 0);
        // 当前坐标加上拖拽的相对坐标
        // 即新坐标相比原坐标的偏移量
        currentElement.attr(
          "transform",
          `translate(${x + event.dx}, ${y + event.dy})`
        );
      })
      .on('end', function () {
        d3.select(this).style('cursor', 'auto')
      })
  )

}