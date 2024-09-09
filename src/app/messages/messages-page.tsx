'use client'

import LoginCard from '@/components/atoms/LoginCard'
import MainContainer from '@/components/layout/MainContainer'
import MainHeader from '@/components/layout/MainHeader'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MobileNavFooter from '@/components/layout/MobileNavFooter'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import ConversationsService from '@/firebase/service/conversations/conversations.firebase'
import { ConversationData } from '@/firebase/service/conversations/conversations.types'
import { Box, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
	BiSolidMessageSquareDetail,
	BiSolidMessageSquareEdit,
} from 'react-icons/bi'
import EachConversation from './components/EachConversation'
import EachConversationLoading from './components/EachConversationLoading'

type Props = {}

export default function MessagesPage({}: Props) {
	const { authState } = useAuthContext()
	const { user } = authState
	const [conversations, setConversations] = useState<any[] | null>(null)

	useEffect(() => {
		if (user) {
			;(async () => {
				const conversationsWithParticipantsData =
					await ConversationsService.forUser(user._id)
				setConversations(conversationsWithParticipantsData)
			})()
		}
	}, [user])

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<>
						{!user && <LoginCard Icon={BiSolidMessageSquareDetail} />}
						{!conversations &&
							user &&
							new Array(9).fill(null).map((_: any) => {
								return <EachConversationLoading key={Math.random()} />
							})}
						{
							<Box pb={NAV_HEIGHT}>
								{conversations &&
									conversations.map((val: ConversationData, index: any) => {
										return (
											<Link
												href={`/messages/${val.participants.find((x) => x._id !== user?._id)?._id}`}
												key={Math.random()}
											>
												<EachConversation data={val as any} />
												{/* <Divider bg='border_color' _dark={{
									bg: 'dark_light'
								}} /> */}
											</Link>
										)
									})}
							</Box>
						}
						{conversations && conversations.length === 0 ? (
							<Flex
								color="dark_light"
								gap={DEFAULT_PADDING}
								minH={'80vh'}
								justifyContent={'center'}
								flexDir={'column'}
								alignItems={'center'}
							>
								<BiSolidMessageSquareEdit size={90} />
								<Text fontSize={'xl'}>{`You don't have any conversation`}</Text>
							</Flex>
						) : null}
					</>
				</ThreeColumnLayout>
			</MainContainer>
			<MobileNavFooter />
		</Flex>
	)
}
