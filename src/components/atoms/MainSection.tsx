import { DEFAULT_PADDING } from '@/configs/theme'
import { Flex, BoxProps, Text } from '@chakra-ui/react'
import React from 'react'

interface Props extends BoxProps {
	heading?: string
}

export default function MainSection(props: Props) {
	const { children, heading } = props
	return (
		<Flex
			flexDirection={'column'}
			as="section"
			p={DEFAULT_PADDING}
			borderBottom={'1px'}
			borderColor={'border_color'}
			_dark={{ borderColor: 'dark_light' }}
			{...props}
			gap={DEFAULT_PADDING}
		>
			{heading && (
				<Flex px={props.paddingX == 0 ? DEFAULT_PADDING : 0}>
					<Text
						fontWeight={'bold'}
						fontSize={'xl'}
						color="dark"
						_dark={{
							color: 'text_muted',
						}}
					>
						{heading}
					</Text>
				</Flex>
			)}
			{children}
		</Flex>
	)
}
