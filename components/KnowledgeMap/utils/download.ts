/*
 * @Author: tohsaka888
 * @Date: 2022-08-04 10:36:41
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-04 13:48:01
 * @Description: 请填写简介
 */
import * as d3 from 'd3'
import { cloneDeep } from 'lodash';
import { base64ToBlob } from './base64ToBlob';

export const downloadSvg = () => {
  const svg = d3.select('#svg').node() as HTMLElement
  const width = document.getElementById('drag')?.getBoundingClientRect().width as number
  const height = document.getElementById('drag')?.getBoundingClientRect().height as number

  const s = new XMLSerializer().serializeToString(svg);
  const src = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(s)))}`;

  const img = new Image(); // 创建图片容器承载过渡
  img.width = width
  img.height = height
  img.src = src;
  img.onload = () => {
    // ↓ 第二部分
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight;
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
