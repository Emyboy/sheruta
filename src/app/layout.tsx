import axiosInstance from '@/utils/custom-axios'
import type { Metadata } from 'next'
import 'react-advanced-cropper/dist/style.css'
import 'react-horizontal-scrolling-menu/dist/styles.css'
import 'react-loading-skeleton/dist/skeleton.css'
import { Providers } from '../configs/Providers'
import './globals.css'

export const metadata: Metadata = {
	title: 'Sheruta NG',
	description: 'Flat or space for share in lagos, abuja, lekki and more',
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { data, notifications } = (await fetchDependency()) || {
		data: {},
		notifications: { notifications: [] },
	}

	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
					rel="stylesheet"
				/>
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
				/>
			</head>
			<body>
				<Providers options={data?.options} user_data={data?.user_data} notifications={notifications}>
					{children}
				</Providers>
			</body>
		</html>
	)
}

const fetchDependency = async () => {
	try {
		const { data } = await axiosInstance.get(`/users/dependencies`)

		let notifications = { notifications: [] }
		if (data.user_data.user) {
			const { data } = await axiosInstance.get('/notifications')

			notifications = data.notifications
		}

		return { data, notifications }
	} catch (err) {
		console.error(err)
	}
}
