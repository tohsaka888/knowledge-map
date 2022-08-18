/*
 * @Author: tohsaka888
 * @Date: 2022-08-01 11:31:01
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-18 16:36:54
 * @Description: 请填写简介
 */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import inMainNode from '../../mock/in/mainNode.json'
import outMainNode from '../../mock/out/outMainNode.json'
import indata1 from '../../mock/in/98536in.json'
import outdata1 from '../../mock/out/98536out.json'
import indata2 from '../../mock/in/57456in.json'
import outdata2 from '../../mock/out/57456out.json'
import indata3 from '../../mock/in/114736in.json'
import outdata3 from '../../mock/out/114736out.json'
import indata4 from '../../mock/in/12536in.json'
import outdata4 from '../../mock/out/12536out.json'

const responseData = {
  "1093864": {
    in: inMainNode,
    out: outMainNode
  },
  "98536": {
    in: indata1,
    out: outdata1
  },
  "57456": {
    in: indata2,
    out: outdata2
  },
  "114736": {
    in: indata3,
    out: outdata3
  },
  "12536": {
    in: indata4,
    out: outdata4
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Api.KnowledgeResponse>
) {
  const query = req.query as Api.GraphQuery
  res.status(200).json({ success: true, data: responseData[query.id][query.direction] })
}
