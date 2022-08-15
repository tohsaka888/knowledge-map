/*
 * @Author: tohsaka888
 * @Date: 2022-08-04 10:36:41
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-15 14:40:28
 * @Description: 请填写简介
 */
import * as d3 from 'd3'
import { cloneDeep } from 'lodash';
import { base64ToBlob } from './base64ToBlob';

export const downloadSvg = () => {
  const svg = d3.select('#svg').node() as HTMLElement
  const drag = document.getElementById('drag')!
  const width = drag.getBoundingClientRect().width as number + 50
  const height = drag.getBoundingClientRect().height as number + 50

  const newSvg = svg.cloneNode(true)
  d3.select(newSvg as SVGSVGElement)
    .select('#drag')
    .attr('transform', `translate(${-drag.getBoundingClientRect().left + 225}, ${-drag.getBoundingClientRect().top + 85})`)

  console.log(newSvg)

  const s = new XMLSerializer().serializeToString(newSvg);
  const src = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(s)))}`;

  const img = new Image(); // 创建图片容器承载过渡
  img.width = width
  img.height = height
  img.src = src;
  img.onload = () => {
    // ↓ 第二部分
    const canvas = document.createElement('canvas');
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d');
    context?.drawImage(img, 0, 0);
    const ImgBase64 = canvas.toDataURL('image/png');
    let aLink = document.createElement('a');
    let blob = base64ToBlob(ImgBase64); //new Blob([content]);
    aLink.download = '图谱';
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
  }
}
