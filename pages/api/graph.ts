/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-01 13:31:02
 * @Description: 请填写简介
 */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { genGraphData } from '../../mock/graph_data'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Api.GraphResponse>
) {
  res.status(200).json({ success: true, data: genGraphData() })
}
