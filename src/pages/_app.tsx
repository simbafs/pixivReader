import type { AppProps } from 'next/app'
import localFont from 'next/font/local'
import '../styles/globals.css'

const jfHuninn = localFont({ src: '../../public/jf-openhuninn-1.1.woff2' })

export default function App({ Component, pageProps }: AppProps) {
	return (
		<div className={jfHuninn.className}>
			<Component {...pageProps} />
		</div>
	)
}
