/*
 * @Author: tohsaka888
 * @Date: 2022-08-04 10:36:41
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-04 10:47:23
 * @Description: 请填写简介
 */
import * as d3 from 'd3'
import { base64ToBlob } from './base64ToBlob';

export const downloadSvg = () => {
  const svg = d3.select('#svg').node() as HTMLElement
  const s = new XMLSerializer().serializeToString(svg);
  const ImgBase64 = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(s)))}`;
  const svgBlob = base64ToBlob(ImgBase64)
  return svgBlob
}
