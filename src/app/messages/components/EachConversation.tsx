'use client'
import { DEFAULT_PADDING, SIDE_NAV_WIDTH } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { ConversationData } from '@/firebase/service/conversations/conversations.types'
import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import moment from 'moment'

type Props = {
	active?: boolean
	data: ConversationData
	hasUnread?: boolean
}

export default function EachConversation({ active, data, hasUnread }: Props) {
	const { authState } = useAuthContext()
	const { user } = authState

	const guest = data.participants.find(
		(participant) => participant._id !== user?._id,
	)

	return (
		<Flex
			bg={active ? 'dark_light' : 'none'}
			cursor={'pointer'}
			_hover={{
				bg: 'dark_light',
			}}
			minW={`calc(${SIDE_NAV_WIDTH} - ${DEFAULT_PADDING})`}
			p={DEFAULT_PADDING}
			alignItems={'center'}
			gap={3}
			// borderTop={'1px'}
			borderColor={'border_color'}
			_dark={{
				borderColor: 'dark_light',
			}}
		>
			<Avatar size={'sm'} src={guest?.avatar_url} />
			<Flex flex={1} alignItems={'center'}>
				<Flex flexDir={'column'} flex={1}>
					<Text textTransform={'capitalize'}>{guest?.first_name}</Text>
					<Text fontSize={'sm'} color="text_muted">
						{/* {new Date(data.updatedAt.nanoseconds)} */}
						{moment(data.updatedAt.toDate().toISOString()).fromNow()}
					</Text>
				</Flex>
				{hasUnread && <Box h={3} w={3} rounded={'full'} bg="brand" />}
			</Flex>
		</Flex>
	)
}
