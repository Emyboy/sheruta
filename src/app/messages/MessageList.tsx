'use client'
import { Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import MessageContainer from './components/MessageContainer/MessageContainer'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { useParams } from 'next/navigation'

type Props = {}

export default function MessageList({ }: Props) {
	const [messageList, setMessageList] = useState<any[]>([])
	const params = useParams();

	useEffect(() => {
		let messageRef = collection(db, DBCollectionName.messages)
		onSnapshot(messageRef, (snapshot) => {
			let list: any[] = [];
			snapshot.docs.forEach(docs => {
				if(docs.id === params.message_id){
					list.push({ id: docs.id, ...docs.data() })
				}
			})
			console.log("UPDATE WAS MADE: ", list);
		});
		// onSnapshot(doc(db, DBCollectionName.messages, params.message_id as string), (doc) => {
		// 	const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
		// 	console.log(source, " data: ", doc.data());
		// });
	}, [])

	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING} pb={NAV_HEIGHT}>
			{new Array(13).fill(null).map(() => {
				return <MessageContainer key={Math.random()} />
			})}
		</Flex>
	)
}
