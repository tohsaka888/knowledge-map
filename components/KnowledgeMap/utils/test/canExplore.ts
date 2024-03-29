/*
 * @Author: tohsaka888
 * @Date: 2022-08-18 10:58:08
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-24 14:58:01
 * @Description: 请填写简介
 */

import { Graph } from "../../../..";

type Props = {
  node: Graph.Vertice;
}

export const canExplore = ({ node }: Props) => {
  const ids = ["1093864", "98536", "57456", "114736", "12536", "94208"]
  const id = ids.find(id => id == node.id)
  return !!id
}
