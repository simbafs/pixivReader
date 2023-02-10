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

export async function getNovel(id: string | number): Promise<book> {
	if (!id) return new Promise((_, rej) => rej("novel not found"))
	return fetch(`https://www.pixiv.net/ajax/novel/${id}`)
		.then(res => res.json())
		.then(data => {
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
		})
}

export function filterContent(book: book): book {
	book.content
		.replace(/\[uploadedimage:[0-9]+\]/g, '')
		.replace(/\[newpage\]/g, '')
	return book
}

export async function getTranslatedNovel(id: string | number, to = 'zh-TW') {
	const tr = (text: string) => translate(text, { to }).then(res => res.text)
	const book = await getNovel(id).then(filterContent)
	let translated: book
	translated = await Promise.all([
		book.id,
		book.author,
		tr(book.title),
		tr(book.description),
		book.tags,
		// tr(JSON.stringify(book.tags)).then(text => JSON.parse(text) as string[]),
		tr(book.content),
	]).then(res => ({
		id: res[0],
		author: res[1],
		title: res[2],
		description: res[3],
		tags: res[4],
		content: res[5],
	})).catch((err) => translated = {
			...book,
			err,
	})

	return translated
}
