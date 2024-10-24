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
import { useParams } from 'next/navigation'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { ConversationData } from '@/firebase/service/conversations/conversations.types'
import { useAuthContext } from '@/context/auth.context'
import moment from 'moment'
import { AuthUser } from '@/firebase/service/auth/auth.types'
import LoginCard from '@/components/atoms/LoginCard'
import { BiSolidMessageSquareDetail } from 'react-icons/bi'
import CreditInfo from '@/components/info/CreditInfo/CreditInfo'
import { creditTable } from '@/constants'
import usePayment from '@/hooks/usePayment'
import useAuthenticatedAxios from '@/hooks/useAxios'
import useCommon from '@/hooks/useCommon'
import { useQuery } from '@tanstack/react-query'
import { DirectMessageData } from '@/firebase/service/messages/messages.types'

type Props = {}

export default function MessageDetails({}: Props) {
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
			if (message_id && user) {
				// if (user && message_id && axiosInstance) {

				try {
					await Promise.all([createNewConversation(), getConversation()])
				} catch (error) {
					console.error('Error initiating conversation:', error)
				}
			}
		}

		// if (user && message_id && axiosInstance) {
		if (user && message_id) {
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
						<MainBackHeader
							image_url={theGuest?.avatar_url || null}
							isLoading={loading}
							heading={theGuest?.first_name || ''}
							customHeadingRoute={`/user/${theGuest?._id}`}
							subHeading={
								theGuest
									? `Last seen: ${moment(theGuest.last_seen).fromNow()}`
									: null
							}
						/>
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
	const { data: messageList, refetch } = useQuery({
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
	})

	const handleSubmit = async (message: string) => {
		try {
			if (!user?._id)
				return toast({
					status: 'error',
					title: 'please log in to message this person',
				})

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
				refetch(),
			])
		} catch (error) {
			console.log(error)
			toast({ title: 'error, please try again', status: 'error' })
		}
	}

	const handleDelete = async (message_id: string) => {
		try {
			await Promise.all([
				axiosInstance?.delete(`/messages/${message_id}`),
				refetch(),
			])
		} catch (error) {
			toast({ title: `Error deleting message`, status: 'error' })
		}
	}

	useEffect(() => {
		refetch()
	}, [conversation._id])

	return (
		<>
			<Box p={DEFAULT_PADDING}>
				<MessageList
					isLoading={isLoading}
					conversation={conversation}
					// messages={messageList}
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
