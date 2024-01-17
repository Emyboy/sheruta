import { CONTAINER_MAX_WIDTH } from '@/configs/theme'
import { Box } from '@chakra-ui/react'
import React from 'react'

type Props = {}

export default function MainContainer({ children }: any) {
	return (
		<Box
			flex={1}
			height={'100%'}
			maxW={{
				base: '95vw',
				lg: CONTAINER_MAX_WIDTH,
			}}
		>
			{children}
		</Box>
	)
}
