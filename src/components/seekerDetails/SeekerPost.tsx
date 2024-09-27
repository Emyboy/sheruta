'use client'

import { useAuthContext } from '@/context/auth.context'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import useCommon from '@/hooks/useCommon'
import useShareSpace from '@/hooks/useShareSpace'
import {
	capitalizeString,
	timeAgo,
	handleCall,
	handleDM,
} from '@/utils/index.utils'
import {
	Avatar,
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	IconButton,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Text,
	Tooltip,
	useColorMode,
	VStack,
	Icon,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	BiBookmark,
	BiDotsHorizontalRounded,
	BiEnvelope,
	BiMap,
	BiPencil,
	BiPhone,
	BiShare,
	BiTrash,
	BiSolidBadgeCheck,
	BiSolidBookmark,
} from 'react-icons/bi'
import SuperJSON from 'superjson'
import { SeekerRequestDataDetails } from '@/firebase/service/request/request.types'
import BookmarkService from '@/firebase/service/bookmarks/bookmarks.firebase'
import {
	BookmarkDataDetails,
	BookmarkType,
} from '@/firebase/service/bookmarks/bookmarks.types'
import { v4 as generateUId } from 'uuid'
import { doc } from 'firebase/firestore'
import { db } from '@/firebase'
import useHandleBookmark from '@/hooks/useHandleBookmark'

const SeekerPost = ({
	requestData,
	requestId,
}: {
	requestData: string | undefined
	requestId: string | undefined
}) => {
	const { colorMode } = useColorMode()
	const { showToast } = useCommon()
	const { authState } = useAuthContext()
	const { copyShareUrl } = useShareSpace()
	const router = useRouter()

	const postData: SeekerRequestDataDetails | undefined = requestData
		? SuperJSON.parse(requestData)
		: undefined

	const [lastUpdated, setLastUpdated] = useState<string>('99 years ago')

	const [isLoading, setIsLoading] = useState<boolean>(false)

	const [isPostAdmin, setIsPostAdmin] = useState<boolean>(false)

	const {toggleSaveApartment, isBookmarkLoading, bookmarkId} = useHandleBookmark(requestId as string, authState.user?._id as string)

	useEffect(() => {
		if (
			postData &&
			typeof authState.user !== 'undefined' &&
			typeof postData?._user_ref?._id !== 'undefined'
		) {
			setIsPostAdmin(authState.user?._id === postData?._user_ref?._id)
			setLastUpdated(timeAgo(postData.updatedAt))
		}
	}, [postData, authState])

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
			{typeof postData !== 'undefined' &&
			Object.values(postData || {}).length ? (
				<>
					<Box>
						<Flex alignItems="center" justifyContent="space-between">
							<Flex alignItems="center">
								<Avatar
									size="lg"
									src={
										postData._user_ref.avatar_url ||
										'https://via.placeholder.com/150'
									}
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
										Posted {lastUpdated}
									</Text>
								</Box>
							</Flex>
							<HStack flexWrap={'wrap'}>
								<Popover>
									<PopoverTrigger>
										<IconButton
											colorScheme={colorMode === 'dark' ? '' : 'gray'}
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
													<Link
														href={`${requestId}/edit`}
														style={{ textDecoration: 'none', width: '100%' }}
													>
														<Button
															variant="ghost"
															isLoading={isLoading}
															leftIcon={<BiPencil />}
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
													</Link>
												)}

												<Button
													variant="ghost"
													isLoading={isLoading}
													leftIcon={<BiShare />}
													onClick={() =>
														copyShareUrl(
															window.location.href,
															'Hey! Check out this apartment from Sheruta',
															'Come, join me and review this apartment from Sheruta',
														)
													}
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
									onClick={async() => await toggleSaveApartment()}
									disabled={isBookmarkLoading}
									_hover={{
										color: 'brand',
										bg: 'none',
										_dark: {
											color: 'brand',
										},
									}}
									isLoading={isBookmarkLoading}
									colorScheme={colorMode === 'dark' ? '' : 'gray'}
									fontSize="24px"
									aria-label="Bookmark"
									icon={bookmarkId ? <BiSolidBookmark /> : <BiBookmark />}
								/>
							</HStack>
						</Flex>

						<Flex justifyContent={'space-between'} alignItems={'center'}>
							<Flex gap={2} mt={2} p={2} alignItems={'center'} color="#00BC73">
								<Text fontSize={'25px'}>
									<BiMap />
								</Text>{' '}
								<Text fontSize={'15px'}> {postData.google_location_text} </Text>
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
									{postData._service_ref?.title}
								</Badge>
							</Text>
						</Flex>

						<Text mt={5} mb={5} whiteSpace={'pre-wrap'}>
							{postData.description}
						</Text>

						<HStack>
							<Flex
								flexWrap={'wrap'}
								width={'100%'}
								direction={'row'}
								justifyContent={'space-between'}
							>
								<Box>
									{postData.user_info.primary_phone_number ? (
										<Tooltip
											bgColor={colorMode === 'dark' ? '#fff' : 'gray.300'}
											hasArrow
											label={`Call ${postData._user_ref?.first_name}`}
											color={colorMode === 'dark' ? 'black' : 'black'}
										>
											<IconButton
												variant="outline"
												aria-label={`Call ${postData._user_ref?.first_name}`}
												border="none"
												fontSize={'24px'}
												icon={<BiPhone />}
												onClick={async () => {
													if (authState.user?._id === postData._user_ref._id)
														return
													await handleCall({
														number: postData.user_info.primary_phone_number,
														recipient_id: postData._user_ref._id,
														sender_details: authState.user
															? {
																	avatar_url: authState.user.avatar_url,
																	first_name: authState.user.first_name,
																	last_name: authState.user.last_name,
																	id: authState.user._id,
																}
															: null,
													})
												}}
											/>
										</Tooltip>
									) : null}

									<Tooltip
										bgColor={colorMode === 'dark' ? '#fff' : 'gray.300'}
										hasArrow
										label={`Dm ${postData._user_ref.first_name}`}
										color={colorMode === 'dark' ? 'black' : 'black'}
									>
										<IconButton
											variant="outline"
											aria-label={`Message ${postData._user_ref.first_name}`}
											border="none"
											fontSize="24px"
											icon={<BiEnvelope />}
											onClick={() => handleDM(postData._user_ref._id)}
										/>
									</Tooltip>
								</Box>
								<Flex flexWrap={'wrap'}>
									<Text fontSize={'1.4rem'} fontWeight={'700'}>
										&#8358;{postData.budget?.toLocaleString()}
									</Text>
									<Text fontSize={20} fontWeight={200}>
										{'/'}
										{postData.payment_type}
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
					<Box marginTop={10} paddingBottom="70px">
						<UserCard postData={postData} />
					</Box>
				</>
			) : (
				<Box w="100%" textAlign="center">
					{'This Post does not exist'}
				</Box>
			)}
		</>
	)
}

