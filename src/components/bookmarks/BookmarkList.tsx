'use client'

import React, { useEffect, useState } from 'react'
import {
	Badge,
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	Link,
	Spinner,
	Text,
	VStack,
	CardBody,
	Card,
	Stack,
	Image,
	Circle,
	useColorModeValue,
	Icon,
} from '@chakra-ui/react'
import { BookmarkDataDetails } from '@/firebase/service/bookmarks/bookmarks.types'
import { useAuthContext } from '@/context/auth.context'
import BookmarkService from '@/firebase/service/bookmarks/bookmarks.firebase'
import NextLink from 'next/link'
import EachRequest from '../EachRequest/EachRequest'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { DocumentReference, getDoc } from 'firebase/firestore'
import { AuthUser } from '@/firebase/service/auth/auth.types'
import { BiBookmark } from 'react-icons/bi'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import { FlatShareProfileData } from '@/firebase/service/flat-share-profile/flat-share-profile.types'

interface ProfileDTO {
	_id: string
	avatar_url: string
	first_name: string
	last_name: string
	flat_share_profile: FlatShareProfileData
}

const resolveUserReferences = async (userRef: DocumentReference) => {
	const docSnap = await getDoc(userRef)
	if (docSnap.exists()) {
		const docData = docSnap.data() as AuthUser
		return await UserInfoService.get(docData._id as string)
	}
	return null
}

const resolveReferences = async (obj: Record<any, any>) => {
	const refFields = Object.entries(obj).filter(
		([, value]) => value instanceof DocumentReference,
	)

	const resolvedRefs = await Promise.all(
		refFields.map(async ([key, ref]) => {
			const resolvedDoc = await getDoc(ref as DocumentReference)
			return resolvedDoc.exists()
				? { [key]: resolvedDoc.data() }
				: { [key]: null }
		}),
	)

	return Object.assign({}, ...resolvedRefs)
}

