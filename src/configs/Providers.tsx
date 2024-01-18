// app/providers.tsx
'use client'

import { Box, ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme'
import { AuthContextProvider } from '@/context/auth.context'
import AppLoading from '@/components/atoms/AppLoading'
import { AppContextProvider } from '@/context/app.context'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ChakraProvider theme={theme}>
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
