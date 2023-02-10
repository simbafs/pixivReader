// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTranslatedNovel, book } from '@/lib/novel'

type Data = {
	error: boolean,
	message?: any,
	book?: book,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	getTranslatedNovel(req.query.id as string)
		.then(book => res.status(200).json({
			error: false,
			book,
		}))
		.catch(err => res.status(400).json({
			error: true,
			message: err,
		}))
}
