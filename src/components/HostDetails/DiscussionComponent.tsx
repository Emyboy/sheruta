'use client'

import { useAuthContext } from '@/context/auth.context'
import { db } from '@/firebase'
import DiscussionService from '@/firebase/service/discussions/discussions.firebase'
import {
	DiscussionDTO,
	DiscussionData,
} from '@/firebase/service/discussions/discussions.types'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import NotificationsService, {
	NotificationsBodyMessage,
} from '@/firebase/service/notifications/notifications.firebase'
import useCommon from '@/hooks/useCommon'
import { revalidatePathOnClient } from '@/utils/actions'
import { convertTimestampToTime } from '@/utils/index.utils'
import {
	Avatar,
	Box,
	Circle,
	Flex,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	VStack,
	useColorModeValue,
} from '@chakra-ui/react'
import { DocumentReference, Timestamp, doc } from 'firebase/firestore'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BiCommentX, BiRepost, BiSend } from 'react-icons/bi'

const NoDiscussion = () => {
	const circleBgColor = useColorModeValue('#e4faa85c', '#e4faa814')

	return (
		<Flex
			flexDir={'column'}
			justifyContent={'center'}
			width="100%"
			minH="100dvh"
		>
			<Flex alignItems={'center'} flexDir={'column'} gap="10px">
				<Circle
					borderRadius={'full'}
					bgColor={circleBgColor}
					minW={'100px'}
					minH={'100px'}
				>
					<Icon as={BiCommentX} w={16} h={16} color="green.400" />
				</Circle>
				<Flex gap="5px" alignItems={'center'} flexDir={'column'}>
					<Text fontWeight={'600'}>No Discusstions Yet</Text>
					<Text textAlign={'center'}>Be the first to start the discussion</Text>
				</Flex>
			</Flex>
		</Flex>
	)
}

const DiscussionComponent = ({
	requestId,
	discussions,
	hostId,
}: {
	requestId: string
	discussions: DiscussionData[]
	hostId: string
}) => {
	const router = useRouter()

	const {
		authState: { flat_share_profile, user },
	} = useAuthContext()
	const pathname = usePathname()
	const { showToast } = useCommon()

	const [message, setMessage] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isReplying, setIsReplying] = useState<boolean>(false)
	const [commentId, setCommentId] = useState<string | undefined>(undefined)
	const [userHandle, setUserHandle] = useState<string | undefined>(undefined)
	const [nestLevel, setNestLevel] = useState<number>(1)
	const [receiverRef, setReceiverRef] = useState<DocumentReference | undefined>(
		undefined,
	)

	const handleNewComment = async () => {
		try {
			setIsLoading(true)

			if (!flat_share_profile || !user)
				return showToast({
					message: 'Please log in to discuss about the apartment',
					status: 'error',
				})

			if (message?.trim() === '') return

			const _request_ref = doc(
				db,
				DBCollectionName.flatShareRequests,
				requestId,
			)

			const finalFormData: DiscussionDTO = {
				uuid: crypto.randomUUID(),
				request_id: requestId,
				type: 'comment',
				_sender_ref: flat_share_profile._user_ref,
				timestamp: Timestamp.now(),
				nest_level: nestLevel,
				_request_ref,
				message,
			}

			if (isReplying && commentId) {
				finalFormData.reply_to = commentId
				finalFormData._receiver_ref = receiverRef
			}

			await Promise.all([
				DiscussionService.sendMessage(finalFormData),
				NotificationsService.create({
					collection_name: DBCollectionName.notifications,
					data: {
						is_read: false,
						type: isReplying ? 'comment_reply' : 'comment',
						message: isReplying
							? NotificationsBodyMessage.comment_reply
							: NotificationsBodyMessage.comment,
						recipient_id: hostId,
						sender_details: user
							? {
									id: user._id,
									first_name: user.first_name,
									last_name: user.last_name,
									avatar_url: user.avatar_url,
								}
							: null,
						action_url: `${pathname}?tab=Discussion`,
					},
				}),
			])

			setTimeout(() => {
				showToast({
					message: `Your ${isReplying ? 'reply' : 'comment'} has been posted successfully`,
					status: 'success',
				})
			}, 1000)
			router.push(pathname + '?tab=Discussion')
			// revalidatePathOnClient(pathname)
			setIsReplying(false)
			setMessage('')
		} catch (err: any) {
			console.log(err)
			showToast({
				message: `Your ${isReplying ? 'reply' : 'comment'} was not submitted`,
				status: 'error',
			})
		}
		setIsLoading(false)
	}

	const getCommentReplies = (commentId: string): DiscussionData[] =>
		discussions.filter((comment) => comment.reply_to === commentId) || []

	return (
		<Box gap={4} width="100%" overflowY={'scroll'} pos={'relative'}>
			<Box overflowY={'scroll'} minH={'50dvh'}>
				<VStack align="start" spacing={2} w="100%">
					{!discussions?.length ? (
						<NoDiscussion />
					) : (
						discussions.map((singleComment) => {
							if (typeof singleComment?.reply_to !== 'string') {
								return (
									<React.Fragment key={singleComment.id}>
										<CommentComponent
											setUserHandle={setUserHandle}
											setReceiverRef={setReceiverRef}
											setNestLevel={setNestLevel}
											comment={singleComment}
											getCommentReplies={getCommentReplies}
											commentId={singleComment.id as string}
											setIsReplying={setIsReplying}
											setCommentId={setCommentId}
										/>
									</React.Fragment>
								)
							} else {
								return null // Optionally render nothing if condition fails
							}
						})
					)}
				</VStack>
			</Box>

			<Box
				bg={{
					_dark: 'dark',
					_light: '#fff',
				}}
				pos={'fixed'}
				right={0}
				bottom={0}
				left={{ base: 0, lg: '50%' }}
				borderRadius="md"
				boxShadow="md"
				mx="auto"
				as="form"
				onSubmit={handleNewComment}
			>
				<InputGroup>
					<Input
						placeholder="Type message here"
						// bg="#f9f9f9"
						border="1px solid #ddd"
						borderRadius="md"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							const inputValue = e.target.value

							if (isReplying) {
								// If input is cleared, don't prepend the userHandle
								if (inputValue.trim() === '') {
									setMessage('')
								} else if (userHandle && !inputValue.startsWith(userHandle)) {
									// If the message doesn't already start with userHandle, prepend it
									setMessage(`${userHandle} ${inputValue}`)
								} else {
									// If the userHandle is already there, just update the message
									setMessage(inputValue)
								}
							} else {
								setMessage(inputValue)
								//user is not replying to any comment
								setNestLevel(1)
							}
						}}
						value={
							isReplying
								? userHandle && message.startsWith(userHandle)
									? message
									: `${userHandle} ${message}`
								: message
						}
						disabled={isLoading}
						_placeholder={{ color: 'gray.400' }}
					/>
					<InputRightElement py={5}>
						<IconButton
							onClick={handleNewComment}
							disabled={message.trim() === '' || isLoading}
							isLoading={isLoading}
							aria-label="Send message"
							icon={<BiSend />}
							bg="black"
							color="white"
							borderRadius="md"
							_hover={{ bg: 'gray.700' }}
						/>
					</InputRightElement>
				</InputGroup>
			</Box>
		</Box>
	)
}

