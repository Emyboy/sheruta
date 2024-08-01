import { DEFAULT_PADDING } from '@/configs/theme'
import { Link } from '@chakra-ui/next-js'
import {
	Avatar,
	AvatarBadge,
	Badge,
	Box,
	Button,
	Flex,
	Image,
	Spinner,
	Text,
} from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import {
	BiBarChart,
	BiDotsHorizontalRounded,
	BiLocationPlus,
	BiMessageRoundedDetail,
	BiPhone,
} from 'react-icons/bi'
import MainTooltip from '../atoms/MainTooltip'
import { useEffect, useState } from 'react'
import SherutaDB from '@/firebase/service/index.firebase'

type Props = { request: any }

export default function EachRequest({ request }: Props) {
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
			key={Math.random()}
			width={'full'}
		>
			<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
				<Link
					href={`/request/seeker/${request.uuid}`}
					style={{ textDecoration: 'none' }}
				>
					<Flex gap={5} alignItems={'center'}>
						<Avatar
							src={request._user_ref.avatar_url}
							size={{
								md: 'md',
								base: 'md',
							}}
						>
							<AvatarBadge boxSize="20px" bg="green.500" />
						</Avatar>
						<Flex
							gap={'0px'}
							flexDirection={'column'}
							justifyContent={'flex-start'}
							flex={1}
						>
							<Flex justifyContent={'space-between'} alignItems={'center'}>
								<Text>
									{request.title
										? request.title
										: request.seeking
											? 'Looking for apartment'
											: 'New apartment'}
								</Text>
								<Button
									color="text_muted"
									p={0}
									h="10px"
									_hover={{
										color: 'black',
										_dark: {
											color: 'white',
										},
									}}
									bg="none"
									fontSize={{
										md: 'xl',
										base: 'lg',
									}}
								>
									<BiDotsHorizontalRounded />
								</Button>
							</Flex>
							<Text color="text_muted" fontSize={'sm'}>
								{formatDistanceToNow(
									new Date(
										request.updatedAt.seconds * 1000 +
											request.updatedAt.nanoseconds / 1000000,
									),
									{ addSuffix: true },
								)}
							</Text>
						</Flex>
					</Flex>
				</Link>
				<Link
					href={`/request/seeker/${request.uuid}`}
					style={{ textDecoration: 'none' }}
				>
					<Flex flexDirection={'column'}>
						<Flex
							alignItems={'center'}
							as="address"
							color="brand"
							fontSize={'sm'}
						>
							<BiLocationPlus /> {request.google_location_text}
						</Flex>
						<Truncate
							text={request.description}
							link={`/request/seeker/${request.uuid}`}
						/>
					</Flex>
				</Link>
				<Link
					href={`/request/seeker/${request.uuid}`}
					style={{ textDecoration: 'none' }}
				>
					<Flex justifyContent={'space-between'}>
						<Flex gap={DEFAULT_PADDING}>
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
					<EachRequestImages
						video={request.video_url}
						images={request.images_urls}
					/>
				)}
				<Flex alignItems={'center'} justifyContent={'space-between'}>
					<Flex gap={DEFAULT_PADDING}>
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
									base: 'lg',
								}}
							>
								<BiPhone /> 35
							</Button>
						</MainTooltip>
						<MainTooltip label="Ask questions" placement="top">
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
								<BiMessageRoundedDetail /> 35
							</Button>
						</MainTooltip>
						<MainTooltip label="Engagements" placement="top">
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
								<BiBarChart /> 135
							</Button>
						</MainTooltip>
					</Flex>
					<Flex
						_dark={{
							color: 'dark_lighter',
						}}
						alignItems={'center'}
					>
						<Text fontSize={'lg'} fontWeight={'bold'}>
							₦{request.budget.toLocaleString()}
						</Text>{' '}
						<Text textTransform={'capitalize'}>/{request.payment_type}</Text>
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)
}

const EachRequestImages = ({
	images,
	video,
}: {
	images: string[]
	video?: string
}) => {
	const [clicked, setClicked] = useState(false)
	const [url, setUrl] = useState<string>('')
	const [type, setType] = useState<'video' | 'img'>('img')

	const [videoUrl, setVideoUrl] = useState<string | null>(null)
	const [imagesUrl, setImagesUrl] = useState<string[]>([])
	const [loadingMedia, setLoadingMedia] = useState(false)

	const handleClick = (url: string, type: 'video' | 'img') => {
		setType(type)
		setUrl(url)
		setClicked(true)
	}

	const close = () => setClicked(false)

	const getMediaUrl = async () => {
		setLoadingMedia(true)
		try {
			if (video) {
				const videoUrl = await SherutaDB.getMediaUrl(video)
				setVideoUrl(videoUrl)
			}

			const imgUrls = await Promise.all(
				images.map(async (img) => await SherutaDB.getMediaUrl(img)),
			)
			setImagesUrl(imgUrls.filter((url) => url !== null))
		} catch (error) {
			console.error('Error fetching media URLs:', error)
		}
		setLoadingMedia(false)
	}

	useEffect(() => {
		const fetchMediaUrls = async () => {
			await getMediaUrl()
		}

		fetchMediaUrls()
	}, [])

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
							w={'60%'}
							h={'60%'}
							alignItems={'center'}
							justifyContent={'center'}
						>
							<video src={url} width={'full'} height={'full'} />
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
				justifyContent={'center'}
			>
				{loadingMedia ? (
					<Spinner />
				) : (
					<Flex
						flexDirection={'column'}
						gap={DEFAULT_PADDING}
						w={'90%'}
						flexWrap={'wrap'}
						h={'full'}
					>
						{videoUrl && (
							<Box
								position={'relative'}
								overflow={'hidden'}
								cursor={'pointer'}
								rounded="md"
								onClick={() => handleClick(videoUrl, 'video')}
							>
								<video src={videoUrl} />
							</Box>
						)}
						{!!imagesUrl.length &&
							imagesUrl.map((imgUrl, i) => (
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
				)}
			</Flex>
		</>
	)
}

const Truncate = ({ text, link }: { text: string; link: string }) => {
	const maxChars = 200

	const truncatedText =
		text.length > maxChars ? text.substring(0, maxChars) + '... ' : text

	return (
		<Text>
			{truncatedText}
			{text.length > maxChars && (
				<Link href={link} as="span" color="brand">
					Read more..
				</Link>
			)}
		</Text>
	)
}
