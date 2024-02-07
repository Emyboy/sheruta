'use client'
import MainBackHeader from '@/components/atoms/MainBackHeader'
import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import { Box, Flex, Spinner, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { DEFAULT_PADDING, NAV_HEIGHT } from '@/configs/theme'
import MainBodyContent from '@/components/layout/MainBodyContent'
import MessageInput from '../components/MessageInput'
import MessageList from '../MessageList'
import MessagesService from '@/firebase/service/messages/messages.firebase'
import { useParams } from 'next/navigation'
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

type Props = {}

export default function MessageDetails({}: Props) {
	const toast = useToast()
	const [_, paymentActions] = usePayment()
	const { authState } = useAuthContext()
	const { user } = authState
	const { message_id } = useParams()
	const [conversation, setConversation] = useState<null | ConversationData>(
		null,
	)
	const [loading, setLoading] = useState(true)

	const getConversation = async () => {
		if (user) {
			setLoading(true)
			let isOwner = await ConversationsService.get(
				generateConversationID({
					owner_id: message_id as string,
					guest_id: user._id,
				}),
			)
			let isGuest = await ConversationsService.get(
				generateConversationID({
					guest_id: message_id as string,
					owner_id: user._id,
				}),
			)

			if (isGuest) {
				setLoading(false)
				return setConversation(isGuest)
			} else if (isOwner) {
				setLoading(false)
				return setConversation(isOwner)
			} else {
				setLoading(false)
			}

			setLoading(false)
		}
	}

	useEffect(() => {
		;(async () => {
			if (message_id && user) {
				getConversation()
			}
		})()
	}, [user])

	const createNewConversation = async () => {
		if (
			(authState.flat_share_profile?.credits as number) >=
				creditTable.CONVERSATION &&
			user?._id !== message_id
		) {
			try {
				setLoading(true)
				let _owner = await getDoc(
					doc(db, DBCollectionName.users, user?._id as string),
				)
				let _guest = await getDoc(
					doc(db, DBCollectionName.users, message_id as string),
				)

				await ConversationsService.create({
					conversation_id: generateConversationID({
						guest_id: message_id as string,
						owner_id: user?._id as string,
					}),
					guest_ref: _guest.ref,
					owner_ref: _owner.ref,
				})

				await paymentActions.decrementCredit({
					amount: creditTable.CONVERSATION,
					user_id: user?._id as string,
				})

				getConversation()
			} catch (error) {
				setLoading(false)
				toast({ title: 'Error, please try again', status: 'error' })
			}
		} else {
			alert("You don't have enough credit")
		}
	}

	const theGuest = conversation?.participants.find(
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
							subHeading={
								theGuest
									? 'Last seen: ' +
										// moment(theGuest?.last_seen.toDate().toISOString()).fromNow()
										moment(theGuest?.last_seen.toDate().toISOString()).fromNow()
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
						{!loading && !conversation && user?._id !== message_id && (
							<CreditInfo
								credit={creditTable.CONVERSATION}
								onUse={createNewConversation}
							/>
						)}
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
	const { authState } = useAuthContext()
	const { user } = authState
	const toast = useToast()

	const handleSubmit = async (message: string) => {
		try {
			await MessagesService.sendDM({
				message,
				conversation_id: conversation._id,
				recipient_id: guest._id,
				user_id: user?._id as string,
			})
		} catch (error) {
			toast({ title: 'error, please try again', status: 'error' })
		}
	}

	return (
		<>
			<Box p={DEFAULT_PADDING}>
				<MessageList isLoading={isLoading} conversation={conversation} />
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
