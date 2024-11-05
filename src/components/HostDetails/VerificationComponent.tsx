'use client'

import { creditTable } from '@/constants'
import { useAuthContext } from '@/context/auth.context'
import { useNotificationContext } from '@/context/notifications.context'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import { NotificationsBodyMessage } from '@/firebase/service/notifications/notifications.firebase'
import { HostRequestDataDetails } from '@/firebase/service/request/request.types'
import useCommon from '@/hooks/useCommon'
import { createNotification } from '@/utils/actions'
import {
	Box,
	Button,
	Circle,
	Flex,
	HStack,
	Icon,
	Text,
	useColorModeValue,
	Image,
	Table,
	Tr,
	Td,
	Tbody,
	Heading,
	VStack,
	IconButton,
	Alert,
	AlertIcon,
	Code,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
	BiBadgeCheck,
	BiSolidIdCard,
	BiSolidInfoCircle,
	BiSolidLock,
	BiSolidStar,
	BiSolidTimer,
	BiStar,
} from 'react-icons/bi'
import {
	BsExclamationTriangle,
	BsInfoCircle,
	BsQuestionCircle,
} from 'react-icons/bs'
import { FaSadTear } from 'react-icons/fa'
import { FaQuestion } from 'react-icons/fa6'
import { IconType } from 'react-icons/lib'
import { NINResponseDTO } from '../types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { UserInfoDTO } from '@/firebase/service/user-info/user-info.types'
import { AuthUser } from '@/firebase/service/auth/auth.types'
import UserService from '@/firebase/service/user/user.firebase'
import { calculateAge, convertRefToData } from '@/utils/index.utils'
import { FlatShareProfileData } from '@/firebase/service/flat-share-profile/flat-share-profile.types'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import { StateData } from '@/firebase/service/options/states/states.types'
import { HiExternalLink } from 'react-icons/hi'
import usePayment from '@/hooks/usePayment'
import { jsPDF } from 'jspdf'

type ButtonProps = {
	active: boolean
	label: string
	onClick?: () => void
	href?: string
	isLoading?: boolean
}

interface AlertBoxProps {
	icon: IconType
	title: string
	message: string
	button?: ButtonProps
}

interface UserProfileProps {
	hostUserInfo: UserInfoDTO | undefined
	hostNinData: NINResponseDTO | undefined
	hostUserData: AuthUser | undefined
	hostFlatShare: FlatShareProfileData | undefined
	stateData: StateData | undefined
}

const AlertBox: React.FC<AlertBoxProps> = ({
	icon,
	title,
	message,
	button,
}) => {
	const circleBgColor = useColorModeValue('#e4faa85c', '#e4faa814')

	return (
		<Box py={12} px={10}>
			<Flex flexDir="column" justifyContent="center" width="100%" minH="50dvh">
				<Flex alignItems="center" flexDir="column" gap="15px">
					<Circle
						borderRadius="full"
						bgColor={circleBgColor}
						minW="100px"
						minH="100px"
					>
						<Icon as={icon} w={16} h={16} color="green.400" />
					</Circle>
					<HStack gap="15px" alignItems="center" flexDir="column">
						<Text fontWeight="600">{title}</Text>
						<Text textAlign="center">{message}</Text>
						{button &&
							button.active &&
							(button.href ? (
								<Link href={button.href}>
									<Button variant="subtle" bgColor="brand" color="#fff">
										{button.label}
									</Button>
								</Link>
							) : (
								<Button
									isLoading={button.isLoading}
									isDisabled={button.isLoading}
									onClick={button.onClick}
									variant="subtle"
									bgColor="brand"
									color="#fff"
								>
									{button.label}
								</Button>
							))}
					</HStack>
				</Flex>
			</Flex>
		</Box>
	)
}