const UserCard = ({ postData }: { postData: SeekerRequestDataDetails }) => {
	const { authState } = useAuthContext()

	const name =
		capitalizeString(postData._user_ref.first_name) +
		' ' +
		postData._user_ref.last_name
	const handle = postData._user_ref.first_name
	const userInfo = postData.user_info
	const bio = postData.flat_share_profile.bio || 'No Bio Available'
	const profilePicture = postData._user_ref.avatar_url

	return (
		<Box bgColor="#202020" borderRadius="15px">
			<Flex bg="brand_darker" p={4} alignItems="center" borderRadius="15px">
				<Avatar size="lg" src={profilePicture} />
				<VStack justifyContent={'flex-start'} spacing={1} ml={2}>
					<Flex gap={2} alignItems={'center'}>
						<Text fontWeight="bold" color="white">
							{name}
						</Text>
						{userInfo?.is_verified ? (
							<Icon as={BiSolidBadgeCheck} color="blue.500" ml={1} />
						) : null}
					</Flex>
					<Text w="100%" color="#fff" fontSize="sm">
						@{handle}
					</Text>
					<Text w="100%" color="#fff" fontSize="sm">
						{bio}
					</Text>
				</VStack>
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
						onClick={() => handleDM(postData._user_ref._id)}
					/>
					{userInfo?.primary_phone_number ? (
						<IconButton
							aria-label="sese"
							icon={<BiPhone />}
							variant="ghost"
							colorScheme="white"
							ml={2}
							size={'md'}
							onClick={async () => {
								if (authState.user?._id === postData._user_ref._id) return
								await handleCall({
									number: userInfo.primary_phone_number,
									recipient_id: postData._user_ref._id,
									sender_details: authState.user
										? {
												avatar_url: authState.user.avatar_url,
												first_name: authState.user.first_name,
												last_name: authState.user.last_name,
												id: authState.user._id,
											}
										: null,
								})
							}}
						/>
					) : null}
				</Flex>
			</HStack>
		</Box>
	)
}

export default SeekerPost
