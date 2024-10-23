'use client'
import { Flex, Text } from '@chakra-ui/react'
import React, { useEffect, useState, useRef } from 'react'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import { ConversationData } from '@/firebase/service/conversations/conversations.types'
import { DirectMessageData } from '@/firebase/service/messages/messages.types'
import EachMessageBobble from './components/EachMessageBobble/EachMessageBobble'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import useAuthenticatedAxios from '@/hooks/useAxios'
import { useQuery } from '@tanstack/react-query'

type Props = {
	isLoading?: boolean
	conversation: ConversationData
	// messages: DirectMessageData[] | undefined
	handleDelete: (message_id: string) => Promise<void>
}

const MessageList: React.FC<Props> = ({
	conversation,
	// messages,
	handleDelete,
}) => {
	const [page, setPage] = useState(1)
	const [messageList, setMessageList] = useState<DirectMessageData[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	const axiosInstance = useAuthenticatedAxios()

	// Ref for intersection observer to detect the top of the list
	const firstMessageRef = useRef<HTMLDivElement | null>(null)
	const topObserver = useRef<IntersectionObserver | null>(null)

	const { data: messages } = useQuery({
		queryKey: [conversation._id],
		queryFn: async () => {
			if (!axiosInstance) return []

			let allMessages: DirectMessageData[] = []
			let currentPage = 1
			let totalPages = 1 // Initialize totalPages to enter the loop

			// Fetch all pages of messages
			while (currentPage <= totalPages) {
				const {
					data: {
						data: { docs, totalPages: pages },
					},
				} = await axiosInstance.get(`/messages/${conversation._id}`, {
					params: { page: currentPage },
				})

				allMessages = [...allMessages, ...docs] // Collect all messages
				totalPages = pages // Update totalPages
				currentPage++ // Move to the next page
			}

			return allMessages.reverse() // Return the reversed messages
		},
		refetchOnWindowFocus: false,
		refetchInterval: 2000,
	})

	useEffect(() => {
		if (messages) {
			setMessageList(messages)
		}
	}, [messages])

	useEffect(() => {
		const MarkAllMessagesAsRead = async () => {
			try {
				if (!axiosInstance) return null
				await axiosInstance.put(`/messages/${conversation._id}`)
			} catch (err) {
				console.error('Error marking all messages as read:', err)
			}
		}

		MarkAllMessagesAsRead()
	}, [axiosInstance, conversation?._id])

	const loadOlderMessages = async () => {
		if (isLoading || !hasMore || !axiosInstance) return
		setIsLoading(true)

		try {
			let allMessages: DirectMessageData[] = []
			let currentPage = page
			let totalPages = 1 // Initialize totalPages to enter the loop

			// Fetch all pages of older messages
			while (currentPage <= totalPages) {
				const {
					data: {
						data: { docs, totalPages: pages },
					},
				} = await axiosInstance.get(
					`/messages/${conversation._id}?page=${currentPage}&limit=10`,
				)

				allMessages = [...allMessages, ...docs]
				totalPages = pages
				currentPage++
			}

			if (allMessages.length > 0) {
				setMessageList((prevMessages) => {
					const combinedMessages = [...allMessages, ...prevMessages]

					const uniqueMessagesMap = new Map(
						combinedMessages.map((message) => [message._id, message]),
					)
					return Array.from(uniqueMessagesMap.values()).reverse()
				})

				setPage(currentPage)
			} else {
				setHasMore(false)
			}
		} catch (error) {
			console.error('Failed to load more messages:', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (topObserver.current) topObserver.current.disconnect()

		topObserver.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasMore) {
				loadOlderMessages()
			}
		})

		if (firstMessageRef.current) {
			topObserver.current.observe(firstMessageRef.current)
		}

		return () => {
			if (topObserver.current) topObserver.current.disconnect()
		}
	}, [hasMore, isLoading])

	const setFirstMessageRef = (node: HTMLDivElement | null) => {
		firstMessageRef.current = node
		if (topObserver.current && node) topObserver.current.observe(node)
	}

	return (
		<Flex flexDir={'column'} gap={DEFAULT_PADDING} pb={NAV_HEIGHT}>
			{messageList.map((message: DirectMessageData, index) => (
				<EachMessageBobble
					key={message._id}
					message={message}
					handleDelete={handleDelete}
					ref={index === 0 ? setFirstMessageRef : null} // Assign the first message ref for loading older messages
				/>
			))}
			{messageList && messageList.length > 0 ? (
				<Flex justifyContent={'center'}>
					<Flex
						w={'70%'}
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
						fontSize={'sm'}
					>
						<HiOutlineInformationCircle size={17} />
						<Text>Tap on any message to see more options</Text>
					</Flex>
				</Flex>
			) : null}
			{isLoading && (
				<Flex justifyContent={'center'} py={4} _dark={{ color: 'text_muted' }}>
					<Text fontSize={'sm'}>Loading more messages...</Text>
				</Flex>
			)}
			{/* {!hasMore && (
				<Flex justifyContent={'center'} py={4} _dark={{ color: 'text_muted' }}>
					<Text fontSize={"sm"}>You have reached the end of the conversation.</Text>
				</Flex>
			)} */}
			<div id="end"></div> {/* Target for scrolling to the bottom */}
		</Flex>
	)
}

export default MessageList