const CommentComponent = ({
	comment,
	setUserHandle,
	setReceiverRef,
	setNestLevel,
	getCommentReplies,
	setIsReplying,
	setCommentId,
	commentId,
}: {
	comment: Record<string, any>
	setUserHandle: (arg: string) => void
	setReceiverRef: (arg: any) => void
	setNestLevel: (arg: number) => void
	setIsReplying: (arg: boolean) => void
	setCommentId: (arg: string | undefined) => void
	getCommentReplies: (arg: string) => DiscussionData[]
	commentId: string
}) => {
	const replies = getCommentReplies(commentId)

	const userName =
		comment?._sender_ref?.first_name + ' ' + comment?._sender_ref?.last_name

	const borderColor = useColorModeValue('#1117171A', '#006c42')

	return (
		<>
			{/* First Comment -> NEST LEVEL 1 */}
			<Box width="100%" borderRadius="md">
				<Flex flexDirection={'column'}>
					<Flex gap={'10px'}>
						<Avatar
							width={'50px'}
							alignSelf={'center'}
							name={userName}
							size="md"
							src={comment._sender_ref?.avatar_url}
						/>
						<Box
							width={'100%'}
							px={5}
							py={2}
							borderRadius={'lg'}
							border="1px"
							borderColor={borderColor}
						>
							<VStack align="start" spacing={0}>
								<Flex
									justifyContent={'space-between'}
									alignItems={'baseline'}
									gap="15px"
								>
									<Text fontWeight="bold">{userName}</Text>
									<Text fontSize="xs" color="gray.500">
										{convertTimestampToTime(comment?.timestamp)}
									</Text>
								</Flex>
								<Text fontSize="sm">{comment?.message}</Text>
							</VStack>
						</Box>
					</Flex>

					<Box>
						<Flex
							py={2}
							gap={2}
							width={'100px'}
							ml={'60px'}
							cursor={'pointer'}
							onClick={() => {
								setUserHandle(`@${userName}`)
								setIsReplying(true)
								setCommentId(comment.id)

								setNestLevel(2)
								setReceiverRef(comment._sender_ref)
							}}
						>
							<Icon alignSelf={'center'} as={BiRepost} /> <Text>Reply</Text>
						</Flex>
					</Box>
				</Flex>
			</Box>

			{/* Reply Comment */}
			{replies.map((singleReply) => {
				// Check if the reply is a sub-reply
				if (
					singleReply.nest_level >= 2 &&
					typeof singleReply?.reply_to === 'string'
				) {
					const subReplies = getCommentReplies(singleReply.id)
					// Return the main reply along with its sub-replies
					return (
						<React.Fragment key={singleReply.id}>
							<ReplyComponent
								setIsReplying={setIsReplying}
								setNestLevel={setNestLevel}
								setReceiverRef={setReceiverRef}
								setCommentId={setCommentId}
								setUserHandle={setUserHandle}
								key={singleReply.id}
								reply={singleReply}
							/>
							{subReplies
								// Step 1: Sort subReplies by timestamp (ascending)
								.sort((a: any, b: any) => {
									const timestampA = new Date(
										a.timestamp.seconds * 1000 +
											a.timestamp.nanoseconds / 1000000,
									)
									const timestampB = new Date(
										b.timestamp.seconds * 1000 +
											b.timestamp.nanoseconds / 1000000,
									)
									return timestampA.getTime() - timestampB.getTime() // Ascending order
								})
								// Step 2: Loop through sorted subReplies
								.map((subReply: any) => (
									<ReplyComponent
										setIsReplying={setIsReplying}
										setNestLevel={setNestLevel}
										setReceiverRef={setReceiverRef}
										setCommentId={setCommentId}
										setUserHandle={setUserHandle}
										key={subReply.id}
										reply={subReply}
									/>
								))}
						</React.Fragment>
					)
				} else {
					// Return the main reply if it's not a sub-reply
					return (
						<ReplyComponent
							setIsReplying={setIsReplying}
							setNestLevel={setNestLevel}
							setReceiverRef={setReceiverRef}
							setCommentId={setCommentId}
							setUserHandle={setUserHandle}
							key={singleReply.id}
							reply={singleReply}
						/>
					)
				}
			})}
		</>
	)
}

