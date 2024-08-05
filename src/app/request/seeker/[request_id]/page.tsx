'use client'

import SherutaDB from '@/firebase/service/index.firebase'
import { useEffect, useState } from 'react'
import { DocumentData, DocumentReference, getDoc } from 'firebase/firestore'

import MainContainer from '@/components/layout/MainContainer'
import ThreeColumnLayout from '@/components/layout/ThreeColumnLayout'
import {
	Box,
	Flex,
	Text,
	Button,
	IconButton,
	Badge,
	Heading,
	HStack,
	Tooltip,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	VStack,
	Icon,
	useColorMode,
	Avatar,
} from '@chakra-ui/react'
import React from 'react'
import MainLeftNav from '@/components/layout/MainLeftNav'
import { DEFAULT_PADDING } from '@/configs/theme'
import MainHeader from '@/components/layout/MainHeader'
import { useRouter } from 'next/navigation'
import {
	BiBookmark,
	BiDotsHorizontalRounded,
	BiEnvelope,
	BiMap,
	BiMessageRoundedDetail,
	BiPencil,
	BiPhone,
	BiShare,
	BiSolidBadgeCheck,
	BiTrash,
} from 'react-icons/bi'
import { FaAngleLeft } from 'react-icons/fa'
import { useAuthContext } from '@/context/auth.context'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { capitalizeString, timeAgo } from '@/utils/index.utils'
import useCommon from '@/hooks/useCommon'

interface PageParams {
	[key: string]: string | undefined
}
interface Props {
	[key: string]: any
}

const getDataFromRef = async (docRef: DocumentReference): Promise<any> => {
	const recordSnap = await getDoc(docRef)
	return recordSnap.exists() ? recordSnap.data() : null
}

