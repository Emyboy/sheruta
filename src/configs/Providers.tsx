// app/providers.tsx
'use client'

import { Box, ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { theme } from './theme'
import { AuthContextProvider } from '@/context/auth.context'
import AppLoading from '@/components/atoms/AppLoading'
import { AppContextProvider } from '@/context/app.context'

export function Providers({ children }: { children: React.ReactNode }) {
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
					>
						<AppLoading />
						{children}
					</Box>
				</AuthContextProvider>
			</AppContextProvider>
		</ChakraProvider>
	)
}
