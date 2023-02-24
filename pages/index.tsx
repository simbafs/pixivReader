import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { book } from '@/lib/novel'

import Setting, { SettingOptions, defaultSetting } from '@/component/setting'
import Book from '@/component/book'
import { useLocalStorage, useSessionStorage} from 'usehooks-ts'

export default function Home() {
	const router = useRouter()
	const [id, setID] = useState('')
	const [book, setBook] = useState<book | null>(null)
	const [err, setErr] = useState<any>(null)
	const [loading, setLoading] = useState(false)

	const [setting, setSetting] = useLocalStorage<SettingOptions>('setting', defaultSetting)

	useEffect(() => {
		if (!router.query.id) return
		let id: string
		if (Array.isArray(router.query.id)) id = router.query.id[0]
		else id = router.query.id
		setID(id)
		handleGet(id)
	}, [router.query.id])

	// useEffect(() => {
	// 	document.querySelector(':root').
	// }, [setting.backgroundColor.hex])

	const handleGet = (id: string, e?: React.FormEvent<HTMLFormElement>) => {
		e?.preventDefault()

		if (!id.match(/^[0-9]+$/)) id = id.match(/id=(?<id>[0-9]+)/)?.groups?.id || ''

		if (id === '') return

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
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main
				style={{
					minHeight: 'calc(100vh - 16px - 20px)',
					padding: '8px',
				}}
			>
				<form onSubmit={e => handleGet(id, e)} className="ts-row is-compact">
					<div className="ts-input is-underlined">
						<input
							className="text"
							type="text"
							value={id}
							onChange={e => setID(e.target.value)}
							style={{
								backgroundColor: setting.backgroundColor.hex,
							}}
						/>
					</div>
					<button
						className="ts-button"
						type="submit"
						style={{
							borderColor: setting.backgroundColor.hex,
							backgroundColor: setting.backgroundColor.hex,
							color: setting.color.hex,
						}}
					>
						Get
					</button>
					<Setting setting={setting} setSetting={setSetting} />
					<Link href="/search">
						<button
							className="ts-button is-inverted"
							type="button"
							style={{
								borderColor: setting.backgroundColor.hex,
								backgroundColor: setting.backgroundColor.hex,
								color: setting.color.hex,
							}}
						>
							Search
						</button>
					</Link>
				</form>
				{err ? (
					<pre>Error: {JSON.stringify(err, null, 2)}</pre>
				) : loading ? (
					<h1>Loading...</h1>
				) : (
					<Book book={book} setting={setting} />
				)}
			</main>
			<footer style={{ height: '20px' }}>
				本網站使用 <a href="https://justfont.com/huninn/">jf 粉圓體</a>
			</footer>
		</>
	)
}
