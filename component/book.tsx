import { book } from '@/lib/novel'
import { SettingOptions } from '@/component/setting'

export default function Book({ book, setting }: { book: book | null, setting: SettingOptions }) {
	if (!book) return null
	return <>
		<h1>{book.title}</h1>
		<p>{book.tags.join(', ')}</p>
		<p dangerouslySetInnerHTML={{ __html: book.description }} />
		<p>pixiv page:<a
			href={`https://www.pixiv.net/novel/show.php?id=${book.id}`}
			target="_blank"
			rel="noreferrer"
		>{`https://www.pixiv.net/novel/show.php?id=${book.id}`}</a>
		</p>
		<hr />
		<div style={{ overflowWrap: 'anywhere', }}>
			{book.content.split('\n').map((text, index) => <p
				key={index}
				style={{
					fontSize: `${setting.fontSize}px`,
					lineHeight: setting.lineHeight,
					letterSpacing: `${setting.letterSpacing}px`,
				}}
			>{text}</p>)}
		</div>
		{book.err ? <pre>{JSON.stringify(book.err, null, 2)}</pre> : null}
	</>
}
