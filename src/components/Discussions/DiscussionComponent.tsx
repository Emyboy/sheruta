'use client'

import {
	Box,
	VStack,
	Avatar,
	Text,
	HStack,
	Button,
	Input,
	IconButton,
	Flex,
	Icon,
	InputGroup,
	InputRightElement,
	useColorModeValue,
	Circle,
} from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { DocumentReference, Timestamp, doc } from 'firebase/firestore'
import React, { useState, useEffect, useRef } from 'react'
// import { randomUUID } from 'crypto';
import { v4 as generateUId } from 'uuid'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { db } from '@/firebase'
import { useAuthContext } from '@/context/auth.context'
import { BiCommentX, BiRepost, BiSend } from 'react-icons/bi'
import useCommon from '@/hooks/useCommon'

interface DiscussionDTO {
	uuid: string | undefined
	// request_id: string,
	_request_ref: DocumentReference | undefined
	_user_ref: DocumentReference | undefined
	reply_to?: string | undefined
	message: string
	timestamp: Timestamp
	type: string
}

enum CommentType {
	reply = 'reply',
	parentComment = 'parentComment'

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
		<Flex flexDir={"column"} justifyContent={"center"} width="100%" minH="100dvh">
			<Flex alignItems={"center"} flexDir={"column"} gap="10px">
				<Circle borderRadius={"full"} bgColor={circleBgColor} minW={'100px'} minH={'100px'}>
					<Icon as={BiCommentX} w={16} h={16} color="green.400" />
				</Circle>
				<Flex gap="5px" alignItems={"center"} flexDir={"column"}>
					<Text fontWeight={"600"}>No Discusstions Yet</Text>
					<Text textAlign={"center"}>Be the first to start the discussion</Text>
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
	discussions: Record<string, any>
}) => {
	const [requestRef, setRequestRef] = useState<DocumentReference | undefined>(
		undefined,
	)
	console.log('discussions here', discussions)
	const {
		authState: { flat_share_profile },
	} = useAuthContext()

	// console.log(user_info)
	// flat_share_profile.
	const [message, setMessage] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { showToast } = useCommon()
	const [isReplying, setIsReplying] = useState<boolean>(false)
	const [commentId, setCommentId] = useState<string | undefined>(undefined)
	const [userHandle, setUserHandle] = useState<string | undefined>(undefined)

	const [formData, setFormData] = useState<DiscussionDTO>({
		uuid: generateUId(),
		// request_id: requestId as string,
		_request_ref: requestRef,
		_user_ref: undefined,
		// reply_to: undefined,
		message: '',
		timestamp: Timestamp.now(),
		type: 'comment',
	})

	useEffect(() => {
		if (requestId && typeof flat_share_profile?._user_ref !== 'undefined') {
			const docRef = doc(db, DBCollectionName.flatShareRequests, requestId)
			setRequestRef(docRef)
			setFormData((prev) => ({
				...prev,
				_request_ref: docRef,
				_user_ref: flat_share_profile?._user_ref,
			}))
		}
	}, [requestId, flat_share_profile])

	const handleNewComment = async () => {
		try {

			setIsLoading(true);

			if (message?.trim() === '') {
				return
			}

			const finalFormData = {
				...formData,
				message
			}

			if (isReplying && commentId) {
				finalFormData.reply_to = commentId
			}

			// console.log(finalFormData, isReplying, commentId, "about to send")
			// setIsLoading(false)
			// return

			// await SherutaDB.create({
			// 	collection_name: DBCollectionName.messages,
			// 	data: {
			// 		...formData,
			// 		message: reply,
			// 		reply_to: comment.id,
			// 	},
			// 	document_id: formData.uuid as string,
			// })


			await SherutaDB.create({
				collection_name: DBCollectionName.messages,
				data: finalFormData,
				document_id: finalFormData.uuid as string,
			})

			setTimeout(() => {
				showToast({
					message: "Your comment has been posted successfully",
					status: "success"
				})
				window.location.reload()
			}, 1000)

			// SherutaDB.update({
			//     collection_name: DBCollectionName.conversations,
			//     data: { updatedAt: serverTimestamp() },
			//     document_id: conversation_id,
			// })
		} catch (err: any) {
			console.log(err)
			setIsLoading(false);
		}
	}

	const getCommentReplies = (commentId: string) =>
		discussions.filter((comment: any) => comment.reply_to === commentId) || []

	// Create a ref for the component you want to scroll to
	const replyBoxRef = useRef<HTMLDivElement>(null)

	// Function to scroll into view
	const scrollToCommentInputBox = () => {
		if (replyBoxRef.current) {
			replyBoxRef.current.scrollIntoView({
				behavior: 'smooth', // Smooth scrolling animation
				block: 'start', // Align to the top of the container
			})
		}
	}

	return (
		<Box maxWidth="100%" p={4} overflowY={'scroll'}>
			<Box overflowY={'scroll'} minH={"100dvh"}>
				<VStack align="start" spacing={6} w="100%">
					{
						(!discussions?.length) ? <NoDiscussion /> : (discussions.map((singleComment: any) => {
							if (typeof singleComment?.reply_to !== 'string') {
								return (
									<React.Fragment key={singleComment.id}>
										<CommentComponent
											formData={formData}
											setUserHandle={setUserHandle}
											setIsLoading={setIsLoading}
											comment={singleComment}
											getCommentReplies={getCommentReplies}
											commentId={singleComment.id}
											// replies={getCommentReplies(singleComment?.id)}
											scrollToCommentInputBox={scrollToCommentInputBox}
											setIsReplying={setIsReplying}
											setCommentId={setCommentId}
										/>
									</React.Fragment>
								)
							} else {
								return null // Optionally render nothing if condition fails
							}
						}))
					}
				</VStack>
			</Box>

			{/* Input Section */}
			<Box
				ref={replyBoxRef}
				p={4}
				bg="white"
				borderRadius="md"
				boxShadow="md"
				w="100%"
				// maxW="md"
				mx="auto"
			>
				<InputGroup>
					{/* Input field */}
					<Input
						placeholder="Type message here"
						bg="#f9f9f9"
						border="none"
						borderRadius="md"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							const inputValue = e.target.value;

							if (isReplying) {
								// If input is cleared, don't prepend the userHandle
								if (inputValue.trim() === '') {
									setMessage('');
								} else if (!inputValue.startsWith(userHandle)) {
									// If the message doesn't already start with userHandle, prepend it
									setMessage(`${userHandle} ${inputValue}`);
								} else {
									// If the userHandle is already there, just update the message
									setMessage(inputValue);
								}
							} else {
								setMessage(inputValue);
							}
						}}
						value={isReplying ? (message.startsWith(userHandle) ? message : `${userHandle} ${message}`) : message}
						disabled={isLoading}
						_placeholder={{ color: "gray.400" }}
					/>

					{/* Send button */}
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
							_hover={{ bg: "gray.700" }}
						/>
					</InputRightElement>
				</InputGroup>
			</Box>
		</Box>
	)
}

