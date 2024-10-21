import React from 'react'
import MessageDetails from './message-details'
import { ConversationData } from '@/firebase/service/conversations/conversations.types'
import axiosInstance from '@/utils/custom-axios'
import { generateConversationID } from '@/firebase/service/conversations/conversation.utils'

export default async function Page({
	params: { message_id },
}: {
	params: { message_id: string }
}) {
	// const {
	// 	data: { user_data },
	// } = await axiosInstance.get(`/users/dependencies`)

	// // console.log(user_data)

	// const user_id = user_data?.user?._id

	// const conversation = await fetchConversation({ message_id, user_id })

	// console.log(requests)

	return <MessageDetails />
}

// async function fetchConversation({ message_id, user_id }): Promise<any> {
// 	try {
// 		const {
// 			data: { data: isOwner },
// 		} = await axiosInstance.get(
// 			`/conversations/${user_id}`,
// 		)

// 		// const {
// 		// 	data: { data: isGuest },
// 		// } = await axiosInstance.get(
// 		// 	`/conversations/${generateConversationID({
// 		// 		guest_id: message_id as string,
// 		// 		owner_id: user_id,
// 		// 	})}`,
// 		// )

// 		return isOwner
// 	} catch (err) {
// 		console.error(err)
// 		return null
// 	}
// }
