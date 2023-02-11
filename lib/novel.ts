import { translate } from 'google-translate-api-x'

export type book = {
	id: number,
	author: string,
	title: string,
	description: string,
	tags: string[],
	content: string,
	err?: any,
}

export async function getNovel(id: string): Promise<book> {
	if (!id) return new Promise((_, rej) => rej("novel not found"))
	const data = await fetch(`https://www.pixiv.net/ajax/novel/${id}`).then(res => res.json())
	if (!data) throw new Error("novel not found")
	if (data.error) throw new Error("novel not found")
	return {
		id: data.body.id,
		author: data.body.userName,
		title: data.body.title,
		description: data.body.description,
		tags: data.body.tags.tags.map((item: { tag: string }) => item.tag),
		content: data.body.content,
	}
}

export function filterContent(book: book) {
	book.content
		.replace(/\[uploadedimage:[0-9]+\]/g, '')
		.replace(/\[newpage\]/g, '')
	return book
}

type strObj = { [key: string]: string }
export async function tr(strObj: strObj) {
	const t = (text: string) => translate(text, { to: 'zh-TW' }).then(res => res.text)
	let result: strObj = {}
	for (let key in strObj) {
		try {
			result[key] = await t(strObj[key])
		} catch (e) {
			console.log('Err: lib.tr:', e)
			result[key] = strObj[key]
		}
	}
	return result
}

export async function translateBook(book: book) {
	return {
		...book,
		...await tr({
			title: book.title,
			description: book.description,
			content: book.content,
		})
	}
}

export const getTranslatedNovel = (id: string) => getNovel(id).then(filterContent).then(translateBook)
