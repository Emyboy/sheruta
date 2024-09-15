'use client'

import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { NotificationsBodyMessage } from '@/firebase/service/notifications/notifications.firebase'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import useShareSpace from '@/hooks/useShareSpace'
import { createNotification } from '@/utils/actions'
import { handleCall, truncateText, timeAgo } from '@/utils/index.utils'
import { Link } from '@chakra-ui/next-js'
import {
	Avatar,
	AvatarBadge,
	Badge,
	Box,
	Button,
	Flex,
	Image,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Text,
	useColorMode,
	VStack,
} from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	BiBookmark,
	BiDotsHorizontalRounded,
	BiLocationPlus,
	BiMessageRoundedDetail,
	BiPencil,
	BiPhone,
	BiPlayCircle,
	BiShare,
	BiSolidBookmark,
	BiTrash,
} from 'react-icons/bi'
import { LuBadgeCheck } from 'react-icons/lu'
import MainTooltip from '../atoms/MainTooltip'
import useCommon from '@/hooks/useCommon'
import BookmarkService from '@/firebase/service/bookmarks/bookmarks.firebase'
import { v4 as generateUId } from 'uuid'
import {
	BookmarkDataDetails,
	BookmarkType,
} from '@/firebase/service/bookmarks/bookmarks.types'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { doc } from 'firebase/firestore'
import { db } from '@/firebase'

type Props = { request: HostRequestDataDetails }

