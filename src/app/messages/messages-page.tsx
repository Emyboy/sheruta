'use client'
import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import MainBackHeader from '@/components/atoms/MainBackHeader'
import EachConversationLoading from './components/EachConversationLoading'
import {
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

type Props = {}

export default function MessagesPage({}: Props) {
	const { authState } = useAuthContext()
	const { user } = authState
	const [conversations, setConversations] = useState<any[] | null>(null)

	useEffect(() => {
		if (user) {
			;(async () => {
				const conversationsCollection = collection(
					db,
					DBCollectionName.conversations,
				)

				const q = query(
					conversationsCollection,
					where('participants_ids', 'array-contains', user?._id),
					limit(10),
					orderBy('updatedAt', 'desc'),
				)

				const conversationsSnapshot = await getDocs(q)

				const conversationsWithParticipants = conversationsSnapshot.docs.map(
					async (doc) => {
						const conversationData: any = { ...doc.data(), _id: doc.id }
						const participantRefs = conversationData?.participants_refs

						const participantsPromises = participantRefs.map(
							(participantRef: any) => getDoc(participantRef),
						)

						const participantDocs = await Promise.all(participantsPromises)
						const participants = participantDocs.map((participantDoc) =>
							participantDoc.data(),
						)

						return {
							...conversationData,
							participants,
						}
					},
				)

				const conversationsWithParticipantsData = await Promise.all(
					conversationsWithParticipants,
				)

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
							conversations.map((_: any, index: any) => {
								let id = crypto.randomUUID() + Date.now()
								return (
									<Link href={`/messages/${id}`} key={Math.random()}>
										<EachConversation data={_} />
										{/* <Divider bg='border_color' _dark={{
									bg: 'dark_light'
								}} /> */}
									</Link>
								)
							})}
					</>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