const Post = ({ postData, isLoading, setIsLoading, requestId }: Props) => {
	const { colorMode } = useColorMode()

	const { showToast } = useCommon()
	// Destructure
	const {
		updatedAt,
		description,
		google_location_text,
		_user_ref: userDoc,
		userInfoDoc,
		_service_ref: serviceTypeDoc,
		_location_keyword_ref: locationKeywordDoc,
		budget,
		payment_type,
		loggedInUser,
	} = postData || {}

	// Handle redirect
	const router = useRouter()

	const [isPostAdmin, setIsPostAdmin] = useState<boolean>(false)

	useEffect(() => {
		if (typeof loggedInUser !== 'undefined' && typeof userDoc !== 'undefined') {
			setIsPostAdmin(loggedInUser?._id === userDoc?._id)
		}
	}, [loggedInUser, userDoc])

	const generateShareUrl = (): void => {
		if (
			typeof window !== 'undefined' &&
			typeof window.navigator !== 'undefined'
		) {
			window.navigator.clipboard
				.writeText(window.location.href)
				.then(() => {
					showToast({
						message: 'Link has been copied successfully',
						status: 'info',
					})
				})
				.catch((err) => {
					showToast({
						message: 'Failed to copy the link',
						status: 'error',
					})
					console.error('Could not copy text: ', err)
				})
		}
	}

	const deletePost = async (): Promise<void> => {
		try {
			setIsLoading(true)

			if (isPostAdmin && requestId) {
				const deletePost = await SherutaDB.delete({
					collection_name: 'requests',
					document_id: requestId,
				})

				if (deletePost) {
					showToast({
						message: 'Post has been deleted successfully',
						status: 'success',
					})
					setTimeout(() => {
						router.replace('/')
					}, 1000)
				} else {
					showToast({
						message: 'Failed to delete the post',
						status: 'error',
					})
				}
			} else {
				showToast({
					message: 'You are not authorized to delete this post',
					status: 'error',
				})
			}
			setIsLoading(false)
		} catch (err: any) {
			console.error('Error deleting post:', err)
			showToast({
				message: 'Failed to delete the post',
				status: 'error',
			})
			setIsLoading(false)
		}
	}

	return (
		<>
			{typeof userDoc !== 'undefined' && Object.values(userDoc || {}).length ? (
				<>
					<Box>
						<Flex alignItems="center" justifyContent="space-between">
							<Flex alignItems="center">
								<Avatar
									size="lg"
									src={userDoc?.avatar_url || 'https://via.placeholder.com/150'}
								/>
								<Box ml={2}>
									<Heading as="h3" size="md">
										New Apartment
									</Heading>
									<Text
										fontWeight={'300'}
										fontSize="sm"
										color={colorMode === 'light' ? '#11171766' : '#ddd'}
									>
										Posted {timeAgo(updatedAt)}
									</Text>
								</Box>
							</Flex>
							<HStack flexWrap={'wrap'}>
								<Popover>
									<PopoverTrigger>
										<IconButton
											fontSize={'24px'}
											aria-label="Options"
											icon={<BiDotsHorizontalRounded />}
										/>
									</PopoverTrigger>
									<PopoverContent
										color={colorMode === 'dark' ? '#F0F0F0' : '#000'}
										bg={colorMode === 'dark' ? '#202020' : '#fff'}
										width={'100%'}
										padding={4}
									>
										<PopoverBody p={0}>
											<VStack spacing={2} align="flex-start">
												{isPostAdmin && (
													<Button
														variant="ghost"
														isLoading={isLoading}
														leftIcon={<BiPencil />}
														onClick={() => {
															router.push(`${requestId}/edit`)
														}}
														width="100%"
														display="flex"
														alignItems="center"
														padding={0}
														borderRadius="sm"
														_hover={{ color: 'brand_dark' }}
													>
														<Text width={'100%'} textAlign={'left'}>
															Edit
														</Text>
													</Button>
												)}
												<Button
													variant="ghost"
													isLoading={isLoading}
													leftIcon={<BiShare />}
													onClick={() => generateShareUrl()}
													width="100%"
													display="flex"
													alignItems="center"
													padding={0}
													borderRadius="sm"
													_hover={{ color: 'brand_dark' }}
												>
													<Text width={'100%'} textAlign={'left'}>
														Share
													</Text>
												</Button>
												{isPostAdmin && (
													<Button
														variant="ghost"
														isLoading={isLoading}
														leftIcon={<BiTrash />}
														onClick={() => deletePost()}
														width="100%"
														display="flex"
														alignItems="center"
														padding={0}
														borderRadius="sm"
														_hover={{ color: 'red.500' }}
														color="red.400"
													>
														<Text width={'100%'} textAlign={'left'}>
															Delete
														</Text>
													</Button>
												)}
											</VStack>
										</PopoverBody>
									</PopoverContent>
								</Popover>
								<IconButton
									fontSize={'24px'}
									aria-label="se"
									icon={<BiBookmark />}
								/>
							</HStack>
						</Flex>

						<Flex justifyContent={'space-between'} alignItems={'center'}>
							<Flex gap={2} mt={2} p={2} alignItems={'center'} color="#00BC73">
								<Text fontSize={'25px'}>
									<BiMap />
								</Text>{' '}
								<Text fontSize={'15px'}> {locationKeywordDoc?.name} </Text>
							</Flex>

							<Text>
								<Badge
									fontSize={'15px'}
									padding={'4.67px 9.35px 4.67px 9.35px'}
									textTransform={'capitalize'}
									bgColor={'#E4FAA866'}
									borderRadius={'15px'}
									variant="subtle"
									fontWeight={300}
								>
									{serviceTypeDoc?.title}
								</Badge>
							</Text>
						</Flex>

						<Text mt={5} mb={5} whiteSpace={'pre-wrap'}>
							{description}
						</Text>

						<HStack>
							<Flex
								flexWrap={'wrap'}
								width={'100%'}
								direction={'row'}
								justifyContent={'space-between'}
							>
								<Box>
									{userInfoDoc?.primary_phone_number ? (
										<Tooltip
											bgColor={colorMode === 'dark' ? '#fff' : 'gray.300'}
											hasArrow
											label={`Call ${userDoc?.first_name}`}
											color={colorMode === 'dark' ? 'black' : 'black'}
										>
											<IconButton
												variant="outline"
												aria-label={`Call ${userDoc?.first_name}`}
												border="none"
												fontSize={'24px'}
												icon={<BiPhone />}
												onClick={() =>
													router.replace(
														`tel:${userInfoDoc.primary_phone_number}`,
													)
												}
											/>
										</Tooltip>
									) : null}

									<Tooltip
										bgColor={colorMode === 'dark' ? '#fff' : 'gray.300'}
										hasArrow
										label={`Message ${userDoc?.first_name}`}
										color={colorMode === 'dark' ? 'black' : 'black'}
									>
										<IconButton
											variant="outline"
											aria-label={`Message ${userDoc?.first_name}`}
											border="none"
											fontSize="24px"
											icon={<BiMessageRoundedDetail />}
											onClick={() => {
												router.replace(`/messages/${userInfoDoc?._user_id}`)
											}}
										/>
									</Tooltip>
								</Box>
								<Flex flexWrap={'wrap'}>
									<Text fontSize={'1.4rem'} fontWeight={'700'}>
										&#8358;{budget?.toLocaleString()}
									</Text>
									<Text fontSize={20} fontWeight={200}>
										{'/'}
										{payment_type}
									</Text>
								</Flex>
							</Flex>
						</HStack>
						<HStack
							mt={2}
							mb={2}
							borderBottom={`.5px solid ${colorMode === 'light' ? '#1117171A' : '#515151'}`}
						></HStack>
					</Box>
					<Box marginTop={10}>
						<UserCard
							name={
								capitalizeString(userDoc?.first_name) + ' ' + userDoc?.last_name
							}
							handle={userDoc?.first_name}
							userInfoDoc={userInfoDoc}
							profilePicture={userDoc?.avatar_url}
							bio={
								'A well renowed Software Engineer with 99 years of experience.'
							}
						/>
					</Box>
				</>
			) : (
				'please wait ...'
			)}
		</>
	)
}

