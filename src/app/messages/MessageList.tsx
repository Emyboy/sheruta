'use client'
import { Flex, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { ConversationData } from '@/firebase/service/conversations/conversations.types'
import { DirectMessageData } from '@/firebase/service/messages/messages.types'
import EachMessageBobble from './components/EachMessageBobble/EachMessageBobble'
import { HiOutlineInformationCircle } from 'react-icons/hi2'

type Props = {
	isLoading?: boolean
	conversation: ConversationData
	messageList: DirectMessageData[] | undefined
	handleDelete: (message_id: string) => Promise<void>
}

export default function MessageList({ messageList, handleDelete }: Props) {
	let goDown = () => {
		let theEnd = document.querySelector('#end')
		if (theEnd) {
			theEnd.scrollIntoView()
		}
	}

	useEffect(() => {

		if (messageList && messageList.length) {
			goDown()
		}
	}, [messageList])

	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING} pb={NAV_HEIGHT}>
			{messageList &&
				messageList.map((message: DirectMessageData, index) => {
					return <EachMessageBobble key={Math.random()} message={message} handleDelete={handleDelete} />
				})}
			{messageList && messageList.length > 0 ? (
				<Flex justifyContent={'center'}>
					<Flex
						w={'70%'}
						alignItems={'center'}
						gap={3}
						justifyContent={'center'}
						border={'1px'}
						rounded={'md'}
						py="5"
						borderColor={'border_color'}
						_dark={{
							borderColor: 'dark_light',
							color: 'text_muted',
						}}
						mt="5"
						fontSize={'sm'}
					>
						<HiOutlineInformationCircle size={17} />
						<Text>Tap on any message to see more options</Text>
					</Flex>
				</Flex>
			) : null}
		</Flex>
	)
}
