import type { NextApiRequest, NextApiResponse } from 'next';
import translate from '@/lib/translate';

export type SearchResult = {
	id: string;
	title: string;
	tags: string[];
	userId: string;
	userName: string;
	textCount: number;
	wordCount: number;
	readingTime: number;
	description: string;
	createDate: string;
	updateDate: string;
	seriesId: string;
	seriesTitle: string;
};
type Data = {
	error: boolean;
	body: SearchResult[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	let { q: search, p: pageString, t: shouldTranslateStr } = req.query;
	let page = 1;
	let shouldTranslate = false;

	if (Array.isArray(search)) {
		search = search.join(' ');
	} else if (!search) {
		// empty string, undefined, etc
		return res.status(200).json({
			error: false,
			body: [],
		});
	}

	if (Array.isArray(pageString)) {
		pageString = pageString[0];
	}
	if (pageString && !isNaN(parseInt(pageString))) {
		page = parseInt(pageString);
	}

	if (Array.isArray(shouldTranslateStr)) shouldTranslateStr = shouldTranslateStr[0];
	shouldTranslate = shouldTranslateStr === '1';

	return fetch(
		`https://www.pixiv.net/ajax/search/novels/${search}?word=${search}&order=date_d&mode=all&p=${page}&s_mode=s_tag`
	)
		.then(res => res.json())
		.then(data => {
			if (data.error) throw new Error(data.message);
			return data;
		})
		.then(data => filterData(data?.body?.novel?.data, { shouldTranslate }))
		.then((data: SearchResult[]) =>
			res.status(200).json({
				error: false,
				body: data,
			})
		)
		.catch(err =>
			res.status(400).json({
				error: true,
				body: err?.message,
			})
		);
}

type filterOptions = {
	shouldTranslate: boolean;
};
async function filterData(data: SearchResult[], opt: filterOptions): Promise<SearchResult[]> {
	if (opt.shouldTranslate)
		for (let key in data) {
			let { title, description } = await translate({
				title: data[key].title,
				description: data[key].description,
			});
			data[key].title = title;
			data[key].description = description;
		}
	return data;
}