const CommentComponent = ({
	comment,
	formData,
	setUserHandle,
	setIsLoading,
	getCommentReplies,
	// replies,
	scrollToCommentInputBox,
	setIsReplying,
	setCommentId,
	commentId
}: {
	comment: Record<string, any>
	formData: DiscussionDTO
	setUserHandle: (prev: string) => void
	setIsLoading: (arg: boolean) => void
	scrollToCommentInputBox: () => void
	setIsReplying: (arg: boolean) => void
	setCommentId: (arg: string | undefined) => void
	getCommentReplies: (arg: string) => []
	commentId: string
	// replies: any[]
}) => {
	// console.log(replies, 'replies hre')

	const replies = getCommentReplies(commentId)

	const userName =
		comment?._user_ref?.first_name + ' ' + comment?._user_ref?.last_name

	const [reply, setReply] = useState<string>('')
	const { showToast } = useCommon();

	const postNewReply = async () => {
		try {
			setIsLoading(true);

			if (reply?.trim() === '') {
				return
			}

			await SherutaDB.create({
				collection_name: DBCollectionName.messages,
				data: {
					...formData,
					message: reply,
					reply_to: comment.id,
				},
				document_id: formData.uuid as string,
			})

			setTimeout(() => {
				showToast({
					message: "Your reply has been posted successfully",
					status: "success"
				})
				window.location.reload()
			}, 1000)
		} catch (err: any) {
			console.log(err)
			setIsLoading(false);
		}
	}

	return (
		<>
			{/* First Comment */}
			<Box width="100%" borderRadius="md">
				<Flex flexDirection={'column'}>
					<Flex gap={'10px'}>
						<Avatar
							width={'50px'}
							alignSelf={'center'}
							name={userName}
							size="md"
						/>

						<Box
							width={'100%'}
							px={5}
							py={2}
							borderRadius={'lg'}
							border="1px"
							borderColor="#1117171A"
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

						{/* <Button onClick={() => setIsReplying(!isReplying)} size="sm" variant="link" colorScheme="gray" mt={2}>
                            reply
                        </Button> */}
					</Flex>

					<Box>
						<Flex
							px={5}
							py={3}
							gap={2}
							width={'100px'}
							ml={'50px'}
							cursor={'pointer'}
							onClick={() => {
								setUserHandle(`@${userName}`);
								setIsReplying(true)
								setCommentId(comment.id)
								scrollToCommentInputBox()
							}}
						>
							<Icon alignSelf={'center'} as={BiRepost} /> <Text>Reply</Text>
						</Flex>
					</Box>
				</Flex>
			</Box>


			{/* Reply Comment */}
			{/* <ReplyComponent reply={{a: 1}} /> */}

			{replies.map((singleReply: any) => {
				// Check if the reply is a sub-reply
				if (typeof singleReply?.reply_to === 'string') {
					const subReplies: any[] = getCommentReplies(singleReply.id);

					// Return the main reply along with its sub-replies
					return (
						<React.Fragment key={singleReply.id}>
							{subReplies.map((subReply: any) => (
								<ReplyComponent
									setIsReplying={setIsReplying}
									setCommentId={setCommentId}
									setUserHandle={setUserHandle}
									scrollToCommentInputBox={scrollToCommentInputBox}
									key={subReply.id}
									reply={subReply}
								/>
							))}
						</React.Fragment>
					);
				} else {
					// Return the main reply if it's not a sub-reply
					return (
						<ReplyComponent
							setIsReplying={setIsReplying}
							setCommentId={setCommentId}
							setUserHandle={setUserHandle}
							scrollToCommentInputBox={scrollToCommentInputBox}
							key={singleReply.id}
							reply={singleReply}
						/>
					);
				}
			})}


			{replies.map((singleReply: any) => {
				return <ReplyComponent setIsReplying={setIsReplying} setCommentId={setCommentId} setUserHandle={setUserHandle} scrollToCommentInputBox={scrollToCommentInputBox} key={singleReply.id} reply={singleReply} />
			})}
			{/* <Box
                    w="90%"
                    ml="10%"
                    border="1px"
                    borderColor="gray.200"
                    p={4}
                    borderRadius="md"
                >
                    <HStack align="start">
                        <Avatar
                            name="Stanley Obassii"
                            size="sm"
                            src="https://bit.ly/tioluwani-kolawole"
                        />
                        <VStack align="start" spacing={0}>
                            <Flex
                                justifyContent={'space-between'}
                                alignItems={'baseline'}
                                gap="15px"
                            >
                                <Text fontWeight="bold">Stanley Obassii</Text>
                                <Text fontSize="xs" color="gray.500">
                                    12:08PM
                                </Text>
                            </Flex>
                            <Text fontSize="sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                                consequat fringilla la dolor, non feugiat nunc fringilla non.
                                Sed a orci.
                            </Text>
                        </VStack>
                    </HStack>
                    <Button size="sm" variant="link" colorScheme="gray" mt={2}>
                        reply
                    </Button>
                </Box> */}
		</>
	)
}

