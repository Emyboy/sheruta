import { DEFAULT_PADDING, SIDE_NAV_WIDTH } from '@/configs/theme'
import { Avatar, Flex, Text } from '@chakra-ui/react'
import React from 'react'

type Props = {
	active?: boolean
}

export default function EachConversation({ active }: Props) {
	return (
		<Flex
			bg={active ? 'dark_light' : 'none'}
			cursor={'pointer'}
			_hover={{
				bg: 'dark_light',
			}}
			minW={`calc(${SIDE_NAV_WIDTH} - ${DEFAULT_PADDING})`}
			py={DEFAULT_PADDING}
			alignItems={'center'}
			gap={3}
			// borderTop={'1px'}
			borderColor={'border_color'}
			_dark={{
				borderColor: 'dark_light',
			}}
		>
			<Avatar size={'sm'} />
			<Flex flexDirection={'column'} flex={1}>
				<Text>The person name</Text>
				<Text fontSize={'sm'} color="text_muted">
					20 minutes ago
				</Text>
			</Flex>
		</Flex>
	)
}
