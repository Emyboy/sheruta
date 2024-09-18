'use client'

import AppLoading from '@/components/atoms/AppLoading'
import GetStarted from '@/components/info/GetStarted/GetStarted'
import MasterPopup from '@/components/popups/MasterPopup'
import { AppContextProvider } from '@/context/app.context'
import { AuthContextProvider } from '@/context/auth.context'
import { InspectionsProvider } from '@/context/inspections.context'
import { NotificationsProvider } from '@/context/notifications.context'
import { OptionsProvider } from '@/context/options.context'
import { Box, ChakraProvider, ColorModeScript } from '@chakra-ui/react'
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

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ChakraProvider theme={theme}>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<AppContextProvider>
				<AuthContextProvider>
					<OptionsProvider>
						<InspectionsProvider>
							<NotificationsProvider>
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
		</ChakraProvider>
	)
}