const ReplyComponent = ({ reply, scrollToCommentInputBox, setUserHandle, setIsReplying, setCommentId }: {
	reply: Record<string, any>,
	scrollToCommentInputBox: () => void,
	setUserHandle: (prev: string) => void
	setIsReplying: (arg: boolean) => void
	setCommentId: (arg: string) => void
}) => {
	console.log(reply, "is here")

	const userName =
		reply?._user_ref?.first_name + ' ' + reply?._user_ref?.last_name

	return (
		<>
			<Box w="100%" ml="50px">
				<Flex flexDirection={'column'}>
					<Flex
						gap={'10px'}
					// justifyContent="flex-end"
					>
						<Avatar
							alignSelf={'center'}
							name={userName}
							size="md"
							src="https://bit.ly/tioluwani-kolawole"
						/>
						<Box
							px={5}
							py={2}
							width={'100%'}
							borderRadius={'lg'}
							// border="1px"
							// borderColor="#1117171A"
							bgColor={'#11171708'}
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
					<Box
					// onClick={() => setIsReplying(!isReplying)}
					>
						<Flex
							px={5}
							py={3}
							gap={2}
							width={'100px'}
							ml={'50px'}
							cursor={'pointer'}
							onClick={() => {
								console.log("I am replying to", reply);
								// return
								setUserHandle(`@${userName}`);
								setIsReplying(true)
								setCommentId(reply.id)
								scrollToCommentInputBox()
							}}
						>
							<Icon alignSelf={'center'} as={BiRepost} /> <Text>Reply</Text>
						</Flex>
					</Box>
				</Flex>
			</Box>
		</>
	)
}

export default DiscussionComponent
