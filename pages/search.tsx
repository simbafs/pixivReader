import useSWR from 'swr'
import Link from 'next/link'
import { useSessionStorage, useDebounce } from 'usehooks-ts'
import { SearchResult } from '@/pages/api/search'

function SearchBlock({ url }: { url: string }) {
	const { data, error } = useSWR(url, url => fetch(url).then(res => res.json()))

	if (!data) return <h1>Loading...</h1>
	if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>
	if (data.error) return <pre>Error: {JSON.stringify(data.body, null, 2)}</pre>
	return <SearchResultList result={data.body} />
}

function SearchResultList({ result }: { result: SearchResult[] | undefined }) {
	if (!result) return null
	return (
		<>
			{result.map((novel, index) => (
				<div key={index}>
					<div>
						<Link href={`/?id=${novel.id}`}>
							<h1>{novel.title}</h1>
						</Link>
						<p dangerouslySetInnerHTML={{ __html: novel.description }} />
						<p>{novel.tags.join(', ')}</p>
						<p>
							pixiv page:
							<a
								href={`https://www.pixiv.net/novel/show.php?id=${novel.id}`}
								target="_blank"
								rel="noreferrer"
							>{`https://www.pixiv.net/novel/show.php?id=${novel.id}`}</a>
						</p>
					</div>
					<hr />
				</div>
			))}
		</>
	)
}

export default function Search() {
	const [search, setSearch] = useSessionStorage('search', '')
	const [page, setPage] = useSessionStorage('page', 1)
	const [shoudTranslate, setShouldTranslate] = useSessionStorage('shouldTranslate', false)

	return (
		<>
			<fieldset>
				<legend>Search</legend>
				<label>Search: </label>
				<input type="text" value={search} onChange={e => setSearch(e.target.value)} />
				<label>Page: </label>
				<input type="number" value={page} onChange={e => setPage(+e.target.value)} min={1} />
				<label>Should Translate: </label>
				<input type="checkbox" checked={shoudTranslate} onChange={e => setShouldTranslate(e.target.checked)} />
			</fieldset>

			{useDebounce(<SearchBlock url={`/api/search?q=${search}&p=${page}&t=${shoudTranslate ? 1 : 0}`} />, 500)}
		</>
	)
}
