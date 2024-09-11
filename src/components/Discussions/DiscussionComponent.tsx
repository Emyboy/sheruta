'use client'

import {
	Box,
	VStack,
	Avatar,
	Text,
	Input,
	IconButton,
	Flex,
	Icon,
	InputGroup,
	InputRightElement,
	useColorModeValue,
	Circle,
} from '@chakra-ui/react'
import { DocumentReference, Timestamp, doc } from 'firebase/firestore'
import React, { useState, useEffect, useRef } from 'react'
import { v4 as generateUId } from 'uuid'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { db } from '@/firebase'
import { useAuthContext } from '@/context/auth.context'
import { BiCommentX, BiRepost, BiSend } from 'react-icons/bi'
import useCommon from '@/hooks/useCommon'
import {
	HostRequestData,
	userSchema,
} from '@/firebase/service/request/request.types'
interface DiscussionDTO {
	uuid: string | undefined
	_request_ref: DocumentReference | undefined
	_sender_ref: DocumentReference | undefined
	_receiver_ref?: DocumentReference | undefined //the userRef of the person you're replying to
	reply_to?: string | undefined //the message ID you're replying to
	nest_level: number //the message level limit is 3 levels
	message: string
	timestamp: Timestamp
	type: string
}
interface DiscussionData {
	id: string
	uuid: string
	_request_ref: HostRequestData
	_sender_ref: userSchema
	_receiver_ref?: userSchema
	reply_to?: string
	nest_level: number
	message: string
	timestamp: Timestamp
	type: string
}

function convertTimestampToTime(timestamp: {
	seconds: number
	nanoseconds: number
}): string {
	// Create a Date object using the seconds from the timestamp
	const date = new Date(timestamp.seconds * 1000) // Convert seconds to milliseconds

	// Get hours and minutes from the Date object
	let hours = date.getHours()
	const minutes = date.getMinutes()

	// Determine AM or PM
	const ampm = hours >= 12 ? 'PM' : 'AM'

	// Convert hours to 12-hour format
	hours = hours % 12
	hours = hours ? hours : 12 // the hour '0' should be '12'

	// Format minutes to always be two digits
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

	// Return the time in the format HH:MM AM/PM
	return `${hours}:${formattedMinutes}${ampm}`
}

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
}: {
	requestId: string | undefined
	discussions: DiscussionData[]
}) => {
	const [requestRef, setRequestRef] = useState<DocumentReference | undefined>(
		undefined,
	)

	const {
		authState: { flat_share_profile },
	} = useAuthContext()

	const [message, setMessage] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { showToast } = useCommon()
	const [isReplying, setIsReplying] = useState<boolean>(false)
	const [commentId, setCommentId] = useState<string | undefined>(undefined)
	const [userHandle, setUserHandle] = useState<string | undefined>(undefined)
	const [nestLevel, setNestLevel] = useState<number>(1)
	const [receiverRef, setReceiverRef] = useState<DocumentReference | undefined>(
		undefined,
	)

	const [formData, setFormData] = useState<DiscussionDTO>({
		uuid: generateUId(),
		_request_ref: requestRef,
		_sender_ref: undefined,
		message: '',
		timestamp: Timestamp.now(),
		nest_level: 1,
		type: 'comment',
	})

	//set senderRef and requestRef
	useEffect(() => {
		if (requestId && typeof flat_share_profile?._user_ref !== 'undefined') {
			const docRef = doc(db, DBCollectionName.flatShareRequests, requestId)
			setRequestRef(docRef)
			setFormData((prev) => ({
				...prev,
				_request_ref: docRef,
				_sender_ref: flat_share_profile?._user_ref,
			}))
		}
	}, [requestId, flat_share_profile])

	const handleNewComment = async () => {
		try {
			setIsLoading(true)

			if (message?.trim() === '') {
				return
			}

			const finalFormData = {
				...formData,
				message,
				nest_level: nestLevel,
			}

			if (isReplying && commentId) {
				finalFormData.reply_to = commentId
				finalFormData._receiver_ref = receiverRef
			}

			await SherutaDB.create({
				collection_name: DBCollectionName.messages,
				data: finalFormData,
				document_id: finalFormData.uuid as string,
			})

			setTimeout(() => {
				showToast({
					message: `Your ${isReplying ? 'reply' : 'comment'} has been posted successfully`,
					status: 'success',
				})
				window.location.reload()
			}, 1000)
		} catch (err: any) {
			console.log(err)
			showToast({
				message: `Your ${isReplying ? 'reply' : 'comment'} was not submitted`,
				status: 'error',
			})
			setIsLoading(false)
		}
	}

	const getCommentReplies = (commentId: string): DiscussionData[] =>
		discussions.filter((comment) => comment.reply_to === commentId) || []

	// Create a ref for the reply box
	const replyBoxRef = useRef<HTMLDivElement>(null)

	// Function to scroll into view
	const scrollToCommentInputBox = () => {
		if (replyBoxRef.current) {
			replyBoxRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	}

	return (
		<Box width="100%" overflowY={'scroll'}>
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
											scrollToCommentInputBox={scrollToCommentInputBox}
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

			{/* Reply Box */}
			<Box>
				<Box
					ref={replyBoxRef}
					// p={4}
					// bg="white"
					borderRadius="md"
					boxShadow="md"
					w="100%"
					mx="auto"
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
		</Box>
	)
}

const CommentComponent = ({
	comment,
	setUserHandle,
	setReceiverRef,
	setNestLevel,
	getCommentReplies,
	scrollToCommentInputBox,
	setIsReplying,
	setCommentId,
	commentId,
}: {
	comment: Record<string, any>
	setUserHandle: (arg: string) => void
	setReceiverRef: (arg: any) => void
	setNestLevel: (arg: number) => void
	scrollToCommentInputBox: () => void
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
								scrollToCommentInputBox()
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
								scrollToCommentInputBox={scrollToCommentInputBox}
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
										scrollToCommentInputBox={scrollToCommentInputBox}
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
							scrollToCommentInputBox={scrollToCommentInputBox}
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
	scrollToCommentInputBox,
	setUserHandle,
	setNestLevel,
	setReceiverRef,
	setIsReplying,
	setCommentId,
}: {
	reply: DiscussionData
	scrollToCommentInputBox: () => void
	setUserHandle: (prev: string) => void
	setNestLevel: (arg: number) => void
	setReceiverRef: (arg: any) => void
	setIsReplying: (arg: boolean) => void
	setCommentId: (arg: string) => void
}) => {
	const bgColor = useColorModeValue('#11171708', '#004b2e2b')

	const userName =
		reply?._sender_ref?.first_name + ' ' + reply?._sender_ref?.last_name

	const [marginLeft, setMarginLeft] = useState<string>('50px')

	useEffect(() => {
		if (reply.nest_level === 3) {
			setMarginLeft('100px')
		} else {
			setMarginLeft('50px')
		}
	}, [reply])

	return (
		<>
			<Box ml={marginLeft}>
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
									scrollToCommentInputBox()
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
