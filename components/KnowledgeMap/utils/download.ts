/*
 * @Author: tohsaka888
 * @Date: 2022-08-04 10:36:41
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-23 11:39:56
 * @Description: 请填写简介
 */
import * as d3 from 'd3'
import { base64ToBlob } from './base64ToBlob';

/**
 * 描述 下载图片
 * @date 2022-08-16
 * @returns {any}
 */
export const downloadSvg = () => {
  //  获取影响布局的元素
  const controllerPannel = document.getElementsByClassName('ant-layout-sider-children')[0]
  const left = controllerPannel.getBoundingClientRect().width as number

  const header = document.getElementsByClassName('ant-layout-header')[0]
  const top = header.getBoundingClientRect().height as number


  // 获取画布大小
  const svg = d3.select('#svg').node() as HTMLElement
  const drag = document.getElementById('drag')!
  const width = drag.getBoundingClientRect().width as number + 100
  const height = drag.getBoundingClientRect().height as number + 100

  // 获取画布位移
  const transform = d3.select(drag).attr('transform')
  let tempArr = transform.split(",");
  // 获取当前的x和y坐标
  const x = +(tempArr?.[0]?.split("(")[1] || 0);
  const y = +(tempArr?.[1]?.split(")")[0] || 0);

  // 获取画布缩放
  const scale = d3.select('#scale').attr('transform')
  const size = +scale.slice(6, scale.length - 1)

  // 复制画布 移除缩放拖动影响
  const newSvg = svg.cloneNode(true)
  d3.select(newSvg as SVGSVGElement)
    .select('#drag')
    .attr('transform', `translate(${(-drag.getBoundingClientRect().left + left + 50) / size + x}, ${(-drag.getBoundingClientRect().top + top + 50) / size + y})`)


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
    window.open(aLink.href, 'Download');
  }
}
