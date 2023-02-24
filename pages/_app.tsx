import Head from 'next/head'
import type { AppProps } from 'next/app'
import localFont from '@next/font/local'

const jfHuninn = localFont({ src: '../public/jf-openhuninn-1.1.woff2' })

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tocas/4.1.0/tocas.min.css" />
				<script src="https://cdnjs.cloudflare.com/ajax/libs/tocas/4.1.0/tocas.min.js"></script>
			</Head>
			<div className={jfHuninn.className}>
				<Component {...pageProps} />
			</div>
		</>
	)
}
