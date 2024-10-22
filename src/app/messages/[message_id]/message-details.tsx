'use client'

import MainBackHeader from '@/components/atoms/MainBackHeader'
import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex, Link, Spinner, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import MainBodyContent from '@/components/layout/MainBodyContent'
import MessageInput from '../components/MessageInput'
import MessageList from '../MessageList'
import MessagesService from '@/firebase/service/messages/messages.firebase'
import { useParams, useRouter } from 'next/navigation'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { ConversationData } from '@/firebase/service/conversations/conversations.types'
import ConversationsService from '@/firebase/service/conversations/conversations.firebase'
import { useAuthContext } from '@/context/auth.context'
import moment from 'moment'
import { AuthUser } from '@/firebase/service/auth/auth.types'
import { generateConversationID } from '@/firebase/service/conversations/conversation.utils'
import LoginCard from '@/components/atoms/LoginCard'
import { BiSolidMessageSquareDetail } from 'react-icons/bi'
import CreditInfo from '@/components/info/CreditInfo/CreditInfo'
import { creditTable } from '@/constants'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import usePayment from '@/hooks/usePayment'
import NotificationsService, {
	NotificationsBodyMessage,
} from '@/firebase/service/notifications/notifications.firebase'
import useAuthenticatedAxios from '@/hooks/useAxios'
import { DirectMessageData } from '@/firebase/service/messages/messages.types'
import useCommon from '@/hooks/useCommon'
import { useQuery } from '@tanstack/react-query'

type Props = {}

