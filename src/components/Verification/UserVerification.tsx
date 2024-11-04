'use client'

import {
	Box,
	VStack,
	HStack,
	Text,
	Icon,
	Flex,
	Circle,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react'
import { IconType } from 'react-icons/lib'
import VerifyNIN from './VerifyNIN'
import { useAuthContext } from '@/context/auth.context'
import { useEffect, useState } from 'react'
import useCommon from '@/hooks/useCommon'
import { BiIdCard, BiMobileAlt, BiUser } from 'react-icons/bi'
import { creditTable } from '@/constants'

const UserVerification = () => {
	const headingColor = useColorModeValue('#111717', '#fff')
	const descriptionColor = useColorModeValue('#11171799', '#fff')

	const { isOpen, onOpen, onClose } = useDisclosure()

	const {
		authState: { user_info, flat_share_profile },
	} = useAuthContext()

	const { showToast } = useCommon()

	const [isVerified, setIsVerified] = useState<boolean>(false)
	const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean>(false)

	useEffect(() => {
		if (typeof window !== 'undefined' && !user_info) {
			window.location.assign('/')
		}
	}, [user_info])

	useEffect(() => {
		if (
			typeof user_info?.is_verified !== 'undefined' &&
			typeof user_info?.is_verified === 'boolean'
		) {
			setIsVerified(user_info.is_verified)
		}
	}, [user_info])

	useEffect(() => {
		if ((flat_share_profile?.credits as number) >= creditTable.VERIFICATION) {
			setHasEnoughCredits(true)
		}
	}, [flat_share_profile])

	const circleBgColor = useColorModeValue('#e4faa85c', '#e4faa814')

	return (
		<Flex direction="column" align="center" justify="center" bg="gray.50">
			<VStack spacing={2} textAlign="center">
				<Circle bgColor={circleBgColor} minW={'130px'} minH={'130px'}>
					<Icon as={BiUser} w={16} h={16} color="green.400" />
				</Circle>
				<Text fontSize="3xl" color={headingColor} fontWeight="500">
					Users Verification
				</Text>
				<Text fontSize="md" color={descriptionColor}>
					Sheruta requires you to provide accurate information and upload a
					valid government-issued ID. Please note that you will be charged{' '}
					{creditTable.VERIFICATION} credits for every 4 verification attempts.
				</Text>

				<HStack
					spacing={5}
					mt={'5'}
					w="full"
					justify="center"
					flexWrap={['wrap', 'nowrap']} // wrap on mobile, nowrap on larger screens
				>
					<VerificationCard
						onOpen={() =>
							showToast({
								message: 'This feature is coming soon.',
								status: 'info',
							})
						}
						icon={BiMobileAlt}
						text="Verify Phone"
						subText="coming soon..."
					/>
					<VerificationCard
						onOpen={
							!isVerified
								? // && hasEnoughCredits
									onOpen
								: !true
									? // !hasEnoughCredits
										() =>
											showToast({
												message: "You don't have enough credits.",
												status: 'info',
											})
									: () =>
											showToast({
												message: 'Your account has been verified already',
												status: 'info',
											})
						}
						icon={BiIdCard}
						text="Verify NIN"
						subText="National Identification Number"
					/>
				</HStack>
			</VStack>
			<VerifyNIN
				hasEnoughCredits={hasEnoughCredits}
				isOpen={isOpen}
				onClose={onClose}
				// onOpen={onOpen}
			/>
		</Flex>
	)
}

const VerificationCard = ({
	icon,
	text,
	subText,
	onOpen,
}: {
	icon: IconType
	text: string
	subText: string
	onOpen: () => void
}) => {
	return (
		<Box _hover={{ transform: 'scale(1.03)' }}>
			<VStack
				border="1px"
				borderColor="#00BC73"
				borderRadius="lg"
				p={4}
				w="237px"
				minH="245px"
				justify="center"
				align="center"
				spacing={4}
				_hover={{ borderColor: 'green.400' }}
				cursor={'pointer'}
				onClick={onOpen}
				boxShadow={'xl'}
			>
				<Circle bgColor={'#00BC731A'} minW={'50px'} minH={'50px'}>
					<Icon as={icon} w={8} h={8} color="green.400" />
				</Circle>
				<Text mt="2" fontSize="18px" fontWeight="500" color="gray.300">
					{text}
				</Text>

				<Text color={'gray'} fontSize={'sm'}>
					{subText}
				</Text>
			</VStack>
		</Box>
	)
}

export default UserVerification
