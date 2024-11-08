'use client'

import AppLoading from '@/components/atoms/AppLoading'
import GetStarted from '@/components/info/GetStarted/GetStarted'
import MasterPopup from '@/components/popups/MasterPopup'
import { AppContextProvider } from '@/context/app.context'
import { AuthContextProvider, useAuthContext } from '@/context/auth.context'
import { InspectionsProvider } from '@/context/inspections.context'
import { NotificationsProvider } from '@/context/notifications.context'
import { OptionsProvider } from '@/context/options.context'
import { Box, ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { Next13ProgressBar } from 'next13-progressbar'
import { theme } from './theme'
import { BookmarksProvider } from '@/context/bookmarks.context'

const CreditOptionsPopups = dynamic(
	() => import('@/components/popups/CreditOptionsPopups'),
	{
		ssr: false,
	},
)

export function Providers({
	children,
	user_data,
	options,
	notifications,
}: {
	children: React.ReactNode
	user_data: any
	options: any
	notifications: any
}) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: false,
			},
		},
	})
	return (
		<ChakraProvider theme={theme}>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<SessionProvider>
				<QueryClientProvider client={queryClient}>
					<AppContextProvider>
						<AuthContextProvider user_data={user_data}>
							<OptionsProvider options={options}>
								<InspectionsProvider>
									<NotificationsProvider userNotifications={notifications}>
										<BookmarksProvider>
											<Box
												bg="white"
												_dark={{
													bg: 'dark',
												}}
												minH={'100vh'}
												userSelect={'none'}
											>
												<GetStarted />
												<CreditOptionsPopups />
												<MasterPopup />
												<AppLoading />
												<Next13ProgressBar
													height="4px"
													color="#00bc73"
													options={{ showSpinner: false }}
													showOnShallow
												/>
												{children}
											</Box>
										</BookmarksProvider>
									</NotificationsProvider>
								</InspectionsProvider>
							</OptionsProvider>
						</AuthContextProvider>
					</AppContextProvider>
				</QueryClientProvider>
			</SessionProvider>
		</ChakraProvider>
	)
}