const UserCard = ({
	name,
	handle,
	bio,
	profilePicture,
	userInfoDoc,
}: Props) => {
	const router = useRouter()

	return (
		<Box bgColor="#202020" borderRadius="15px">
			<Flex bg="brand_darker" p={4} alignItems="center" borderRadius="15px">
				<Avatar size="lg" src={profilePicture} />
				<Box ml={2}>
					<Flex gap={1} alignItems={'center'}>
						<Text fontWeight="bold" color="white">
							{name}
						</Text>
						<Icon as={BiSolidBadgeCheck} color="blue.500" ml={1} />
					</Flex>
					<Text color="#fff" fontSize="sm">
						@{handle}
					</Text>
					<Text color="#fff" fontSize="sm">
						{bio}
					</Text>
				</Box>
			</Flex>

			<HStack
				p={4}
				justifyContent={'space-between'}
				alignItems={'center'}
				bgColor={'gray.600'}
				color={'#fff'}
			>
				<Text fontWeight={'semibold'} cursor={'pointer'}>
					Book Inspection
				</Text>
				<Flex justifyContent="flex-end">
					<IconButton
						aria-label="sese"
						icon={<BiEnvelope />}
						variant="ghost"
						colorScheme="white"
						size={'md'}
						onClick={() => router.replace(`/messages/${userInfoDoc?._user_id}`)}
					/>
					{userInfoDoc?.primary_phone_number ? (
						<IconButton
							aria-label="sese"
							icon={<BiPhone />}
							variant="ghost"
							colorScheme="white"
							ml={2}
							size={'md'}
							onClick={() =>
								router.replace(`tel:${userInfoDoc.primary_phone_number}`)
							}
						/>
					) : null}
				</Flex>
			</HStack>
		</Box>
	)
}

export default function Page({ params }: { params: PageParams }) {
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const router = useRouter()

	const { authState } = useAuthContext()

	const [requestData, setRequestData] = useState<Partial<DocumentData>>({})

	useEffect(() => {
		if (Object.keys(authState?.user || {}).length) {
			setRequestData((prev) => ({
				...prev,
				loggedInUser: authState.user,
			}))
		}
	}, [authState.user])

	const requestId = params?.request_id

	const getRequest = async (): Promise<any> => {
		try {
			setIsLoading(true)

			const result: DocumentData | null = await SherutaDB.get({
				collection_name: 'requests',
				document_id: requestId as string,
			})

			if (
				result &&
				Object.keys(result).length > 0 &&
				result._user_ref &&
				result._service_ref &&
				result._location_keyword_ref
			) {
				let userInfoDoc: DocumentData | undefined = undefined

				if (result?._user_ref?._id) {
					userInfoDoc = await UserInfoService.get(result._user_ref._id)
				}

				setRequestData((prev) => ({
					...prev,
					...result,
					userInfoDoc,
				}))

				setIsLoading(false)
			} else {
				//redirect back to homepage
				router.replace('/')
			}
		} catch (error: any) {
			console.log(error)
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getRequest()
	}, [])

	return (
		<Flex justifyContent={'center'}>
			<MainContainer>
				<ThreeColumnLayout header={<MainHeader />}>
					<Flex flexDirection={'column'} w="full">
						<MainLeftNav />
					</Flex>
					<Box p={DEFAULT_PADDING}>
						<Box
							marginBottom={5}
							onClick={() => router.replace('/')}
							cursor={'pointer'}
						>
							<Flex align="center" mb={4}>
								<IconButton
									aria-label="Search database"
									icon={<FaAngleLeft />}
									variant="ghost"
									_hover={{ bg: 'transparent' }}
									_focus={{ boxShadow: 'none' }}
									_active={{ bg: 'transparent' }}
								/>

								<Text fontSize="2xl" fontWeight="bold">
									Go Back Home
								</Text>
							</Flex>
						</Box>
						<Post
							postData={requestData}
							requestId={requestId}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
						/>
					</Box>
				</ThreeColumnLayout>
			</MainContainer>
		</Flex>
	)
}
