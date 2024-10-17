'use client'

import CloseIcon from '@/assets/svg/close-icon-dark'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { NotificationsBodyMessage } from '@/firebase/service/notifications/notifications.firebase'
import {
	FlatShareRequest,
	HostRequestDataDetails,
} from '@/firebase/service/request/request.types'
import useCommon from '@/hooks/useCommon'
import useHandleBookmark from '@/hooks/useHandleBookmark'
import useShareSpace from '@/hooks/useShareSpace'
import { createNotification } from '@/utils/actions'
import {
	getTimeDifferenceInHours,
	handleCall,
	timeAgo,
	truncateText,
} from '@/utils/index.utils'
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
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
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
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import { LuBadgeCheck } from 'react-icons/lu'
import MainTooltip from '../atoms/MainTooltip'
import useAnalytics from '@/hooks/useAnalytics'
import { AnalyticsDataDetails } from '@/firebase/service/analytics/analytics.types'

type Props = { request: FlatShareRequest }

export default function EachRequest({ request }: Props) {
	const router = useRouter()
	const { showToast } = useCommon()
	const { colorMode } = useColorMode()
	const { authState } = useAuthContext()

	const { bookmarkId, isBookmarkLoading, toggleSaveApartment } =
		useHandleBookmark(request._id, request.user._id)
	const { copyShareUrl, handleDeletePost, isLoading } = useShareSpace()
	const { addAnalyticsData, getAnalyticsData } = useAnalytics()

	const [analyticsData, setAnalyticsData] = useState<
		AnalyticsDataDetails | undefined
	>(undefined)

	// useEffect(() => {
	// 	const fetchAnalyticsData = async () => {
	// 		try {
	// 			const data = await getAnalyticsData(request.location._id)
	// 			setAnalyticsData(data)
	// 		} catch (error) {
	// 			console.error('Error fetching analytics data:', error)
	// 		}
	// 	}

	// 	fetchAnalyticsData()
	// }, [])

	const deletePost = async (): Promise<void> => {
		try {
			await handleDeletePost({
				requestId: request._id,
				userId: request.user._id,
			})
		} catch (err) {
			showToast({
				message: 'This post was not deleted',
				status: 'error',
			})
		}
	}

	const canInteract = !(
		request.availability_status === 'reserved' &&
		authState.user?._id !== request.reserved_by
	)

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
						href={canInteract ? `/user/${request.user._id}` : ''}
						style={{ textDecoration: 'none' }}
						onClick={async () =>
							(canInteract || authState.user?._id !== request.user._id) &&
							(await createNotification({
								is_read: false,
								message: NotificationsBodyMessage.profile_view,
								recipient_id: request.user._id,
								type: 'profile_view',
								sender_details: authState.user
									? {
											avatar_url: authState.user.avatar_url,
											first_name: authState.user.first_name,
											last_name: authState.user.last_name,
											id: authState.user._id,
										}
									: null,
								action_url: `/user/${request.user._id}`,
							}))
						}
					>
						<Avatar
							src={request.user.avatar_url}
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
							{canInteract ? (
								<Link
									href={`/user/${request.user._id}`}
									style={{ textDecoration: 'none' }}
									onClick={async () =>
										authState.user?._id !== request.user._id &&
										(await createNotification({
											is_read: false,
											message: NotificationsBodyMessage.profile_view,
											recipient_id: request.user._id,
											type: 'profile_view',
											sender_details: authState.user
												? {
														avatar_url: authState.user.avatar_url,
														first_name: authState.user.first_name,
														last_name: authState.user.last_name,
														id: authState.user._id,
													}
												: null,
											action_url: `/user/${request.user._id}`,
										}))
									}
								>
									<Flex alignItems={'center'} gap={{ base: '4px', md: '8px' }}>
										<Text
											textTransform={'capitalize'}
											fontSize={{ base: 'base', md: 'lg' }}
										>
											{request.user.last_name} {request.user.first_name}
										</Text>
										{request.user_info?.is_verified && (
											<LuBadgeCheck fill="#00bc73" />
										)}
									</Flex>
								</Link>
							) : (
								<Text
									textTransform={'capitalize'}
									fontSize={{ base: 'base', md: 'lg' }}
									fontWeight={600}
								>
									Reserved
								</Text>
							)}

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
														`/request/${request.seeking ? 'seeker' : 'host'}/${request._id}`,
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
											{authState.user?._id === request.user._id && (
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
																`request/${request.seeking ? 'seeker' : 'host'}/${request._id}/edit`,
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
														onClick={async () => await deletePost()}
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
							{request.availability_status === 'reserved'
								? `Checkback in
									${getTimeDifferenceInHours(request.reservation_expiry)} hours`
								: timeAgo(request.createdAt)}
						</Text>
					</Flex>
				</Flex>

				<Link
					href={`/request/${request.seeking ? 'seeker' : 'host'}/${request._id}`}
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
								text={request.location.name}
								max={70}
								showReadMore={false}
							/>
						</Flex>
						<Truncate text={request.description} showReadMore={true} />
					</Flex>
				</Link>
				<Link
					href={`/request/${request.seeking ? 'seeker' : 'host'}/${request._id}`}
					style={{ textDecoration: 'none' }}
				>
					<Flex justifyContent={'space-between'} flexWrap={'wrap'} gap={'8px'}>
						<Flex gap={DEFAULT_PADDING}>
							{typeof request?.seeking !== 'undefined' && request.seeking ? (
								<Badge colorScheme={'orange'} textTransform="capitalize">
									Seeker
								</Badge>
							) : null}
							<Badge
								colorScheme="green"
								rounded="md"
								textTransform={'capitalize'}
							>
								{request.service.name}
							</Badge>
							{request.category && (
								<Badge
									colorScheme="orange"
									rounded="md"
									textTransform={'capitalize'}
								>
									{request.category.name}
								</Badge>
							)}
						</Flex>
						{request.property_type && (
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
								{request.property_type.name}
							</Badge>
						)}
					</Flex>
				</Link>
				{request.image_urls && request.image_urls.length > 0 && (
					<EachRequestMedia
						video={request.video_url}
						images={request.image_urls}
					/>
				)}
				<Flex
					alignItems={{ base: 'start', sm: 'center' }}
					flexDir={'row'}
					justifyContent={'space-between'}
				>
					<Flex gap={DEFAULT_PADDING}>
						{!request.user_info?.hide_phone ? (
							<MainTooltip label="Call me" placement="top">
								<Button
									isDisabled={
										!canInteract || authState.user?._id === request.user._id
									}
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
										if (canInteract) {
											try {
												// Handle the call
												await handleCall({
													number: request.user_info.primary_phone_number,
													recipient_id: request.user._id,
													sender_details: authState.user
														? {
																avatar_url: authState.user.avatar_url,
																first_name: authState.user.first_name,
																last_name: authState.user.last_name,
																id: authState.user._id,
															}
														: null,
												})
												await addAnalyticsData('calls', request.location._id)
											} catch (error) {
												console.error(
													'Error during call or analytics update:',
													error,
												)
											}
										}
									}}
								>
									<BiPhone />
									{/* { analyticsData?.calls || 0} */}
								</Button>
							</MainTooltip>
						) : null}

						<MainTooltip label="Ask questions" placement="top">
							<Button
								isDisabled={
									!canInteract || authState.user?._id === request.user._id
								}
								onClick={async () => {
									if (canInteract) {
										try {
											// Handle the redirect
											const res = await addAnalyticsData(
												'messages',
												request.location._id,
											)

											if (res)
												window.location.assign(`/messages/${request.user._id}`)
										} catch (error) {
											console.error(
												'Error during messaging or analytics update:',
												error,
											)
										}
									}
								}}
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
								{/* {analyticsData?.messages || 0} */}
							</Button>
						</MainTooltip>
						<MainTooltip label="Bookmark" placement="top">
							<Button
								onClick={toggleSaveApartment}
								isLoading={isBookmarkLoading}
								isDisabled={isBookmarkLoading}
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
								{bookmarkId ? <BiSolidBookmark /> : <BiBookmark />}
							</Button>
						</MainTooltip>
					</Flex>
					<Flex
						_dark={{
							color: 'dark_lighter',
						}}
						alignSelf="center"
						alignItems="center"
					>
						<Text fontSize={{ base: 'base', md: 'lg' }} fontWeight={'bold'}>
							₦{request.rent.toLocaleString()}
						</Text>{' '}
						<Text
							textTransform={'capitalize'}
							fontSize={{ base: 'sm', md: 'base' }}
						>
							{/* /{request.payment_type} */}
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
	const allMedias: {
		url: string
		type: string
	}[] = video
		? [
				{ url: video, type: 'video' },
				...images.map((url) => ({ url, type: 'img' })),
			]
		: images.map((url) => ({ url, type: 'img' }))

	const [clicked, setClicked] = useState(false)
	const [activeIdx, setActiveIdx] = useState<number>(0)

	const handleClick = (idx: number) => {
		if (!clicked) setClicked(true)

		setActiveIdx(idx)
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
				>
					<Box
						pos={'absolute'}
						top={{ base: '16px', md: '30px' }}
						right={{ base: '16px', md: '30px' }}
						onClick={close}
						zIndex={1001}
					>
						<CloseIcon />
					</Box>
					{activeIdx < allMedias.length - 1 && (
						<Box
							position={'absolute'}
							right={'5%'}
							top={'50%'}
							transform={'translateY(-50%)'}
							color={'white'}
							fontSize={{ base: '24px', md: '48px' }}
							zIndex={1001}
							onClick={() => setActiveIdx((prev) => prev + 1)}
						>
							<FaChevronCircleRight />
						</Box>
					)}
					{activeIdx > 0 && (
						<Box
							position={'absolute'}
							left={'5%'}
							top={'50%'}
							transform={'translateY(-50%)'}
							color={'white'}
							fontSize={{ base: '24px', md: '48px' }}
							zIndex={1001}
							onClick={() => setActiveIdx((prev) => prev - 1)}
						>
							<FaChevronCircleLeft />
						</Box>
					)}
					{allMedias[activeIdx].type === 'img' ? (
						<Box overflow={'hidden'} rounded="md" w={'70%'} h={'70%'}>
							<Image
								src={allMedias[activeIdx].url}
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
							maxH={'60%'}
							maxW={'700px'}
							minH={'500px'}
							minW={'280px'}
							w={'100%'}
							h={'100%'}
							alignItems={'center'}
							justifyContent={'center'}
						>
							<iframe
								src={allMedias[activeIdx].url}
								width={'100%'}
								height={'100%'}
							/>
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
					{allMedias.map((media, i) => (
						<React.Fragment key={i}>
							{media.type === 'video' ? (
								<Flex
									position={'relative'}
									overflow={'hidden'}
									cursor={'pointer'}
									rounded="md"
									alignItems={'center'}
									justifyContent={'center'}
									onClick={() => handleClick(i)}
								>
									<video src={media.url} width={'100%'} height={'100%'} />
									<Box pos="absolute" zIndex={0}>
										<BiPlayCircle
											size={'80px'}
											fill="#00bc73"
											cursor={'pointer'}
										/>
									</Box>
								</Flex>
							) : (
								<Box
									position={'relative'}
									overflow={'hidden'}
									cursor={'pointer'}
									rounded="md"
									bg="dark"
									onClick={() => handleClick(i)}
								>
									<Image
										src={media.url}
										alt="image of the shared space"
										position={'relative'}
									/>
								</Box>
							)}
						</React.Fragment>
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
