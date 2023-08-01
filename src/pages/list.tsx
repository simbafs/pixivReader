import useSWR from 'swr'
import type { Data } from './api/list'
import Link from 'next/link'

export default function List() {
	const { data, error } = useSWR<Data, Error>('/api/list', url =>
		fetch(url).then(res => res.json())
	)

	return (
		<div className="min-h-screen p-2 flex flex-col bg-rose-50 text-gray-900 dark:bg-gray-900 dark:text-rose-50">
			<div className="grow">
				{error && <div>failed to load</div>}
				{!data && <div>loading...</div>}
				{data &&
					data.books.map((book, index) => (
						<>
							<Link href={`/?id=${book.id}`} key={index}>
								<div>
									<h1>{book.title}</h1>
									<p>{book.description}</p>
								</div>
							</Link>
							<hr />
						</>
					))}
			</div>
		</div>
	)
}
