import useSWR from 'swr'
import Link from 'next/link'
import { useSessionStorage, useDebounce } from 'usehooks-ts'
import { SearchResult } from '@/pages/api/search'

function SearchBlock({ url }: { url: string }) {
	const { data, error } = useSWR(url, url =>
		fetch(url).then(res => res.json())
	)

	if (!data) return <h1>Loading...</h1>
	if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>
	if (data.error)
		return <pre>Error: {JSON.stringify(data.body, null, 2)}</pre>
	return <SearchResultList result={data.body} />
}

function SearchResultList({ result }: { result: SearchResult[] | undefined }) {
	if (!result) return null
	return (
		<>
			{result.map((novel, index) => (
				<div key={index}>
					<div>
						<Link
							href={`/?id=${novel.id}`}
							className="text-blue-500 underline hover:underline-offset-0"
						>
							<h1>{novel.title}</h1>
						</Link>
						<p
							dangerouslySetInnerHTML={{
								__html: novel.description,
							}}
						/>
						<p>{novel.tags.join(', ')}</p>
						<p>
							<span>pixiv page: </span>
							<a
								href={`https://www.pixiv.net/novel/show.php?id=${novel.id}`}
								target="_blank"
								rel="noreferrer"
								className="text-blue-500 underline hover:underline-offset-0"
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
	const [shoudTranslate, setShouldTranslate] = useSessionStorage(
		'shouldTranslate',
		false
	)

	return (
		<div className="p-2 bg-rose-50 text-gray-900 dark:bg-gray-900 dark:text-rose-50 flex flex-col min-h-screen">
			<div className="grow">
				<div className="flex gap-2 flex-wrap">
					<div>
						<span className="inline-block px-3 py-2 sm:text-sm shadow-sm placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-l-md focus:ring-1">
							Search:{' '}
						</span>
						<input
							className="w-40 bg-rose-50 text-gray-900 dark:bg-gray-900 dark:text-rose-50 px-3 py-2 sm:text-sm shadow-sm placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-r-md focus:ring-1"
							type="text"
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
					</div>
					<div>
						<span className="inline-block px-3 py-2 sm:text-sm shadow-sm placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-l-md focus:ring-1">
							Page:{' '}
						</span>
						<input
							className="w-20 bg-rose-50 text-gray-900 dark:bg-gray-900 dark:text-rose-50 px-3 py-2 sm:text-sm shadow-sm placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-r-md focus:ring-1"
							type="number"
							value={page}
							onChange={e => setPage(+e.target.value)}
							min={1}
						/>
					</div>
					<div>
						<span className="inline-block px-3 py-2 sm:text-sm shadow-sm placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-l-md focus:ring-1">
							Should Translate:{' '}
						</span>
						<span className="inline-block px-3 py-2 sm:text-sm shadow-sm placeholder-slate-400 border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-r-md focus:ring-1">
							<input
								type="checkbox"
								checked={shoudTranslate}
								onChange={e =>
									setShouldTranslate(e.target.checked)
								}
							/>
						</span>
					</div>
				</div>

				{useDebounce(
					<SearchBlock
						url={`/api/search?q=${search}&p=${page}&t=${
							shoudTranslate ? 1 : 0
						}`}
					/>,
					500
				)}
			</div>
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
	)
}
