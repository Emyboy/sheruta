'use client'
import { Flex, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import {
	collection,
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
import { DirectMessageData } from '@/firebase/service/messages/messages.types'
import EachMessageBobble from './components/EachMessageBobble/EachMessageBobble'
import { HiOutlineInformationCircle } from 'react-icons/hi2'

type Props = {
	isLoading?: boolean
	conversation: ConversationData
}

export default function MessageList({ isLoading, conversation }: Props) {
	const [messageList, setMessageList] = useState<any[]>([])
	const params = useParams()
	const conversation_id = conversation._id

	let goDown = () => {
		let theEnd = document.querySelector('#end')
		if (theEnd) {
			theEnd.scrollIntoView()
		}
	}

	useEffect(() => {
		;(async () => {
			const messagesRef = collection(db, DBCollectionName.messages)
			const q = query(
				messagesRef,
				where('_conversation_id', '==', conversation_id),
				orderBy('createdAt', 'asc'),
				limit(30),
			)
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const sortedMessages = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))
				setMessageList(sortedMessages)
				// console.log(sortedMessages)
				goDown()
			})

			return () => unsubscribe()
		})()
	}, [])

	useEffect(() => {
		if (messageList && messageList.length > 4) {
			goDown()
		}
	}, [messageList])

	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING} pb={NAV_HEIGHT}>
			{messageList &&
				messageList.map((message: DirectMessageData, index) => {
					return <EachMessageBobble key={Math.random()} message={message} />
				})}
			{messageList && messageList.length > 0 ? (
				<Flex justifyContent={'center'}>
					<Flex
						w={'70%'}
						p={2}
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
						fontSize={'xs'}
					>
						<HiOutlineInformationCircle size={17} />
						<Text>Tap on any message to see more options</Text>
					</Flex>
				</Flex>
			) : null}
		</Flex>
	)
}