const InfoSection = ({ title, data }: { title: string; data: any }) => {
	const borderColor = useColorModeValue('#CBD5E0', '#333333')

	const handleDownloadPDF = () => {
		const doc = new jsPDF()
		doc.setFontSize(18)
		doc.text(title, 10, 10)

		let y = 20
		doc.setFontSize(12)

		Object.keys(data).forEach((key) => {
			doc.text(`${key}: ${data[key]}`, 10, y)
			y += 10
		})

		doc.save(`${title}.pdf`)
	}

	return (
		<Box
			p={5}
			borderWidth={1}
			borderColor={borderColor}
			borderRadius="lg"
			w="100%"
		>
			<Heading size="md" mb={4}>
				{title}
			</Heading>
			<Table variant="simple">
				<Tbody borderColor="gray">
					{Object.keys(data).map((key, index) => {
						const premiumData: string[] = [
							'Surname',
							'First Name',
							'Middle Name',
							'Gender',
							'Age',
							'Govt Registered Phone Number',
							'Marital Status',
							'Govt Registered Address',
							'Name of NOK',
							'State of NOK',
							'Town of NOK',
							'Address of NOK',
						]
						//
						return (
							<Tr
								key={key}
								// bgColor={ (premiumData.includes(key)) ? '#02cb3b0f' : '#fff'}
							>
								<Td
									ps={0}
									fontWeight="medium"
									borderBottom={
										Object.keys(data).length === index + 1
											? 0
											: `1px solid ${borderColor}`
									}
								>
									{key}
								</Td>
								<Td
									borderBottom={
										Object.keys(data).length === index + 1
											? 0
											: `1px solid ${borderColor}`
									}
								>
									{premiumData.includes(key) ? (
										<>
											<Icon color="brand" as={BiSolidInfoCircle} boxSize={4} />{' '}
										</>
									) : null}{' '}
									{data[key]}
								</Td>
							</Tr>
						)
					})}
				</Tbody>
			</Table>
			<Button mt={4} colorScheme="teal" onClick={handleDownloadPDF}>
				Download PDF
			</Button>
		</Box>
	)
}
const UserProfile = ({
	hostUserInfo,
	hostNinData,
	hostUserData,
	hostFlatShare,
	stateData,
}: UserProfileProps) => {
	// Personal Information
	const personalInfo = {
		Surname: hostNinData?.lastname || 'N/A',
		'First Name': hostNinData?.firstname || 'N/A',
		'Middle Name': hostNinData?.middlename || 'N/A',
		Gender: hostNinData?.gender === 'm' ? 'Male' : 'Female',
		Age: hostNinData?.birthdate ? calculateAge(hostNinData.birthdate) : 'N/A',
		'Contact Number': hostUserInfo?.primary_phone_number || 'N/A',
		'Govt Registered Phone Number': hostNinData?.phone || 'N/A',
		'Marital Status': hostNinData?.maritalStatus || 'N/A',
		'Govt Registered Address': hostNinData?.residence?.address1 || 'N/A',
		Religion: hostFlatShare?.religion || 'N/A',
		'State Of Origin': stateData?.name || 'N/A',
	}

	// Occupation Information
	const occupation = {
		Profession: hostFlatShare?.occupation || 'N/A',
		'Employment Status': hostFlatShare?.employment_status || 'N/A',
		'Company Name': 'Sheruta Ltd',
		'Work Address': '456 Tech Avenue',
		'Work Status': 'Active',
	}

	// Social Media Information with Links
	const socials = {
		Instagram: hostFlatShare?.instagram ? (
			<Link href={`https://instagram.com/${hostFlatShare.instagram}`}>
				<Button size={'sm'} colorScheme="teal">
					View &nbsp;
					<Icon boxSize={3} as={HiExternalLink} />
				</Button>
			</Link>
		) : (
			'N/A'
		),
		X: hostFlatShare?.twitter ? (
			<Link href={`https://twitter.com/${hostFlatShare.twitter}`}>
				<Button size={'sm'} colorScheme="teal">
					View &nbsp;
					<Icon boxSize={3} as={HiExternalLink} />
				</Button>
			</Link>
		) : (
			'N/A'
		),
		LinkedIn: hostFlatShare?.linkedin ? (
			<Link href={`https://linkedin.com/in/${hostFlatShare.linkedin}`}>
				<Button size={'sm'} colorScheme="teal">
					View &nbsp;
					<Icon boxSize={3} as={HiExternalLink} />
				</Button>
			</Link>
		) : (
			'N/A'
		),
		Tiktok: hostFlatShare?.tiktok ? (
			<Link href={`https://tiktok.com/@${hostFlatShare.tiktok}`}>
				<Button size={'sm'} colorScheme="teal">
					View &nbsp;
					<Icon boxSize={3} as={HiExternalLink} />
				</Button>
			</Link>
		) : (
			'N/A'
		),
		Facebook: hostFlatShare?.facebook ? (
			<Link href={`https://facebook.com/${hostFlatShare.facebook}`}>
				<Button size={'sm'} colorScheme="teal">
					View &nbsp;
					<Icon boxSize={3} as={HiExternalLink} />
				</Button>
			</Link>
		) : (
			'N/A'
		),
	}

	// Next of Kin Information
	const nextOfKin = {
		'Name of NOK':
			`${hostNinData?.nextOfKin?.lastname || ''} ${hostNinData?.nextOfKin?.firstname || ''}`.trim() ||
			'N/A',
		'State of NOK': hostNinData?.nextOfKin?.state,
		'Town of NOK': hostNinData?.nextOfKin?.town,
		'Address of NOK': hostNinData?.nextOfKin?.address1 || 'N/A',
	}

	return (
		<VStack spacing={6} align="start" w="100%" p={12} overflow="scroll">
			<Box textAlign={'center'} w="full">
				<Image
					m="auto"
					alt="user image"
					src={hostNinData?.photo || hostUserData?.avatar_url}
					objectFit={'cover'}
					width={150}
					height={150}
					borderRadius="100%"
				/>
			</Box>

			<Text
				display="inline-flex"
				gap={1}
				justifyContent={'center'}
				alignItems="center"
				textAlign={'center'}
				w="full"
				fontWeight="normal"
			>
				Fields with the icon <Icon color="brand" as={BiSolidInfoCircle} /> are
				NIMC verified
			</Text>
			<InfoSection title="Personal Information" data={personalInfo} />
			<InfoSection title="Occupation" data={occupation} />
			<InfoSection title="Socials" data={socials} />
			<InfoSection title="Next of Kin" data={nextOfKin} />
		</VStack>
	)
}

