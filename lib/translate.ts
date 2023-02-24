import { translate } from 'google-translate-api-x';

const delimiter = `\n`;
const maxLength = 5000;
export function text2Chunks(text: string): string[] {
	let chunks: string[] = [];
	let last = '';

	for (let chunk of text.split(delimiter)) {
		if (last.length + chunk.length < maxLength) {
			last += delimiter + chunk;
		} else {
			chunks.push(last);
			last = chunk;
		}
	}
	chunks.push(last);

	return chunks;
}

type strObj = { [key: string]: string };
export default async function tr(strObj: strObj) {
	const t = (text: string) => translate(text, { to: 'zh-TW' }).then(res => res.text);
	let result: strObj = {};
	for (let key in strObj) {
		try {
			result[key] = (await Promise.all(text2Chunks(strObj[key]).map(text => t(text)))).join(delimiter);
		} catch (e) {
			console.log('Err: lib.tr:', e);
			result[key] = strObj[key];
		}
	}
	return result;
}
