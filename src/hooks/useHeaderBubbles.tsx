'use client'

import { useAuthContext } from '@/context/auth.context'
import useAuthenticatedAxios from './useAxios'
import { useState, useEffect } from 'react'
import { ConversationData } from '@/firebase/service/conversations/conversations.types'

const useHeaderBubbles = () => {
	const {
		authState: { user },
	} = useAuthContext()

	const axiosInstance = useAuthenticatedAxios()

	const [bubbles, setBubbles] = useState({
		messages: false,
		//add others here
	})

	useEffect(() => {
		if (user) {
			const getConversations = async () => {
				if (user) {
					if (!axiosInstance) {
						return null
					}

					const {
						data: { conversations: userConversations },
					}: {
						data: { conversations: ConversationData[] }
					} = await axiosInstance.get(`/conversations`)

					setBubbles((prev) => ({
						...prev,
						messages: userConversations.some(
							(conversation) => conversation?.unread_messages !== 0,
						),
					}))
				}
			}

			getConversations()
		}
	}, [user, axiosInstance])

	return { bubbles }
}

export default useHeaderBubbles
