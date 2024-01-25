'use client'

//! DELETE THIS FILE
import MainBackHeader from '@/components/atoms/MainBackHeader'
import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { useAuthContext } from '@/context/auth.context'
import ConversationsService from '@/firebase/service/conversations/conversations.firebase'
import { useRouter } from 'next13-progressbar'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { generateConversationID } from '@/firebase/service/conversations/conversation.utils'

export default function NewConversation() {
	const params = useParams()
	const router = useRouter()
	const { user_id } = params
	const { authState } = useAuthContext()
	const { user } = authState

	useEffect(() => {
		if (user) {
			;(async () => {
				if (user_id == user._id) {
					return router.replace('/')
				}
				const conversationRef = collection(db, DBCollectionName.conversations)

				const qOwner = query(conversationRef, where('owner_id', '==', user_id))
				const qGuest = query(conversationRef, where('guest_id', '==', user_id))

				const ownerSnapshot = await getDocs(qOwner)
				const guestSnapshot = await getDocs(qGuest)

				// console.log({ owner: ownerSnapshot.empty, guest: guestSnapshot.empty })
				if (ownerSnapshot.empty || guestSnapshot.empty) {
					// create new conversation
					let _guest = await getDoc(
						doc(db, DBCollectionName.users, user_id as string),
					)
					let _user = await getDoc(
						doc(db, DBCollectionName.users, user?._id as string),
					)

					let theID = generateConversationID({
						guest_id: _guest.id,
						owner_id: _user.id,
					})
					await ConversationsService.create({
						conversation_id: theID,
						guest_ref: _guest.ref,
						owner_ref: _user.ref,
					})

					router.push(`/messages/${theID}`)
				} else {
					let list: any = []
					if (!ownerSnapshot.empty) {
						ownerSnapshot.forEach((conv) => list.push(conv))
						router.push(`/messages/${list[0].id}`)
					} else if (!guestSnapshot.empty) {
						guestSnapshot.forEach((conv) => list.push(conv))
						router.push(`/messages/${list[0].id}`)
					} else {
						router.push('/')
					}
					console.log('THE LIST::', list)
				}
			})()
		}
	}, [])

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainBackHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Flex justifyContent={'center'} alignItems={'center'} minH={'70vh'}>
						<Spinner color="text_muted" />
					</Flex>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
