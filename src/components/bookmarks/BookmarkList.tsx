'use client'

import { useAuthContext } from '@/context/auth.context'
import { useBookmarkContext } from '@/context/bookmarks.context'
import { db } from '@/firebase'
import {
	BookmarkDataDetails,
	BookmarkType,
} from '@/firebase/service/bookmarks/bookmarks.types'
import { FlatShareProfileData } from '@/firebase/service/flat-share-profile/flat-share-profile.types'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import {
	FlatShareRequest,
	HostRequestDataDetails,
} from '@/firebase/service/request/request.types'
import {
	resolveArrayOfReferences,
	resolveSingleObjectReferences,
} from '@/utils/index.utils'
import {
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	Circle,
	Divider,
	Flex,
	Heading,
	Icon,
	Image,
	Link,
	Spinner,
	Stack,
	Text,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react'
import {
	collection,
	DocumentData,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
} from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { BiBookmark, BiSolidBookmark } from 'react-icons/bi'
import EachRequest from '../EachRequest/EachRequest'
import useHandleBookmark from '@/hooks/useHandleBookmark'

interface ProfileDTO {
	_id: string
	avatar_url: string
	first_name: string
	last_name: string
	flat_share_profile: FlatShareProfileData
}

const BookmarkList = () => {
	const {
		authState: { user },
	} = useAuthContext()

	const { bookmarks, bookmarkLoading } = useBookmarkContext()

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [processedBookmarks, setProcessedBookmarks] =
		useState<BookmarkDataDetails[]>(bookmarks)
	const [hasMore, setHasMore] = useState(true)
	const [lastVisible, setLastVisible] = useState<DocumentData | null>(null) // Store the last document

	const lastRequestRef = useRef<HTMLDivElement | null>(null)
	const observer = useRef<IntersectionObserver | null>(null)

	useEffect(() => {
		if (bookmarks.length > 0) {
			setProcessedBookmarks(bookmarks)
			console.log(bookmarks)
		}
	}, [bookmarks])

	const loadMore = async () => {
		if (isLoading || !hasMore) return
		setIsLoading(true)

		try {
			const requestsRef = collection(db, DBCollectionName.bookmarks)
			let requestsQuery = query(requestsRef, orderBy('updatedAt'), limit(10))

			if (lastVisible) {
				requestsQuery = query(requestsQuery, startAfter(lastVisible))
			}

			const querySnapshot = await getDocs(requestsQuery)

			if (querySnapshot.empty) {
				setHasMore(false)
			} else {
				// Map and resolve document references for new bookmarks
				const newBookmarks = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				})) as BookmarkDataDetails[]

				// Resolve document references in the new bookmarks
				const resolvedBookmarks = await resolveArrayOfReferences(newBookmarks)

				// Further resolve _object_ref and filter out any bookmarks not belonging to the current user
				const filteredBookmarks = await Promise.all(
					resolvedBookmarks.map(async (bookmark) => {
						if (bookmark._user_ref._id !== user?._id) return null
						const resolvedObjectRefs = await resolveSingleObjectReferences(
							bookmark._object_ref,
						)
						return { ...bookmark, _object_ref: resolvedObjectRefs }
					}),
				).then((results) => results.filter(Boolean))

				// Update state with new, non-duplicate bookmarks
				setProcessedBookmarks((prev) => {
					const existingIds = new Set(prev.map((bookmark) => bookmark.id))

					// Filter out bookmarks that are already in the current state
					return [
						...prev,
						...filteredBookmarks.filter(
							(bookmark) => !existingIds.has(bookmark.id),
						),
					]
				})

				// Update the last visible document to handle pagination
				setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
			}
		} catch (error) {
			console.error('Failed to load more data', error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (isLoading) return

		if (observer.current) observer.current.disconnect()
		observer.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasMore) {
				loadMore()
			}
		})

		if (lastRequestRef.current) observer.current.observe(lastRequestRef.current)

		return () => {
			if (observer.current) observer.current.disconnect()
		}
	}, [isLoading, hasMore, lastRequestRef])

	// Assign ref to the last item
	const setRef = (node: HTMLDivElement | null) => {
		if (observer.current) observer.current.disconnect()
		lastRequestRef.current = node
		if (node) observer.current?.observe(node)
	}

	if (!user) {
		return <NoBookmarks />
	}

	if (bookmarkLoading) {
		return (
			<Box textAlign="center" mt="20">
				<Spinner size="xl" />
				<Text mt="4">Loading your bookmarks...</Text>
			</Box>
		)
	}

	if (!bookmarkLoading && bookmarks.length === 0) {
		return (
			<Box textAlign="center" mt="20">
				<Text>No bookmarks found.</Text>
			</Box>
		)
	}

	return (
		<VStack p={6} spacing={4} align="start">
			<Heading
				as="h3"
				mb={4}
				textAlign={['center', 'start']}
				size={{ base: 'lg', md: 'xl' }}
			>
				My Bookmarks
			</Heading>

			{processedBookmarks.map((bookmark, index) => {
				const bookmarkType = bookmark.object_type

				// Check if the ref is to be assigned
				const isLastItem = index === processedBookmarks.length - 1
				const refProp = isLastItem ? { ref: setRef } : {}

				if (bookmarkType === BookmarkType.requests) {
					return (
						<Box
							key={bookmark.id}
							{...refProp}
							style={{ transition: 'opacity 0.3s ease-in-out' }}
						>
							{/* <EachRequest
								request={
									bookmark._object_ref as unknown as HostRequestDataDetails
								}
							/> */}
						</Box>
					)
				} else if (bookmarkType === BookmarkType.profiles) {
					return (
						<Box
							key={bookmark.id}
							{...refProp}
							style={{ transition: 'opacity 0.3s ease-in-out' }}
						>
							<UserProfile
								profileData={bookmark._object_ref as unknown as ProfileDTO}
							/>
						</Box>
					)
				} else {
					return null
				}
			})}

			{isLoading && processedBookmarks.length > 0 && (
				<Box textAlign="center" mt="4" width="100%">
					<Spinner size="xl" />
					<Text mt="4">Loading more bookmarks...</Text>
				</Box>
			)}

			{!hasMore && (
				<Box mt={3} width={'100%'}>
					<Text align={'center'}>
						You have reached the end of your bookmarks.
					</Text>
				</Box>
			)}
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
	const {
		authState: { user },
	} = useAuthContext()

	const { bookmarkId, toggleSaveProfile } = useHandleBookmark(
		profileData._id,
		user?._id as string,
	)

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
						objectFit="contain"
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
							<Button
								colorScheme="lueb"
								color="text_muted"
								onClick={async () => await toggleSaveProfile()}
							>
								{bookmarkId ? (
									<BiSolidBookmark style={{ fontSize: '1.5em' }} />
								) : (
									<BiBookmark style={{ fontSize: '1.5em' }} />
								)}
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
