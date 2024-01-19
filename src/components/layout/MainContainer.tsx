import { CONTAINER_MAX_WIDTH } from '@/configs/theme'
import { Box, BoxProps } from '@chakra-ui/react'
import React from 'react'

interface Props extends BoxProps {}

export default function MainContainer(props: Props) {
	const { children } = props
	return (
		<Box
			flex={1}
			height={'100%'}
			maxW={{
				base: '100vw',
				lg: '95vw',
				xl: CONTAINER_MAX_WIDTH,
			}}
			{...props}
		>
			{children}
		</Box>
	)
}
