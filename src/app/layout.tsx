import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '../configs/Providers'
import 'react-loading-skeleton/dist/skeleton.css'

export const metadata: Metadata = {
	title: 'Sheruta NG',
	description: 'Flat or space for share in lagos, abuja, lekki and more',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
