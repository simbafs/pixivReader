import Head from 'next/head'
import { useState } from 'react'
import { book } from '@/lib/novel'

export default function Home() {
	const [id, setID] = useState('')
	const [book, setBook] = useState<book | null>(null)
	const [err, setErr] = useState<any>(null)
	const [loading, setLoading] = useState(false)

	const handleGet = () => {
		setLoading(true)
		setErr(null)
		fetch(`/api/novel?id=${id}`)
			.then(res => res.json())
			.then(res => {
				if (res.error) return setErr(res.message)
				setBook(res.book)
				setErr(null)
			})
			.catch(err => setErr(err))
			.finally(() => {
				setLoading(false)
			})
	}

	return <>
		<Head>
			<title>Pixiv Novel Reader</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
		<main>
			<input
				type="text"
				value={id}
				onChange={e => setID(e.target.value)}
			/>
			<button onClick={handleGet}>Get</button>
			{err
				? <pre>Error: {JSON.stringify(err, null, 2)}</pre>
				: loading
					? <h1>Loaing...</h1>
					: <Book book={book}
					/>}
		</main>
	</>

}

function Book({ book }: { book: book | null }) {
	if (!book) return null
	return <>
		<h1>{book.title}</h1>
		<p>{book.tags.join(', ')}</p>
		<p>{book.description}</p>
		<hr />
		<div style={{ overflowWrap: 'anywhere', }}>
			{book.content.split('\n').map((text, index) => <p
				key={index}
			>{text}</p>)}
		</div>
		{book.err ? <pre>{JSON.stringify(book.err, null, 2)}</pre> : null}
	</>
}
