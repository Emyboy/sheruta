// app/providers.tsx
'use client'

import { Box, ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { theme } from './theme'
import { AuthContextProvider } from '@/context/auth.context'
import AppLoading from '@/components/atoms/AppLoading'
import { AppContextProvider } from '@/context/app.context'
import { Next13ProgressBar } from 'next13-progressbar'
import MasterPopup from '@/components/popups/MasterPopup'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { uuid } from 'uuidv4';


const CreditOptionsPopups = dynamic(
	() => import('@/components/popups/CreditOptionsPopups'),
	{
		ssr: false, // Only load on the client-side
	},
)

export function Providers({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		let exists = Cookies.get('did')
		if (!exists) {
			let did = uuid();
			Cookies.set('did', `sheruta::did::${did}::${Date.now()}`)
		}
	}, [])
	return (
		<ChakraProvider theme={theme}>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<AppContextProvider>
				<AuthContextProvider>
					<Box
						bg="white"
						_dark={{
							bg: 'dark',
						}}
						minH={'100vh'}
					>
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
				</AuthContextProvider>
			</AppContextProvider>
		</ChakraProvider>
	)
}
