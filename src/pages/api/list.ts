import type { NextApiRequest, NextApiResponse } from 'next'
import cache from '@/lib/cache'

export type Data = {
	error: boolean
	message?: any
	books: {
		id: number
		title: string
		description: string
	}[]
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	res.status(200).json({
		error: false,
		books: [...cache.values()].map(book => ({
			id: book.id,
			title: book.title,
			description: book.description,
		})),
	})
}
