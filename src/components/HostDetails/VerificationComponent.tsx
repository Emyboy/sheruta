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
	Divider, Image,
	Table, Tr, Td, Tbody, Heading, VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
	BiQuestionMark,
	BiSolidIdCard,
	BiSolidLock,
	BiSolidTimer,
} from 'react-icons/bi'
import { BsExclamationTriangle } from 'react-icons/bs'
import { FaSadTear } from 'react-icons/fa'
import { FaQuestion } from 'react-icons/fa6'
import { IconType } from 'react-icons/lib'
import { NINResponseDTO } from '../types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { UserInfoDTO } from '@/firebase/service/user-info/user-info.types'

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
									<Button variant="subtle" bgColor="brand">
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

const InfoSection = ({ title, data }: { title: string, data: any }) => (
	<Box p={5} borderWidth={1} borderRadius="lg" w="100%">
		<Heading size="md" mb={4}>{title}</Heading>
		<Table variant="simple">
			<Tbody>
				{Object.keys(data).map((key) => (
					<Tr key={key}>
						<Td ps={0} fontWeight="medium">{key}</Td>
						<Td>{data[key]}</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	</Box>
);

const UserProfile = ({ data }: { data: Record<string, any> }) => {
	const personalInfo = {
		Image: <Image boxSize="50px" src="/path/to/image.jpg" alt="User" />,
		"Surname": "Doe",
		"First name": "John",
		"Middle Name": "Edward",
		"Gender": "Male",
		"Age": "30",
		"Contact Number": "080-xxxx-xxxx",
		"Govt registered phone number": "080-xxxx-xxxx",
		"Marital Status": "Single",
		"Govt Registered Address": "123 Govt. Address",
		"Religion": "Christianity",
		"State Of Origin": "Lagos"
	};

	const occupation = {
		"Profession": "Software Engineer",
		"Employment Status": "Full-Time",
		"Company name": "Sheruta Ltd",
		"Work Address": "456 Tech Avenue",
		"Work Status": "Active"
	};

	const socials = {
		"Instagram": "@john_doe",
		"X": "@john_doe",
		"LinkedIn": "linkedin.com/in/johndoe",
		"Tiktok": "@johndoe",
		"Facebook": "facebook.com/johndoe"
	};

	const nextOfKin = {
		"Name of NOK": "Jane Doe",
		"Relationship with NOK": "Sister",
		"NOK number": "080-xxxx-xxxx",
		"NOK Address": "789 Family St"
	};

	return (
		<VStack spacing={6} align="start" w="100%" p={12} overflow={"scroll"}>
			<InfoSection title="Personal Information" data={personalInfo} />
			<InfoSection title="Occupation" data={occupation} />
			<InfoSection title="Socials" data={socials} />
			<InfoSection title="Next of Kin" data={nextOfKin} />
		</VStack>
	);
};

export default function VerificationComponent({
	request,
	hostNinData
}: {
	request: HostRequestDataDetails,
	hostNinData: NINResponseDTO | undefined,
}) {
	const {
		authState: { user, user_info, flat_share_profile },
	} = useAuthContext()

	const { showToast } = useCommon()

	const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean>(false)

	const [isLoading, setIsLoading] = useState<boolean>(false)

	const [hostUserInfo, setHostUserInfo] = useState<UserInfoDTO | undefined>(undefined)

	useEffect(() => {
		const getHostUserInfo = async() => {
			const userInfo = await UserInfoService.get(request._user_ref._id)
            setHostUserInfo(userInfo as UserInfoDTO)
		}

		getHostUserInfo()
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

			await SherutaDB.update({
				collection_name: DBCollectionName.flatShareRequests,
				data: {
					background_checks: { ...backgroundChecks },
				},
				document_id: request.id,
			})

			await createNotification({
				is_read: false,
				message: NotificationsBodyMessage.background_check,
				recipient_id: request._user_ref._id,
				type: 'background_check',
				sender_details: user
					? {
						avatar_url: user.avatar_url,
						first_name: user.first_name,
						last_name: user.last_name,
						id: user._id,
					}
					: null,
				action_url: `/user/${request._user_ref._id}`,
			})

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

	/***Remove this check */
	if (user_info?.is_verified === false || Object.keys(user_info?.nin_data || {}).length === 0) {
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

	if (request.user_info.is_verified === false || Object.keys(hostNinData || {}).length === 0) {
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
	if (request?.background_checks?.[user?._id]?.is_approved === false) {
		return (
			<AlertBox
				icon={FaSadTear}
				title="Request Not Approved"
				message="We're sorry, but the host did not approve your request"
			/>
		)
	}

	return (
		<UserProfile data={{hostUserInfo, hostNinData}}/>
	)
}
