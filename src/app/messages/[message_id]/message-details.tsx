'use client'
import MainBackHeader from '@/components/atoms/MainBackHeader'
import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import MainBodyContent from '@/components/layout/MainBodyContent'
import MessageInput from '../components/MessageInput'
import MessageList from '../MessageList'
import MessagesService from '@/firebase/service/messages/messages.firebase'
import { useParams } from 'next/navigation'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { ConversationData } from '@/firebase/service/conversations/conversations.types'
import ConversationsService from '@/firebase/service/conversations/conversations.firebase'
import { useAuthContext } from '@/context/auth.context'
import moment from 'moment'

type Props = {}

export default function MessageDetails({}: Props) {
	const { authState } = useAuthContext()
	const { user } = authState
	const { message_id } = useParams()
	const [conversation, setConversation] = useState<null | ConversationData>(
		null,
	)

	useEffect(() => {
		;(async () => {
			if (message_id) {
				try {
					let conversationData = await ConversationsService.get(
						message_id as string,
					)
					console.log('CONVERSATION', conversationData)
					setConversation(conversationData as ConversationData)
				} catch (error) {
					console.error('Error fetching conversation and participants:', error)
				}
			}
		})()
	}, [])

	const theGuest = conversation?.participants.find(
		(participant) => participant._id !== user?._id,
	)

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout
					header={
						<MainBackHeader
							image_url={theGuest?.avatar_url}
							isLoading={!conversation ? true : false}
							heading={theGuest?.first_name}
							subHeading={
								'Last seen: ' +
								moment(theGuest?.last_seen.toDate().toISOString()).fromNow()
							}
						/>
					}
				>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<MessageSection />
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}

const MessageSection = () => {
	const params = useParams()
	const handleSubmit = async (message: string) => {
		MessagesService.sendDM({
			message,
			conversation_id: params?.message_id as string,
			recipient_id: `SrqotDsbOxcGA7lzhUEzFXDYgz63`,
		})
	}

	return (
		<>
			<Box p={DEFAULT_PADDING}>
				<MessageList />
				<Flex
					zIndex={50}
					justifyContent={'center'}
					position={'fixed'}
					// left={0}
					right={0}
					w={{
						md: `calc(100% - 60px)`,
						lg: 'full',
					}}
					bottom={0}
				>
					<MainContainer
						display={'flex'}
						justifyContent={'center'}
						bg="white"
						alignItems={'center'}
						borderBottom={'1px'}
						borderColor={'border_color'}
						_dark={{ borderColor: 'dark_light', bg: 'dark' }}
					>
						<MainBodyContent
							h={NAV_HEIGHT}
							borderTop={'1px'}
							borderColor={'border_color'}
							_dark={{
								borderColor: 'dark_light',
							}}
						>
							<MessageInput onSubmit={handleSubmit} />
						</MainBodyContent>
					</MainContainer>
				</Flex>
			</Box>
		</>
	)
}