export default function EachRequest({ request }: Props) {
	const router = useRouter()
	const { showToast } = useCommon()
	const [isBookmarked, setIsBookmarked] = useState<boolean>(false)
	const [bookmarkId, setBookmarkId] = useState<string | null>(null)
	const { colorMode } = useColorMode()
	const { authState } = useAuthContext()
	const { copyShareUrl, handleDeletePost, isLoading, setIsLoading } =
		useShareSpace()

	const updateBookmark = async () => {
		try {
			if (!(authState.user && authState.user?._id)) {
				return showToast({
					message: 'Please login to perform this action',
					status: 'info',
				})
			}

			setIsLoading(true)

			//check if user has saved this bookmark already, then unsave it
			if (isBookmarked && bookmarkId) {
				await BookmarkService.deleteBookmark({
					user_id: authState.user._id,
					document_id: bookmarkId,
				})

				setIsBookmarked(false)
				setBookmarkId(null)
				setIsLoading(false)
				return showToast({
					message: 'Bookmark removed successfully',
					status: 'success',
				})
			}

			const uuid = generateUId()
			const requestRef = doc(
				db,
				DBCollectionName.flatShareRequests,
				request.id as string,
			)

			await BookmarkService.createBookmark({
				object_type: BookmarkType.requests,
				_object_ref: requestRef,
				_user_ref: authState.flat_share_profile?._user_ref,
				uuid,
			})

			setBookmarkId(uuid)
			setIsLoading(false)
			setIsBookmarked(true)
			return showToast({
				message: 'Bookmark added successfully',
				status: 'success',
			})
		} catch (err) {
			showToast({
				message: 'Failed to update bookmark',
				status: 'error',
			})
		}
	}

	useEffect(() => {
		const isBookmarked = async (): Promise<void> => {
			try {
				if (!(authState.user && authState.user._id)) {
					setIsBookmarked(false)
					return
				}

				const myBookmarks = (await BookmarkService.getUserBookmarks(
					authState.user._id,
				)) as BookmarkDataDetails[]

				// Find the bookmark by request_id
				const theBookmark = myBookmarks.find(
					(bookmark) => bookmark._object_ref?.id === request.id,
				)

				// Set bookmarkId if a bookmark is found
				if (theBookmark) {
					setBookmarkId(theBookmark.id)
					setIsBookmarked(true)
				} else {
					setIsBookmarked(false)
				}
			} catch (err: any) {
				console.error('Error checking if request is bookmarked:', err)
				setIsBookmarked(false)
			}
		}

		isBookmarked()
	}, [authState, request])

	return (
		<Box
			position={'relative'}
			fontSize={{
				md: 'md',
				base: 'sm',
			}}
			borderBottom={'1px'}
			borderColor={'border_color'}
			py={DEFAULT_PADDING}
			bg="white"
			_dark={{
				bg: 'dark',
				borderColor: 'dark_light',
			}}
			width={'full'}
		>
			<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
				<Flex gap={5} alignItems={'center'}>
					<Link
						href={`/user/${request._user_ref._id}`}
						style={{ textDecoration: 'none' }}
						onClick={async () =>
							await createNotification({
								is_read: false,
								message: NotificationsBodyMessage.profile_view,
								recipient_id: request._user_ref._id,
								type: 'profile_view',
								sender_details: authState.user
									? {
											avatar_url: authState.user.avatar_url,
											first_name: authState.user.first_name,
											last_name: authState.user.last_name,
											id: authState.user._id,
										}
									: null,
								action_url: `/user/${request._user_ref._id}`,
							})
						}
					>
						<Avatar
							src={request._user_ref.avatar_url}
							size={{
								md: 'md',
								base: 'md',
							}}
						>
							<AvatarBadge boxSize="20px" bg="green.500" />
						</Avatar>
					</Link>
					<Flex flexDirection={'column'} justifyContent={'flex-start'} flex={1}>
						<Flex justifyContent={'space-between'} alignItems={'center'}>
							<Link
								href={`/user/${request._user_ref._id}`}
								style={{ textDecoration: 'none' }}
								onClick={async () =>
									await createNotification({
										is_read: false,
										message: NotificationsBodyMessage.profile_view,
										recipient_id: request._user_ref._id,
										type: 'profile_view',
										sender_details: authState.user
											? {
													avatar_url: authState.user.avatar_url,
													first_name: authState.user.first_name,
													last_name: authState.user.last_name,
													id: authState.user._id,
												}
											: null,
										action_url: `/user/${request._user_ref._id}`,
									})
								}
							>
								<Flex alignItems={'center'} gap={{ base: '4px', md: '8px' }}>
									<Text
										textTransform={'capitalize'}
										fontSize={{ base: 'base', md: 'lg' }}
									>
										{request._user_ref.last_name} {request._user_ref.first_name}
									</Text>
									{request.user_info.is_verified && (
										<LuBadgeCheck fill="#00bc73" />
									)}
								</Flex>
							</Link>
							<Popover>
								<PopoverTrigger>
									<Button
										px={0}
										colorScheme=""
										bgColor="none"
										color="text_muted"
										display={'flex'}
										fontWeight={'light'}
										_hover={{
											color: 'brand',
											_dark: {
												color: 'brand',
											},
										}}
										_dark={{
											color: 'dark_lighter',
										}}
										fontSize={{
											md: 'xl',
											base: 'lg',
										}}
									>
										<BiDotsHorizontalRounded />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									color={colorMode === 'dark' ? '#F0F0F0' : '#000'}
									bg={colorMode === 'dark' ? '#202020' : '#fff'}
									width={'100%'}
									padding={4}
								>
									<PopoverBody p={0}>
										<VStack spacing={1} align="flex-start">
											<Button
												variant="ghost"
												leftIcon={<BiShare />}
												isLoading={isLoading}
												bgColor="none"
												onClick={() =>
													copyShareUrl(
														`/request/${request.seeking ? 'seeker' : 'host'}/${request.id}`,
														request.seeking
															? 'Looking for apartment'
															: 'New apartment',
														request.description,
													)
												}
												width="100%"
												display="flex"
												alignItems="center"
												padding={0}
												borderRadius="sm"
												_hover={{
													bgColor: 'none',
													color: 'brand_dark',
												}}
												_active={{
													bgColor: 'none',
												}}
											>
												<Text width={'100%'} textAlign={'left'}>
													Share
												</Text>
											</Button>
											{authState.user?._id === request._user_ref._id && (
												<>
													<Button
														variant="ghost"
														leftIcon={<BiPencil />}
														isLoading={isLoading}
														_active={{
															bgColor: 'none',
														}}
														_hover={{
															bgColor: 'none',
															color: 'brand_dark',
														}}
														onClick={() => {
															router.push(
																`request/${request.seeking ? 'seeker' : 'host'}/${request.id}/edit`,
															)
														}}
														width="100%"
														display="flex"
														alignItems="center"
														padding={0}
														borderRadius="sm"
													>
														<Text width={'100%'} textAlign={'left'}>
															Edit
														</Text>
													</Button>
													<Button
														variant="ghost"
														leftIcon={<BiTrash />}
														isLoading={isLoading}
														bgColor="none"
														_active={{
															bgColor: 'none',
														}}
														onClick={async () =>
															await handleDeletePost({
																requestId: request.id,
																userId: request._user_ref._id,
															})
														}
														width="100%"
														display="flex"
														alignItems="center"
														padding={0}
														borderRadius="sm"
														_hover={{
															bgColor: 'none',
															color: 'red.500',
														}}
														color="red.400"
													>
														<Text width={'100%'} textAlign={'left'}>
															Delete
														</Text>
													</Button>
												</>
											)}
										</VStack>
									</PopoverBody>
								</PopoverContent>
							</Popover>
						</Flex>
						<Text color="text_muted" mt={'-8px'} fontSize={'sm'}>
							{timeAgo(request.updatedAt)}
						</Text>
					</Flex>
				</Flex>

				<Link
					href={`/request/${request.seeking ? 'seeker' : 'host'}/${request.id}`}
					style={{ textDecoration: 'none' }}
				>
					<Flex flexDirection={'column'}>
						<Flex
							alignItems={'center'}
							as="address"
							color="brand"
							fontSize={'sm'}
							gap={'4px'}
						>
							<Box>
								<BiLocationPlus size={'16px'} />
							</Box>
							<Truncate
								//@ts-ignore
								text={request._location_keyword_ref.name}
								max={70}
								showReadMore={false}
							/>
						</Flex>
						<Truncate text={request.description} showReadMore={true} />
					</Flex>
				</Link>
				<Link
					href={`/request/${request.seeking ? 'seeker' : 'host'}/${request.id}`}
					style={{ textDecoration: 'none' }}
				>
					<Flex justifyContent={'space-between'} flexWrap={'wrap'} gap={'8px'}>
						<Flex gap={DEFAULT_PADDING}>
							<Badge
								colorScheme={request.seeking ? 'orange' : 'teal'}
								textTransform="capitalize"
							>
								{request.seeking ? 'Seeker' : 'I have a space'}
							</Badge>
							<Badge
								colorScheme="green"
								rounded="md"
								textTransform={'capitalize'}
							>
								{request._service_ref.title}
							</Badge>
							{request._category_ref && (
								<Badge
									colorScheme="orange"
									rounded="md"
									textTransform={'capitalize'}
								>
									{request._category_ref.title}
								</Badge>
							)}
						</Flex>
						{request._property_type_ref && (
							<Badge
								border="1px"
								borderColor={'border-color'}
								rounded="md"
								_dark={{
									borderColor: 'dark_light',
									color: 'dark_lighter',
								}}
								textTransform={'capitalize'}
							>
								{request._property_type_ref.title}
							</Badge>
						)}
					</Flex>
				</Link>
				{request.images_urls && (
					<EachRequestMedia
						video={request.video_url}
						images={request.images_urls}
					/>
				)}
				<Flex
					alignItems={{ base: 'start', sm: 'center' }}
					flexDir={{ base: 'column', sm: 'row' }}
					justifyContent={'space-between'}
				>
					<Flex gap={DEFAULT_PADDING}>
						{!request.user_info?.hide_phone ? (
							<MainTooltip label="Call me" placement="top">
								<Button
									px={0}
									bg="none"
									color="text_muted"
									display={'flex'}
									gap={1}
									fontWeight={'light'}
									_hover={{
										color: 'brand',
									}}
									_dark={{
										color: 'dark_lighter',
									}}
									fontSize={{
										md: 'xl',
										sm: 'lg',
										base: 'base',
									}}
									onClick={async () => {
										if (authState.user?._id === request._user_ref._id) return
										await handleCall({
											number: request.user_info.primary_phone_number,
											recipient_id: request._user_ref._id,
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
								>
									<BiPhone />
								</Button>
							</MainTooltip>
						) : null}

						<MainTooltip label="Ask questions" placement="top">
							<Link
								href={`/messsages/${request._user_ref._id}`}
								style={{ textDecoration: 'none' }}
							>
								<Button
									px={0}
									bg="none"
									color="text_muted"
									display={'flex'}
									gap={1}
									fontWeight={'light'}
									_hover={{
										color: 'brand',
										bg: 'none',
										textDecoration: 'none',
										_dark: {
											color: 'brand',
										},
									}}
									_dark={{
										color: 'dark_lighter',
									}}
									fontSize={{
										md: 'xl',
										sm: 'lg',
										base: 'base',
									}}
								>
									<BiMessageRoundedDetail />
								</Button>
							</Link>
						</MainTooltip>
						<MainTooltip label="Bookmark" placement="top">
							<Button
								onClick={() => updateBookmark()}
								isLoading={isLoading}
								disabled={isLoading}
								px={0}
								bg="none"
								color="text_muted"
								display={'flex'}
								gap={1}
								fontWeight={'light'}
								_hover={{
									color: 'brand',
									bg: 'none',
									_dark: {
										color: 'brand',
									},
								}}
								_dark={{
									color: 'dark_lighter',
								}}
								fontSize={{
									md: 'xl',
									sm: 'lg',
									base: 'base',
								}}
							>
								{isBookmarked ? <BiSolidBookmark /> : <BiBookmark />}
							</Button>
						</MainTooltip>
					</Flex>
					<Flex
						_dark={{
							color: 'dark_lighter',
						}}
						alignItems={'center'}
					>
						<Text fontSize={{ base: 'base', md: 'lg' }} fontWeight={'bold'}>
							₦{request.budget.toLocaleString()}
						</Text>{' '}
						<Text
							textTransform={'capitalize'}
							fontSize={{ base: 'sm', md: 'base' }}
						>
							/{request.payment_type}
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)
}

const EachRequestMedia = ({
	images,
	video,
}: {
	images: string[]
	video?: string | null
}) => {
	const [clicked, setClicked] = useState(false)
	const [url, setUrl] = useState<string>('')
	const [type, setType] = useState<'video' | 'img'>('img')

	const handleClick = (url: string, type: 'video' | 'img') => {
		setType(type)
		setUrl(url)
		setClicked(true)
	}

	const close = () => setClicked(false)

	return (
		<>
			{clicked && (
				<Flex
					pos={'fixed'}
					bg={'dark'}
					zIndex={1000}
					top={0}
					right={0}
					left={0}
					bottom={0}
					alignItems={'center'}
					justifyContent={'center'}
					cursor={'pointer'}
					onClick={close}
					p={'32px'}
				>
					{type === 'img' ? (
						<Box overflow={'hidden'} rounded="md" bg="dark" w={'60%'} h={'60%'}>
							<Image
								src={url}
								alt="shared space"
								width={'full'}
								height={'full'}
								objectFit={'contain'}
								objectPosition={'center'}
							/>
						</Box>
					) : (
						<Flex
							position={'relative'}
							zIndex={50}
							overflow={'hidden'}
							rounded="md"
							bg="dark"
							maxH={'60%'}
							maxW={'700px'}
							minH={'500px'}
							minW={'280px'}
							w={'100%'}
							h={'100%'}
							alignItems={'center'}
							justifyContent={'center'}
						>
							<iframe src={url} width={'100%'} height={'100%'} />
						</Flex>
					)}
				</Flex>
			)}
			<Flex
				h={{
					md: '300px',
					base: '200px',
				}}
				gap={DEFAULT_PADDING}
				overflowX={'scroll'}
				alignItems={'center'}
			>
				<Flex
					flexDirection={'column'}
					gap={DEFAULT_PADDING}
					w={'90%'}
					flexWrap={'wrap'}
					h={'full'}
				>
					{video && (
						<Flex
							position={'relative'}
							overflow={'hidden'}
							cursor={'pointer'}
							rounded="md"
							alignItems={'center'}
							justifyContent={'center'}
							onClick={() => handleClick(video, 'video')}
						>
							<video src={video} width={'100%'} height={'100%'} />
							<Box pos="absolute" zIndex={0}>
								<BiPlayCircle size={'80px'} fill="#00bc73" cursor={'pointer'} />
							</Box>
						</Flex>
					)}
					{images.map((imgUrl, i) => (
						<Box
							key={i}
							position={'relative'}
							overflow={'hidden'}
							cursor={'pointer'}
							rounded="md"
							bg="dark"
							onClick={() => handleClick(imgUrl, 'img')}
						>
							<Image
								src={imgUrl}
								alt="image of the shared space"
								position={'relative'}
							/>
						</Box>
					))}
				</Flex>
			</Flex>
		</>
	)
}

const Truncate = ({
	text,
	max,
	showReadMore,
}: {
	text: string
	max?: number
	showReadMore: boolean
}) => {
	const maxChars = max || 200

	return (
		<Text>
			{truncateText(text, maxChars)}
			{text.length > maxChars && showReadMore && (
				<Text _hover={{ textDecoration: 'underline' }} as="span" color="brand">
					Read more..
				</Text>
			)}
		</Text>
	)
}
