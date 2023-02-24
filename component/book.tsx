import { book } from '@/lib/novel'
import { SettingOptions } from '@/component/setting'

export default function Book({ book, setting }: { book: book | null; setting: SettingOptions }) {
	if (!book) return null
	return (
		<>
			<h1 className="ts-header is-massive">{book.title}</h1>
			<p className="ts-header">{book.tags.join(', ')}</p>
			<p className="ts-header" dangerouslySetInnerHTML={{ __html: book.description }} />
			<p className="ts-header">
				pixiv page:
				<a
					className="is-external-link"
					href={`https://www.pixiv.net/novel/show.php?id=${book.id}`}
					target="_blank"
					rel="noreferrer"
				>{`https://www.pixiv.net/novel/show.php?id=${book.id}`}</a>
			</p>
			<hr className="ts-divider" />
			<div
				style={{
					overflowWrap: 'anywhere',
					fontSize: `${setting.fontSize}px`,
					lineHeight: setting.lineHeight,
					letterSpacing: `${setting.letterSpacing}px`,
				}}
			>
				{book.content.split('\n').map((text, index) => (
					<p className="ts-text" key={index}>
						{text}
					</p>
				))}
			</div>
			{book.err ? <pre>{JSON.stringify(book.err, null, 2)}</pre> : null}
		</>
	)
}
