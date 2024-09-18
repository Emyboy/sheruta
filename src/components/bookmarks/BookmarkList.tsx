'use client'
import React from 'react'
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
import EachRequest from '../EachRequest/EachRequest'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import { BiBookmark } from 'react-icons/bi'
import { FlatShareProfileData } from '@/firebase/service/flat-share-profile/flat-share-profile.types'
import { useBookmarkContext } from '@/context/bookmarks.context'

interface ProfileDTO {
	_id: string
	avatar_url: string
	first_name: string
	last_name: string
	flat_share_profile: FlatShareProfileData
}

//TODO: Add inifinite scrolling
const BookmarkList = () => {
	const {
		authState: { user },
	} = useAuthContext()

	const {bookmarks, bookmarkLoading} = useBookmarkContext()

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
		<VStack p={6} spacing={4} mt={5} align="start">
			<Heading as="h2" size="lg">
				My Bookmarks {(bookmarks.length > 0) ? `(${bookmarks.length})` : null}
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