//TODO: Refresh bookmarks on deletion
//TODO: Add inifinite scrolling
const BookmarkList = () => {
	const [bookmarks, setBookmarks] = useState<BookmarkDataDetails[]>([])
	const [loading, setLoading] = useState(true)
	const {
		authState: { user },
	} = useAuthContext()

	useEffect(() => {
		const fetchBookmarks = async () => {
			setLoading(true)
			try {
				if (user?._id) {
					const userBookmarks = (await BookmarkService.getUserBookmarks(
						user._id,
					)) as BookmarkDataDetails[]

					if (!userBookmarks || userBookmarks.length === 0) {
						setBookmarks([])
						return
					}

					const resolvedBookmarks = await Promise.all(
						userBookmarks.map(async (bookmark) => {
							try {
								if (
									bookmark.object_type === 'request' &&
									bookmark._object_ref?._user_ref
								) {
									// Resolve user info and refs for requests
									const user_info = await resolveUserReferences(
										bookmark._object_ref._user_ref as DocumentReference,
									)
									const resolvedRefs = await resolveReferences(
										bookmark._object_ref,
									)

									return {
										...bookmark,
										_object_ref: {
											...bookmark._object_ref,
											...resolvedRefs,
											user_info,
										},
									}
								} else if (bookmark.object_type === 'profile') {
									// Resolve flatShareProfile and refs for profiles
									const userId = bookmark._object_ref.id
									const flatShareProfile =
										await FlatShareProfileService.get(userId)
									const resolvedRefs = flatShareProfile
										? await resolveReferences(flatShareProfile)
										: {}

									return {
										...bookmark,
										_object_ref: {
											...bookmark._object_ref,
											flat_share_profile: {
												...flatShareProfile,
												...resolvedRefs,
											},
										},
									}
								}
							} catch (error) {
								console.error(
									`Error resolving bookmark ID: ${bookmark.id}`,
									error,
								)
								return bookmark
							}

							return bookmark // Fallback to original bookmark if no type matches
						}),
					)

					setBookmarks(
						resolvedBookmarks.filter(Boolean) as BookmarkDataDetails[],
					)
				} else {
					setBookmarks([])
				}
			} catch (error) {
				console.error('Error fetching bookmarks:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchBookmarks()
	}, [user?._id])

	if (!user) {
		return <NoBookmarks />
	}

	if (loading) {
		return (
			<Box textAlign="center" mt="20">
				<Spinner size="xl" />
				<Text mt="4">Loading your bookmarks...</Text>
			</Box>
		)
	}

	if (!loading && bookmarks.length === 0) {
		return (
			<Box textAlign="center" mt="20">
				<Text>No bookmarks found.</Text>
			</Box>
		)
	}

	return (
		<VStack p={6} spacing={4} mt={5} align="start">
			<Heading as="h2" size="lg">
				My Bookmarks
			</Heading>
			{bookmarks.map((bookmark: BookmarkDataDetails) => {
				const bookmarkType = bookmark.object_type

				if (bookmarkType === 'request') {
					return (
						<React.Fragment key={bookmark.id}>
							<EachRequest
								request={
									bookmark._object_ref as unknown as HostRequestDataDetails
								}
							/>
						</React.Fragment>
					)
				} else if (bookmarkType === 'profile') {
					return (
						<React.Fragment key={bookmark.id}>
							<UserProfile
								profileData={bookmark._object_ref as unknown as ProfileDTO}
							/>
						</React.Fragment>
					)
				}
			})}
		</VStack>
	)
}

const NoBookmarks = () => {
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
					<Icon as={BiBookmark} w={16} h={16} color="green.400" />
				</Circle>
				<Flex gap="5px" alignItems={'center'} flexDir={'column'}>
					<Text fontWeight={'600'}>No Bookmarks Yet</Text>
					<Text textAlign={'center'}>
						Login / signup to view your bookmarks
					</Text>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default BookmarkList

const UserProfile = ({ profileData }: { profileData: ProfileDTO }) => {
	return (
		<>
			<Box w="100%">
				<Card
					direction={{ base: 'column', sm: 'row' }}
					overflow="hidden"
					variant="outline"
					width="100%"
				>
					<Image
						objectFit="cover"
						maxW={{ base: '100%', sm: '200px' }}
						w="600px"
						src={`${profileData.avatar_url}`}
						alt="Caffe Latte"
					/>

					<Stack width="100%">
						<Link
							href={`/user/${profileData?._id}`}
							style={{ textDecoration: 'none' }}
						>
							<CardBody mb={0} border="none">
								{/* <Heading size='md'>The perfect latte</Heading> */}
								<Flex justify="space-between" align="center" mb={3}>
									<Text>{`${profileData?.first_name} ${profileData?.last_name}`}</Text>
									{/* <Badge color="text_color" background="border_color">
                                        Promoted
                                    </Badge> */}
								</Flex>

								<Flex>
									<Text color="muted_text" py="2" fontSize="0.8em">
										{profileData.flat_share_profile.bio
											? profileData.flat_share_profile.bio.length > 84
												? `${profileData.flat_share_profile.bio.substring(0, 84)}......`
												: profileData.flat_share_profile.bio
											: 'Hi! I am a user of Sheruta, you should go through my profile and see if we are a match'}
									</Text>
								</Flex>

								<Flex
									style={{ fontSize: '10px' }}
									justify="space-between"
									align="center"
								>
									<Text color="text_muted" fontWeight="700">
										{`Preffered area: ${profileData?.flat_share_profile?.location_keyword?.name} ,${profileData?.flat_share_profile?.state?.name}`}
									</Text>
									<Badge
										colorScheme={
											profileData?.flat_share_profile?.seeking
												? 'cyan'
												: 'green'
										}
										rounded="md"
										textTransform="capitalize"
									>
										{profileData?.flat_share_profile?.seeking
											? 'Seeker'
											: 'I have a space'}
									</Badge>
									<Badge
										colorScheme="orange"
										rounded="md"
										textTransform={'capitalize'}
									>
										{`House share`}
									</Badge>
								</Flex>
							</CardBody>
						</Link>
						<Divider />
						<Flex justify="space-between" align="center" mb={2}>
							<Button colorScheme="lueb" color="text_muted">
								<BiBookmark style={{ fontSize: '1.5em' }} />
							</Button>
							<Box mr={2} color="text_muted">
								{`Budget: ${profileData?.flat_share_profile?.budget}/month`}
							</Box>
						</Flex>
					</Stack>
				</Card>
			</Box>
			<Divider />
		</>
	)
}
