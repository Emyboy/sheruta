import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { DirectMessageData } from '@/firebase/service/messages/messages.types'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import moment from 'moment'
import React, { useState } from 'react'
import { BiCheck, BiCheckDouble } from 'react-icons/bi'
import EachMessageOption from './EachMessageOption'

type Props = {
	message: DirectMessageData
}

export default function EachMessageBobble({ message }: Props) {
	const { authState } = useAuthContext()
	const user = authState.user
	const isUserOwn = message._sender_id === user?._id
	const [showOptions, setShowOptions] = useState(false)

	return (
		<>
			<EachMessageOption
				messageData={message}
				isOpen={showOptions}
				onClose={() => setShowOptions(false)}
			/>
			<Flex
				justifyContent={'space-between'}
				flexDir={isUserOwn ? 'row' : 'row-reverse'}
				rounded={'md'}
				width={'full'}
			>
				<div></div>
				<Flex
					onClick={() => setShowOptions(true)}
					_hover={{
						shadow: 'xl',
					}}
					cursor={'pointer'}
					maxW={'80%'}
					border={isUserOwn ? '0px' : '1px'}
					borderColor={'border_color'}
					_dark={{
						borderColor: 'dark_light',
					}}
					rounded={'lg'}
					p={DEFAULT_PADDING}
					bg={isUserOwn ? 'dark_light' : 'dark'}
					flexDirection={'column'}
					gap={DEFAULT_PADDING}
				>
					<Text
						textAlign={message.message_text.length > 20 ? 'justify' : 'end'}
					>
						{message.message_text}
					</Text>
					{/* <Flex
					fontSize={'xs'}
					color="text_muted"
					minW={!isUserOwn ? '' : '7rem'}
					justifyContent={'space-between'}
					alignItems={'center'}
				>
					<Text>
						{message?.createdAt
							? moment(message?.createdAt?.toDate()?.toISOString())?.fromNow()
							: 'just now'}
					</Text>
					<Box color={message.seen ? 'blue.400' : ''}>
						{isUserOwn && (
							<>
								{message.seen ? (
									<BiCheckDouble size={20} />
								) : (
									<BiCheck size={20} />
								)}
							</>
						)}
					</Box>
				</Flex> */}
				</Flex>
			</Flex>
		</>
	)
}
