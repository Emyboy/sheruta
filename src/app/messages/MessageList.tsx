'use client'
import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MessageContainer from './components/MessageContainer/MessageContainer'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { useParams } from 'next/navigation'
import { ConversationData } from '@/firebase/service/conversations/conversations.types'

type Props = {
	isLoading?: boolean;
	conversation: ConversationData
}

export default function MessageList({ isLoading, conversation }: Props) {
	const [messageList, setMessageList] = useState<any[]>([])
	const params = useParams()

	useEffect(() => {
		const citiesRef = collection(db, DBCollectionName.messages);
		const q = query(citiesRef, where("_conversation_id", "==", "CA"));
	}, [])

	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING} pb={NAV_HEIGHT}>
			{new Array(13).fill(null).map(() => {
				return <MessageContainer key={Math.random()} />
			})}
		</Flex>
	)
}
