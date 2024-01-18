import { BODY_WIDTH, DEFAULT_PADDING } from '@/configs/theme'
import { FlexProps, Flex } from '@chakra-ui/react'
import React from 'react'

interface Props extends FlexProps {
	children: React.ReactNode
}

export default function MainBodyContent(props: Props) {
	const { children } = props
	const value = {
		xl: BODY_WIDTH,
		lg: `calc(${BODY_WIDTH} - 50px)`,
		base: '100vw',
	}
	return (
		<Flex
			flex={1}
			id="body"
			flexDirection={'column'}
			minW={value}
			maxW={value}
			px={DEFAULT_PADDING}
			{...props}
		>
			{children}
		</Flex>
	)
}
