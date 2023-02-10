import Head from 'next/head'
import { useEffect, useState } from 'react'
import { book } from '@/lib/novel'
import Setting, { SettingOptions, defaultSetting } from '@/component/setting'

export default function Home() {
	const [id, setID] = useState('')
	const [book, setBook] = useState<book | null>(null)
	const [err, setErr] = useState<any>(null)
	const [loading, setLoading] = useState(false)

	const [setting, setSetting] = useState<SettingOptions>(defaultSetting)

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

	const inputStyle = {
		borderColor: setting.color.hex,
		color: setting.color.hex,
		backgroundColor: setting.backgroundColor.hex,
	}

	return <>
		<Head>
			<title>Pixiv Novel Reader</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
		<main style={{
			minHeight: 'calc(100vh - 16px)',
			padding: '8px',
			color: setting.color.hex,
			backgroundColor: setting.backgroundColor.hex,
		}}>
			<input
				type="text"
				value={id}
				onChange={e => setID(e.target.value)}
				style={inputStyle}
			/>
			<button
				onClick={handleGet}
				style={inputStyle}
			>Get</button>
			<Setting
				setting={setting}
				setSetting={setSetting}
			/>
			{err
				? <pre>Error: {JSON.stringify(err, null, 2)}</pre>
				: loading
					? <h1>Loaing...</h1>
					: <Book book={book} setting={setting}
					/>
			}
		</main>
	</>

}

function Book({ book, setting }: { book: book | null, setting: SettingOptions }) {
	if (!book) return null
	return <>
		<h1>{book.title}</h1>
		<p>{book.tags.join(', ')}</p>
		<p>{book.description}</p>
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
