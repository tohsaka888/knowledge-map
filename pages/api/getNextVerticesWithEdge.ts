/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-16 14:02:35
 * @Description: 请填写简介
 */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import inMainNode from '../../mock/in/mainNode.json'
import outMainNode from '../../mock/out/outMainNode.json'
import indata1 from '../../mock/in/98536in.json'
import outdata1 from '../../mock/out/98536out.json'

const responseData = {
  "1093864": {
    in: inMainNode,
    out: outMainNode
  },
  "98536": {
    in: indata1,
    out: outdata1
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Api.KnowledgeResponse>
) {
  const query = req.query as Api.GraphQuery

  console.log(query.id)
  res.status(200).json({ success: true, data: responseData[query.id][query.direction] })
}
