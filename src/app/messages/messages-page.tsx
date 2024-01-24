'use client'
import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Flex, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainBackHeader from '@/components/atoms/MainBackHeader'
import EachConversationLoading from './components/EachConversationLoading'
import {
	DocumentData,
	collection,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { useAuthContext } from '@/context/auth.context'
import Link from 'next/link'
import EachConversation from './components/EachConversation'
import { ConversationData } from '@/firebase/service/conversations/conversations.types'
import ConversationsService from '@/firebase/service/conversations/conversations.firebase'
import { BiSolidMessageSquareEdit } from 'react-icons/bi'
import { DEFAULT_PADDING } from '@/configs/theme'

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
				<ThreeColumnLayout
					header={
						<MainBackHeader
							heading="Conversations"
							subHeading="List of all your previous conversations"
						/>
					}
				>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<>
						{!conversations &&
							new Array(9).fill(null).map((_: any) => {
								return <EachConversationLoading key={Math.random()} />
							})}
						{conversations &&
							conversations.map((val: ConversationData, index: any) => {
								return (
									<Link href={`/messages/${val._id}`} key={Math.random()}>
										<EachConversation data={val as any} />
										{/* <Divider bg='border_color' _dark={{
									bg: 'dark_light'
								}} /> */}
									</Link>
								)
							})}
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
		</Flex>
	)
}
