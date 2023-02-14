import type { NextApiRequest, NextApiResponse } from 'next'
import sanitizeHtml from 'sanitize-html'

export type SearchResult = {
	id: string,
	title: string,
	tags: string[],
	userId: string,
	userName: string,
	textCount: number,
	wordCount: number,
	readingTime: number,
	description: string,
	createDate: string,
	updateDate: string,
	seriesId: string,
	seriesTitle: string,
}
type Data = {
	error: boolean,
	body: SearchResult[],
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	let { q: search, p: pageString } = req.query
	let page = 1

	if (Array.isArray(search)) {
		search = search.join(' ')
	} else if (!search) { // empty string, undefined, etc
		return res.status(200).json({
			error: false,
			body: [],
		})
	}

	if (Array.isArray(pageString)) {
		pageString = pageString[0]
	}
	if (pageString && !isNaN(parseInt(pageString))) {
		page = parseInt(pageString)
	}

	return fetch(`https://www.pixiv.net/ajax/search/novels/${search}?word=${search}&order=date_d&mode=all&p=${page}`)
		.then(res => res.json())
		.then(data => filterData(data?.body?.novel?.data))
		.then((data: SearchResult[]) => res.status(200).json({
			error: false,
			body: data,
		}))
		.catch(err => res.status(400).json({
			error: true,
			body: err,
		}))
}

function filterData(data: SearchResult[]): SearchResult[] {
	// for (let key in data) {
	// 	data[key].description = sanitizeHtml(data[key].description, {
	// 		allowedTags: ['br'],
	// 	}).replaceAll('<br />', `\n`)
	// }
	// console.log(data)
	return data
}
