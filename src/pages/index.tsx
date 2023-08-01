import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { book } from '@/lib/novel'

import Book from '@/component/book'

export default function Home() {
	const router = useRouter()
	const [id, setID] = useState('')
	const [book, setBook] = useState<book | null>(null)
	const [err, setErr] = useState<any>(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!router.query.id) return
		let id: string
		if (Array.isArray(router.query.id)) id = router.query.id[0]
		else id = router.query.id
		setID(id)
		handleGet(id)
	}, [router.query.id])

	const handleGet = (id: string, e?: React.FormEvent<HTMLFormElement>) => {
		e?.preventDefault()

		if (id === '') return

		if (!id.match(/^[0-9]+$/))
			id = id.match(/id=(?<id>[0-9]+)/)?.groups?.id || ''
		setID('')
		router.push(`/?id=${id}`)

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

	return (
		<>
			<Head>
				<title>Pixiv Novel Reader</title>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="min-h-screen p-2 flex flex-col bg-rose-50 text-gray-900 dark:bg-gray-900 dark:text-rose-50">
				<main className="grow">
					<form
						className="flex flex-wrap gap-1"
						onSubmit={e => handleGet(id, e)}
					>
						<input
							type="text"
							value={id}
							onChange={e => setID(e.target.value)}
							className="bg-rose-50 text-gray-900 dark:bg-gray-900 dark:text-rose-50 grow px-3 py-2 sm:text-sm shadow-sm placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md focus:ring-1"
						/>
						<button
							type="submit"
							className="bg-rose-50 text-gray-900 dark:bg-gray-900 dark:text-rose-50 px-3 py-2 sm:text-sm shadow-sm placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md focus:ring-1"
						>
							Get
						</button>
						<Link
							href="/list"
							className="bg-rose-50 text-gray-900 dark:bg-gray-900 dark:text-rose-50 inline-block px-3 py-2 sm:text-sm shadow-sm placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md focus:ring-1"
						>
							List
						</Link>
						<Link
							href="/search"
							className="bg-rose-50 text-gray-900 dark:bg-gray-900 dark:text-rose-50 inline-block px-3 py-2 sm:text-sm shadow-sm placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md focus:ring-1"
						>
							Search
						</Link>
					</form>
					{err ? (
						<pre>Error: {JSON.stringify(err, null, 2)}</pre>
					) : loading ? (
						<h1>Loading...</h1>
					) : (
						<Book book={book} />
					)}
				</main>
				<footer className="h-8">
					本網站使用{' '}
					<a
						href="https://justfont.com/huninn/"
						className="text-blue-500 underline hover:underline-offset-0"
					>
						jf 粉圓體
					</a>
				</footer>
			</div>
		</>
	)
}
