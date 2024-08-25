'use client'

import SherutaDB from '@/firebase/service/index.firebase'
import { useEffect, useState } from 'react'
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
	useColorMode,
	Avatar,
} from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/navigation'
import {
	BiBookmark,
	BiDotsHorizontalRounded,
	BiMap,
	BiMessageRoundedDetail,
	BiPencil,
	BiPhone,
	BiShare,
	BiTrash,
} from 'react-icons/bi'
import { capitalizeString, timeAgo } from '@/utils/index.utils'
import useCommon from '@/hooks/useCommon'
import Link from 'next/link'
import UserCard from './UserCard'
import { useAuthContext } from '@/context/auth.context'
import useShareSpace from '@/hooks/useShareSpace'

interface Props {
	[key: string]: any
}

const SeekerPost = ({ postData, requestId }: Props) => {
	const { colorMode } = useColorMode()
	const { showToast } = useCommon()
	const { authState } = useAuthContext()
	const { copyShareUrl } = useShareSpace()
	const router = useRouter()

	const {
		updatedAt,
		description,
		google_location_text,
		flat_share_profile: userDoc,
		_service_ref: serviceTypeDoc,
		_location_keyword_ref: locationKeywordDoc,
		budget,
		payment_type,
		userInfoDoc,
	} = postData || {}

	const [isLoading, setIsLoading] = useState<boolean>(false)

	const [isPostAdmin, setIsPostAdmin] = useState<boolean>(false)

	useEffect(() => {
		if (
			typeof authState.user !== 'undefined' &&
			typeof userDoc !== 'undefined'
		) {
			setIsPostAdmin(authState.user?._id === userDoc?._id)
		}
	}, [userDoc, authState])

	const handleShare = async () => {
		try {
			if (
				typeof window !== 'undefined' &&
				typeof window.location !== 'undefined'
			) {
				const shareUrl = window.location.href
				await copyShareUrl(
					shareUrl,
					'Hey! Check out this apartment from Sheruta',
					'Come, join me and review this apartment from Sheruta',
				)
			}
		} catch (error) {
			console.error('Error sharing:', error)
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
													onClick={handleShare}
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
									colorScheme={colorMode === 'dark' ? '' : 'gray'}
									fontSize="24px"
									aria-label="Bookmark"
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

export default SeekerPost
