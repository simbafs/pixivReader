import { book } from '@/lib/novel'

export default function Book({ book }: { book: book | null }) {
	if (!book) return null
	return (
		<>
			<h1>{book.title}</h1>
			<p>{book.tags.join(', ')}</p>
			<p dangerouslySetInnerHTML={{ __html: book.description }} />
			<p>
				<span>pixiv page: </span>
				<a
					href={`https://www.pixiv.net/novel/show.php?id=${book.id}`}
					target="_blank"
					rel="noreferrer"
					className="text-blue-500 underline hover:underline-offset-0"
				>{`https://www.pixiv.net/novel/show.php?id=${book.id}`}</a>
			</p>
			<hr />
			<div className="overflow-clip text-3xl">
				{book.content.split('\n').map((text, index) => (
					<p key={index}>{text}</p>
				))}
			</div>
			{book.err ? <pre>{JSON.stringify(book.err, null, 2)}</pre> : null}
		</>
	)
}
