import { DEFAULT_PADDING } from '@/configs/theme'
import {
	Avatar,
	AvatarBadge,
	Badge,
	Box,
	Button,
	Flex,
	Image,
	Text,
	IconButton,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {
	BiBarChart,
	BiDotsHorizontalRounded,
	BiLocationPlus,
	BiMessageRoundedDetail,
	BiPhone,
} from 'react-icons/bi'
import MainTooltip from '../atoms/MainTooltip'
import { Link } from '@chakra-ui/next-js'
import { useRouter } from 'next/navigation'
import { timeAgo } from '@/utils/index.utils'
import { DocumentData, DocumentReference, getDoc } from 'firebase/firestore'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'

type Props = {
	[key: string]: any
}

const getDataFromRef = async (docRef: DocumentReference): Promise<any> => {
	const recordSnap = await getDoc(docRef)

	return recordSnap.exists() ? recordSnap.data() : null
}

export function EachRequest({}: Props) {
	return (
		<Box
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
					<Avatar
						src="https://bit.ly/prosper-baba"
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
							<Text>The first name</Text>
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
							4 hours ago
						</Text>
					</Flex>
				</Flex>
				<Flex flexDirection={'column'}>
					<Flex
						alignItems={'center'}
						as="address"
						color="brand"
						fontSize={'sm'}
					>
						<BiLocationPlus /> Somewhere in town
					</Flex>
					<Text>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi,
						distinctio, veritatis ipsa cum perferendis cumque fugit pariatur
						nobis ab deserunt impedit optio, repellat earum similique. Obcaecati
						pariatur exercitationem incidunt perspiciatis!{' '}
						<Link href={'/request/seeker/1234'} as="span" color="brand">
							Read more..
						</Link>
					</Text>
				</Flex>
				<Flex justifyContent={'space-between'}>
					<Flex gap={DEFAULT_PADDING}>
						<Badge colorScheme="green" rounded="md">
							Join Paddy
						</Badge>
						<Badge colorScheme="orange" rounded="md">
							Available
						</Badge>
					</Flex>
					<Badge
						border="1px"
						borderColor={'border-color'}
						rounded="md"
						_dark={{
							borderColor: 'dark_light',
							color: 'dark_lighter',
						}}
					>
						Private Room
					</Badge>
				</Flex>
				<EachRequestImages />
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
							₦500,000
						</Text>{' '}
						<Text>/month</Text>
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)
}

const EachRequestImages = () => {
	return (
		<Flex
			h={{
				md: '300px',
				base: '200px',
			}}
			gap={DEFAULT_PADDING}
		>
			<Box position={'relative'} overflow={'hidden'} rounded="md" w={'50%'}>
				<Image
					src={'/samples/2.png'}
					alt="shared space"
					position={'relative'}
					w="full"
				/>
			</Box>
			<Flex flexDirection={'column'} gap={DEFAULT_PADDING} w={'50%'} flex={1}>
				<Box position={'relative'} overflow={'hidden'} rounded="md" bg="dark">
					<Image
						src={'/samples/4.png'}
						alt="shared space"
						position={'relative'}
					/>
				</Box>
				<Box position={'relative'} overflow={'hidden'} rounded="md" bg="dark">
					<Image
						src={'/samples/9.png'}
						alt="shared space"
						position={'relative'}
					/>
				</Box>
			</Flex>
		</Flex>
	)
}

export function EachSeekerRequest({ seekerData }: Props) {
	// Destructure
	const {
		id,
		updatedAt,
		description,
		_user_ref,
		_service_ref,
		_location_keyword_ref,
		budget,
		payment_type,
	} = seekerData || {}

	const [userInfoDoc, setUserInfoDoc] = useState<DocumentData | undefined>(
		undefined,
	)
	const [userDoc, setUserDoc] = useState<any>(undefined)
	const [serviceTypeDoc, setServiceTypeDoc] = useState<any>(undefined)
	const [locationKeywordDoc, setLocationKeywordDoc] = useState<any>(undefined)

	useEffect(() => {
		const fetchData = async () => {
			if (_user_ref) {
				// Get poster's document from the database
				const [
					fetchedUserDoc,
					fetchedServiceTypeDoc,
					fetchedLocationKeywordDoc,
				] = await Promise.all([
					getDataFromRef(_user_ref),
					getDataFromRef(_service_ref),
					getDataFromRef(_location_keyword_ref),
				])

				setUserDoc(fetchedUserDoc)
				setServiceTypeDoc(fetchedServiceTypeDoc)
				setLocationKeywordDoc(fetchedLocationKeywordDoc)

				if (fetchedUserDoc?._id) {
					// Get userInfo
					const fetchedUserInfoDoc = await UserInfoService.get(
						fetchedUserDoc._id,
					)
					setUserInfoDoc(fetchedUserInfoDoc)
				}
			}
		}

		fetchData()
	}, [_user_ref, _service_ref, _location_keyword_ref])

	// Handle redirect
	const router = useRouter()

	const capitalizeString = (str: string): string => {
		return str && str.charAt(0).toUpperCase() + str.substring(1)
	}

	return (
		<Box
			fontSize={{
				md: 'md',
				base: 'sm',
			}}
			borderBottom={'1px'}
			borderColor={'border_color'}
			// py={DEFAULT_PADDING}
			p={4}
			bg="white"
			_dark={{
				bg: 'dark',
				borderColor: 'dark_light',
			}}
			width={'full'}
		>
			<Flex flexDirection={'column'} gap={DEFAULT_PADDING}>
				<Flex gap={5} alignItems={'center'}>
					<Avatar
						src={
							userDoc?.avatar_url
								? userDoc.avatar_url
								: 'https://bit.ly/prosper-baba'
						}
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
								{capitalizeString(userDoc?.first_name) +
									' ' +
									capitalizeString(userDoc?.last_name)}
							</Text>
							<IconButton
								fontSize={'24px'}
								aria-label="Options"
								icon={<BiDotsHorizontalRounded />}
							/>
						</Flex>
						<Text color="text_muted" fontSize={'sm'}>
							{timeAgo(updatedAt)}
						</Text>
					</Flex>
				</Flex>
				<Flex flexDirection={'column'}>
					<Flex
						alignItems={'center'}
						as="address"
						color="brand"
						fontSize={'sm'}
					>
						<BiLocationPlus /> {locationKeywordDoc?.name}
					</Flex>
					<Text>
						{description?.substring(0, 100)}
						{description && description?.length > 100 && (
							<Link href={`/request/seeker/${id}`} as="span" color="brand">
								{' '}
								Read more..
							</Link>
						)}
					</Text>
				</Flex>
				<Flex justifyContent={'space-between'}>
					<Flex gap={DEFAULT_PADDING}>
						<Badge colorScheme="green" rounded="md">
							{serviceTypeDoc?.title}
						</Badge>
					</Flex>
				</Flex>
				{/* <EachRequestImages /> */}
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
							&#8358;{budget?.toLocaleString()}
						</Text>{' '}
						<Text>{'/' + payment_type}</Text>
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)
}