export default function VerificationComponent({
	request,
	hostNinData,
}: {
	request: HostRequestDataDetails
	hostNinData: NINResponseDTO | undefined
}) {
	const {
		authState: { user, user_info, flat_share_profile },
	} = useAuthContext()

	const { showToast } = useCommon()

	const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean>(false)

	const [isLoading, setIsLoading] = useState<boolean>(false)

	const [hostUserInfo, setHostUserInfo] = useState<UserInfoDTO | undefined>(
		undefined,
	)

	const [hostUserData, setHostUserData] = useState<AuthUser | undefined>(
		undefined,
	)

	const [hostFlatShare, setHostFlatShare] = useState<
		FlatShareProfileData | undefined
	>(undefined)

	const [stateData, setStateData] = useState<StateData | undefined>(undefined)

	const [_, paymentActions] = usePayment()

	useEffect(() => {
		const getHost = async () => {
			const [userInfo, userData, userFlatShare] = await Promise.all([
				UserInfoService.get(request._user_ref._id),
				UserService.get(request._user_ref._id),
				FlatShareProfileService.get(request._user_ref._id),
			])

			setStateData((await convertRefToData(userFlatShare?.state)) as StateData)

			setHostUserInfo(userInfo as UserInfoDTO)
			setHostUserData(userData as AuthUser)
			setHostFlatShare(userFlatShare as FlatShareProfileData)
		}

		getHost()
	}, [])

	useEffect(() => {
		if (
			(flat_share_profile?.credits as number) >= creditTable.BACKGROUND_CHECK
		) {
			setHasEnoughCredits(true)
		}
	}, [flat_share_profile])

	const handleClick = async () => {
		try {
			setIsLoading(true)
			if (!user) {
				return showToast({
					message: 'Please login to request background checks',
					status: 'error',
				})
			}

			if (!hasEnoughCredits) {
				return showToast({
					status: 'info',
					message: "You don't have enough credits",
				})
			}

			const backgroundChecks = request?.background_checks || {}

			if (backgroundChecks?.[user._id]) {
				return showToast({
					message: 'You have already requested a background check',
					status: 'error',
				})
			}

			backgroundChecks[user._id] = {
				is_approved: 'pending',
			}

			//debit before initiation and refund if request is rejected
			await paymentActions.decrementCredit({
				amount: creditTable.BACKGROUND_CHECK,
				user_id: user?._id as string,
			})

			await SherutaDB.update({
				collection_name: DBCollectionName.flatShareRequests,
				data: {
					background_checks: { ...backgroundChecks },
				},
				document_id: request.id,
			})

			// await createNotification({
			// 	is_read: false,
			// 	message: NotificationsBodyMessage.background_check,
			// 	recipient_id: request._user_ref._id,
			// 	type: 'background_check',
			// 	sender_details: user
			// 		? {
			// 				avatar_url: user.avatar_url,
			// 				first_name: user.first_name,
			// 				last_name: user.last_name,
			// 				id: user._id,
			// 			}
			// 		: null,
			// 	action_url: `/user/${request._user_ref._id}`,
			// })

			showToast({
				message: 'Background check request submitted successfully.',
				status: 'success',
			})

			setIsLoading(false)
		} catch (err) {
			console.log(err)
		} finally {
			setIsLoading(false)
		}
	}

	if (!user || !user_info) {
		return (
			<AlertBox
				icon={BiSolidLock}
				title="Authorization Required"
				message="Please login to proceed with this request"
			/>
		)
	}

	if (
		user_info?.is_verified === false ||
		Object.keys(user_info?.nin_data || {}).length === 0
	) {
		return (
			<AlertBox
				icon={BsExclamationTriangle}
				title="Account Verification Required"
				message="Please verify your account to proceed"
				button={{
					active: true,
					label: 'Verify account',
					href: '/verification',
				}}
			/>
		)
	}

	if (
		request.user_info.is_verified === false ||
		Object.keys(hostNinData || {}).length === 0
	) {
		return (
			<AlertBox
				icon={FaQuestion}
				title="Feature currently unavailable"
				message="This host's account is not verified yet."
			/>
		)
	}

	// request not initiated
	if (typeof request?.background_checks?.[user?._id] === 'undefined') {
		return (
			<AlertBox
				icon={BiSolidIdCard}
				title="Request A Backgound Check"
				message="Click on the button to request a backgound check of the host"
				button={{
					active: true,
					label: 'Request check',
					onClick: handleClick,
					isLoading,
				}}
			/>
		)
	}

	//request initiated but not approved
	if (request?.background_checks?.[user?._id]?.is_approved === 'pending') {
		return (
			<AlertBox
				icon={BiSolidTimer}
				title="Request In Progress"
				message="Relax, the host is yet to approve your background check request"
			/>
		)
	}

	//request initiated but not approved
	if (request?.background_checks?.[user?._id]?.is_approved === 'no') {
		return (
			<AlertBox
				icon={FaSadTear}
				title="Request Not Approved"
				message="We're sorry, but the host did not approve your request"
			/>
		)
	}

	return (
		<UserProfile
			hostUserInfo={hostUserInfo}
			hostUserData={hostUserData}
			hostNinData={hostNinData}
			hostFlatShare={hostFlatShare}
			stateData={stateData}
		/>
	)
}
