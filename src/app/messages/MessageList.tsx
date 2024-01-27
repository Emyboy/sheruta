'use client'
import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MessageContainer from './components/MessageContainer/MessageContainer'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import {
	collection,
	doc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	where,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { useParams } from 'next/navigation'
import { ConversationData } from '@/firebase/service/conversations/conversations.types'
import { DirectMessageDTO } from '@/firebase/service/messages/messages.types'

type Props = {
	isLoading?: boolean
	conversation: ConversationData
}

export default function MessageList({ isLoading, conversation }: Props) {
	const [messageList, setMessageList] = useState<any[]>([])
	const params = useParams()
	const conversation_id = conversation._id

	useEffect(() => {
		;(async () => {
			const messagesRef = collection(db, DBCollectionName.messages);
			const q = query(
				messagesRef,
				where('_conversation_id', '==', conversation_id),
				orderBy('createdAt', 'asc'),
				limit(30),
			);
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const sortedMessages = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))
				setMessageList(sortedMessages)
				// console.log(sortedMessages)
			})

			return () => unsubscribe()

			// const querySnapshot = await getDocs(q)
			// const sortedMessages = querySnapshot.docs.map((doc) => ({
			// 	id: doc.id,
			// 	...doc.data(),
			// }))
			// setMessageList(sortedMessages)
		})()
	}, [])

	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING} pb={NAV_HEIGHT}>
			{messageList &&
				messageList.map((mgs: DirectMessageDTO, index) => {
					// return <MessageContainer key={Math.random()} />
					return <p key={Math.random()}>{mgs.message_text}</p>
				})}
		</Flex>
	)
}