export default function MessageDetails({ }: Props) {
	const toast = useToast()
	const [_, paymentActions] = usePayment()
	const {
		authState: { user, flat_share_profile },
	} = useAuthContext()
	const { message_id } = useParams()
	const [conversation, setConversation] = useState<null | ConversationData>(
		null,
	)
	const [loading, setLoading] = useState(true)

	const axiosInstance = useAuthenticatedAxios()
	const { showToast } = useCommon()

	const getConversation = async () => {
		try {
			setLoading(true)

			if (!user) {
				return
			}

			if (!axiosInstance) {
				toast({
					title: 'Session not ready. Please try again later.',
					status: 'warning',
				})
				return
			}
			const {
				data: { data: isOwner },
			}: {
				data: { data: ConversationData }
			} = await axiosInstance.get(`/conversations/${message_id}`)

			setConversation(isOwner)
		} catch (err) {
			console.log(err)
			showToast({
				message: 'Error fetching conversation',
				status: 'error',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const initiateConversation = async () => {
			if (axiosInstance && message_id && user) {
				try {
					await createNewConversation()
					await getConversation()
				} catch (error) {
					console.error('Error initiating conversation:', error)
				}
			}
		}

		if (user && message_id && axiosInstance) {
			console.log(axiosInstance)
			initiateConversation()
		}
	}, [user, message_id, axiosInstance])

	const createNewConversation = async () => {
		if (
			user &&
			// (flat_share_profile?.credits as number) >= creditTable.CONVERSATION &&
			user?._id !== message_id
		) {
			try {
				setLoading(true)
				if (!axiosInstance) {
					toast({
						title: 'Session not ready. Please try again later.',
						status: 'warning',
					})
					return
				}

				const {
					data: { data: _owner },
				}: {
					data: { data: ConversationData }
				} = await axiosInstance.post(`/conversations/${message_id}`)

				getConversation()
			} catch (error) {
				setLoading(false)
				toast({ title: 'Error, please try again', status: 'error' })
			} finally {
				setLoading(false)
			}
		} else {
			alert("You don't have enough credit")
		}
	}

	const theGuest = conversation?.members.find(
		(participant) => participant._id !== user?._id,
	)

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout
					header={
						<>
							<Link href={`/user/${theGuest?._id}`} _hover={{ textDecoration: "none" }}>
								<MainBackHeader
									image_url={theGuest?.avatar_url || null}
									isLoading={loading}
									heading={theGuest?.first_name || ''}
									subHeading={
										theGuest
											? `Last seen: ${moment(theGuest.last_seen).fromNow()}`
											: null
									}
								/>
							</Link>
						</>
					}
				>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Flex flexDirection={'column'}>
						{user && loading && !conversation && (
							<Flex
								justifyContent={'center'}
								minH={`calc(96vh - ${NAV_HEIGHT})`}
								alignItems={'center'}
							>
								<Spinner color="brand" />
							</Flex>
						)}

						{/* {!loading && !conversation && user?._id !== message_id && (
							<CreditInfo
								credit={creditTable.CONVERSATION}
								onUse={createNewConversation}
							/>
						)} */}

						{!user && <LoginCard Icon={BiSolidMessageSquareDetail} />}

						{conversation && user && (
							<MessageSection
								guest={theGuest as AuthUser}
								conversation={conversation as ConversationData}
								isLoading={loading}
							/>
						)}
					</Flex>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}

const MessageSection = ({
	guest,
	conversation,
	isLoading,
}: {
	guest: AuthUser
	conversation: ConversationData
	isLoading: boolean
}) => {
	const {
		authState: { user },
	} = useAuthContext()

	const toast = useToast()

	const axiosInstance = useAuthenticatedAxios()

	const router = useRouter()

	// const [messageList, setMessageList] = useState<DirectMessageData[]>([])

	// const getMessages = async () => {
	// 	if (!axiosInstance) return null

	// 	const {
	// 		data: {
	// 			data: { docs: messages },
	// 		},
	// 	}: {
	// 		data: { data: { docs: DirectMessageData[] } }
	// 	} = await axiosInstance.get(`/messages/${conversation._id}`)

	// 	setMessageList(messages.reverse())
	// }

	const { data: messageList, refetch } = useQuery({
		queryKey: ["testing", conversation._id], // Include conversation ID
		queryFn: async () => {
			const {
				data: {
					data: { docs },
				},
			} = await axiosInstance.get(`/messages/${conversation._id}`);
	
			return docs.reverse(); // Return the reversed messages
		},
		refetchOnWindowFocus: false,
		staleTime: 5000, // Data is considered fresh for 5 seconds
		refetchInterval: 5000, // Refetch every 5 seconds to check for new messages
	});

	const handleSubmit = async (message: string) => {
		try {
			if (!user?._id)
				return toast({
					status: 'error',
					title: 'please log in to message this person',
				})

			// Ensure axiosInstance is ready before making the request
			if (!axiosInstance) {
				toast({
					title: 'Session not ready. Please try again later.',
					status: 'warning',
				})
				return
			}

			await Promise.all([
				axiosInstance.post(`/messages/dm`, {
					content: message,
					conversation_id: conversation._id,
				}),
				// getMessages()
				refetch()
			])


			// await Promise.all([
			// 	MessagesService.sendDM({
			// 		message,
			// 		conversation_id: conversation._id,
			// 		recipient_id: guest._id,
			// 		user_id: user._id,
			// 	}),
			// 	NotificationsService.create({
			// 		collection_name: DBCollectionName.notifications,
			// 		data: {
			// 			is_read: false,
			// 			message: NotificationsBodyMessage.message,
			// 			recipient_id: guest._id,
			// 			sender_details: {
			// 				id: user._id,
			// 				avatar_url: user.avatar_url,
			// 				first_name: user.first_name,
			// 				last_name: user.last_name,
			// 			},
			// 			type: 'message',
			// 			action_url: `/messages/${user._id}`,
			// 		},
			// 	}),
			// ])
		} catch (error) {
			console.log(error)
			toast({ title: 'error, please try again', status: 'error' })
		}
	}

	const handleDelete = async (message_id: string) => {
		try {
			await Promise.all([
				axiosInstance?.delete(`/messages/${message_id}`),
				// getMessages(),
				refetch()
			])
		} catch (error) {
			toast({ title: `Error deleting message`, status: 'error' })
		}
	}

	useEffect(() => {
		// getMessages()
		refetch()
	}, [conversation._id])

	return (
		<>
			<Box p={DEFAULT_PADDING}>
				<MessageList
					isLoading={isLoading}
					conversation={conversation}
					messageList={messageList}
					handleDelete={handleDelete}
				/>
				<Flex
					zIndex={50}
					justifyContent={'center'}
					position={'fixed'}
					// left={0}
					right={0}
					w={{
						md: `calc(100% - 60px)`,
						lg: 'full',
					}}
					bottom={0}
				>
					<MainContainer
						display={'flex'}
						justifyContent={'center'}
						bg="white"
						alignItems={'center'}
						borderBottom={'1px'}
						borderColor={'border_color'}
						_dark={{ borderColor: 'dark_light', bg: 'dark' }}
					>
						<MainBodyContent
							h={NAV_HEIGHT}
							borderTop={'1px'}
							borderColor={'border_color'}
							_dark={{
								borderColor: 'dark_light',
							}}
						>
							<MessageInput onSubmit={handleSubmit} />
						</MainBodyContent>
					</MainContainer>
				</Flex>
			</Box>
		</>
	)
}
