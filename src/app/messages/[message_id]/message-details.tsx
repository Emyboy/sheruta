'use client'
import MainBackHeader from '@/components/atoms/MainBackHeader'
import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import ConversationList from '../components/ConversationList'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import MainBodyContent from '@/components/layout/MainBodyContent'
import MessageInput from '../components/MessageInput'
import MessageList from '../MessageList'
import MessagesService from '@/firebase/service/messages/messages.firebase'
import { useParams } from 'next/navigation'

type Props = {}

export default function MessageDetails({}: Props) {
	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainBackHeader />}>
					<Flex flexDirection={'column'} w="full">
						<ConversationList />
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
