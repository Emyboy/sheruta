import MainBackHeader from '@/components/atoms/MainBackHeader'
import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { DEFAULT_PADDING, NAV_HEIGHT, SIDE_NAV_WIDTH } from '@/configs/theme'
import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import ConversationList from './components/ConversationList'
import MainBodyContent from '@/components/layout/MainBodyContent'
import MessageInput from './components/MessageInput'
import { HiChatBubbleBottomCenterText } from 'react-icons/hi2'

type Props = {}

export default function MessagesPage({}: Props) {
	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={null}>
					<Flex flexDirection={'column'} w="full">
						<ConversationList />
					</Flex>
					<Flex
						p={DEFAULT_PADDING}
						minH={`calc(95vh - ${NAV_HEIGHT})`}
						justifyContent={'center'}
						alignItems={'center'}
					>
						<Flex
							flexDirection={'column'}
							alignItems={'center'}
							color={'dark_light'}
						>
							<HiChatBubbleBottomCenterText size={95} />
							<Text fontSize={'lg'}>Select a chat to get started</Text>
						</Flex>
					</Flex>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
