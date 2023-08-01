// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTranslatedNovel, book } from '@/lib/novel'
import cache from '@/lib/cache'

type Data = {
	error: boolean
	message?: any
	book?: book
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	let id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id || ''

	let book = cache.get(id)
	if (book) {
		res.status(200).json({
			error: false,
			book,
		})
	} else {
		console.log(`fetch book ${id}`)
		getTranslatedNovel(id)
			.then(book => {
				console.log('hi')
				cache.set(id, book)
				res.status(200).json({
					error: false,
					book,
				})
			})
			.catch(err => {
				console.error(err)
				res.status(400).json({
					error: true,
					message: err,
				})
			})
	}
}
