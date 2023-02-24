import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { book } from '@/lib/novel';

import Setting, { SettingOptions, defaultSetting } from '@/component/setting';
import Book from '@/component/book';

export default function Home() {
	const router = useRouter();
	const [id, setID] = useState('');
	const [book, setBook] = useState<book | null>(null);
	const [err, setErr] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const [setting, setSetting] = useState<SettingOptions>(defaultSetting);

	useEffect(() => {
		if (!router.query.id) return;
		let id: string;
		if (Array.isArray(router.query.id)) id = router.query.id[0];
		else id = router.query.id;
		setID(id);
		handleGet(id);
	}, [router.query.id]);

	const handleGet = (id: string) => {
		setLoading(true);
		setErr(null);
		fetch(`/api/novel?id=${id}`)
			.then(res => res.json())
			.then(res => {
				if (res.error) return setErr(res.message);
				setBook(res.book);
				setErr(null);
			})
			.catch(err => setErr(err))
			.finally(() => {
				setLoading(false);
			});
	};

	const inputStyle = {
		borderColor: setting.color.hex,
		color: setting.color.hex,
		backgroundColor: setting.backgroundColor.hex,
	};

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
					color: setting.color.hex,
					backgroundColor: setting.backgroundColor.hex,
				}}
			>
				<input type="text" value={id} onChange={e => setID(e.target.value)} style={inputStyle} />
				<button onClick={() => handleGet(id)} style={inputStyle}>
					Get
				</button>
				<Setting setting={setting} setSetting={setSetting} />
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
	);
}