const ReplyComponent = ({
	reply,
	setUserHandle,
	setNestLevel,
	setReceiverRef,
	setIsReplying,
	setCommentId,
}: {
	reply: DiscussionData
	setUserHandle: (prev: string) => void
	setNestLevel: (arg: number) => void
	setReceiverRef: (arg: any) => void
	setIsReplying: (arg: boolean) => void
	setCommentId: (arg: string) => void
}) => {
	const bgColor = useColorModeValue('#11171708', '#004b2e2b')

	const userName =
		reply?._sender_ref?.first_name + ' ' + reply?._sender_ref?.last_name

	return (
		<>
			<Box ml={reply.nest_level < 3 ? `${reply.nest_level * 25}px` : '100px'}>
				<Flex flexDirection={'column'}>
					<Flex gap={'10px'}>
						<Avatar
							alignSelf={'center'}
							name={userName}
							size="md"
							src={reply._sender_ref?.avatar_url}
						/>
						<Box
							px={5}
							py={2}
							width={'100%'}
							borderRadius={'lg'}
							bgColor={bgColor}
						>
							<VStack align="start" spacing={0}>
								<Flex
									justifyContent={'space-between'}
									alignItems={'baseline'}
									gap="15px"
								>
									<Text fontWeight="bold">{userName}</Text>
									<Text fontSize="xs" color="gray.500">
										{convertTimestampToTime(reply?.timestamp)}
									</Text>
								</Flex>
								<Text fontSize="sm">{reply?.message}</Text>
							</VStack>
						</Box>
					</Flex>
					{reply?.nest_level <= 2 ? (
						<Box>
							<Flex
								py={2}
								gap={2}
								width={'100px'}
								ml={'60px'}
								cursor={'pointer'}
								// visibility={reply?.nest_level > 2 ? 'hidden' : 'visible'}
								onClick={() => {
									setUserHandle(`@${userName}`)
									setIsReplying(true)
									setCommentId(reply.id)
									setNestLevel(3)
									setReceiverRef(reply._sender_ref)
								}}
							>
								<Icon alignSelf={'center'} as={BiRepost} /> <Text>Reply</Text>
							</Flex>
						</Box>
					) : (
						<Box my={2}> </Box>
					)}
				</Flex>
			</Box>
		</>
	)
}

export default DiscussionComponent
