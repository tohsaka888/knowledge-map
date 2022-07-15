// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { genGraphData } from '../../mock/graph_data'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Api.GraphResponse>
) {
  res.status(200).json({ success: true, data: genGraphData() })
}
