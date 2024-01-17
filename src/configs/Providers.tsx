// app/providers.tsx
'use client'

import { Box, ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ChakraProvider theme={theme}>
			<Box bg="background">{children}</Box>
		</ChakraProvider>
	)
}
