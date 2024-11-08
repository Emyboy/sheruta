'use client'

import { creditTable } from '@/constants'
import { useAuthContext } from '@/context/auth.context'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import UserService from '@/firebase/service/user/user.firebase'
import useCommon from '@/hooks/useCommon'
import usePayment from '@/hooks/usePayment'
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react'
import axios from 'axios'
import { Timestamp } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { PremblyNINVerificationResponse } from '../types'
import SherutaDB from '@/firebase/service/index.firebase'
import { UserInfoDTO } from '@/firebase/service/user-info/user-info.types'

const doesGenderMatch = (NINGender: string, dbGender: string): boolean => {
	if (NINGender === 'm' && dbGender === 'male') {
		return true
	} else if (NINGender === 'f' && dbGender === 'female') {
		return true
	} else {
		return false
	}
}

const UpdateNameForm = ({
	setShowNameUpdate,
	setError,
	loading,
	setLoading,
}: {
	setShowNameUpdate: (arg: boolean) => void
	setError: (arg: string | null) => void
	setLoading: (arg: boolean) => void
	loading: boolean
}) => {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')

	const {
		authState: {
			user,
			user_info,
			user_settings,
			auth_loading,
			flat_share_profile,
		},
		setAuthState,
	} = useAuthContext()
	const { showToast } = useCommon()

	useEffect(() => {
		if (user) {
			setFirstName(user.first_name)
			setLastName(user.last_name)
		}
	}, [user])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			setLoading(true)

			await UserService.update({
				document_id: user?._id as string,
				data: { last_name: lastName, first_name: firstName },
			})

			showToast({
				message: 'Your name has been updated',
				status: 'success',
			})
			setAuthState({
				user: {
					...user,
					last_name: lastName,
					first_name: firstName,
					_id: user?._id as string,
					last_seen: user?.last_seen as Timestamp,
					email: user?.email as string,
					providerId: user?.providerId as string,
					avatar_url: user?.avatar_url as string,
					email_verified: user?.email_verified || false,
				},
				user_info,
				user_settings,
				flat_share_profile,
				auth_loading,
			})

			setShowNameUpdate(false)
			setError(null)
			setLoading(false)
		} catch (err: any) {
			showToast({
				status: 'error',
				message: 'Your name was not updated',
			})
			setLoading(false)
		}
	}

	return (
		<form id="update_name" onSubmit={handleSubmit}>
			<VStack spacing={4}>
				<FormControl id="first-name">
					<FormLabel>First Name</FormLabel>
					<Input
						defaultValue={firstName}
						type="text"
						onChange={(e) => setFirstName(e.target.value)}
						placeholder="Enter your first name"
					/>
				</FormControl>

				<FormControl id="last-name">
					<FormLabel>Last Name</FormLabel>
					<Input
						defaultValue={lastName}
						type="text"
						onChange={(e) => setLastName(e.target.value)}
						placeholder="Enter your last name"
					/>
				</FormControl>
				<Button
					mt={3}
					mb={5}
					isLoading={loading}
					colorScheme="green"
					onClick={handleSubmit}
					width="full"
				>
					Update Name
				</Button>
			</VStack>
		</form>
	)
}

const VerifyNIN = ({
	isOpen,
	// onOpen,
	onClose,
	hasEnoughCredits,
}: {
	isOpen: boolean
	// onOpen: () => void
	onClose: () => void
	hasEnoughCredits: boolean
}) => {
	const [nin, setNin] = useState<string>('')
	const [lastname, setLastname] = useState<string | undefined>('')
	const [gender, setGender] = useState<string | undefined>('')
	const [userId, setUserId] = useState<string>('')
	const { showToast } = useCommon()
	const [loading, setLoading] = useState<boolean>(false)
	const [showNameUpdate, setShowNameUpdate] = useState<boolean>(false)
	const modalContentColor = useColorModeValue('#fff', '#2D3748')
	const {
		authState: { user, user_info },
	} = useAuthContext()

	const [_, paymentActions] = usePayment()
	const modalBg = useColorModeValue('white', '#1a1a1a')

	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (Object.keys(user || {}).length > 0 && user) {
			const hasLastName: boolean =
				typeof user?.last_name != 'undefined' &&
				typeof user.last_name === 'string'

			setLastname(hasLastName ? user.last_name : undefined)
			setUserId(user._id)
		}
	}, [user])

	useEffect(() => {
		if (
			user_info &&
			Object.keys(user_info || {}).length > 0 &&
			typeof user_info?.gender === 'string'
		) {
			setGender(user_info?.gender)
		}
	}, [user_info])

	const isNinInUse = async (submittedNIN: string): Promise<boolean> => {
		const result: UserInfoDTO[] | null = await SherutaDB.getAll({
			collection_name: 'user_info',
		})

		return result?.some((doc) => doc?.nin === submittedNIN) || false
	}

	const handleSubmit = async (e: React.FormEvent) => {
		try {
			setLoading(true)
			e.preventDefault()

			if (nin.length !== 11 || isNaN(Number(nin))) {
				return
			}

			if (await isNinInUse(nin)) {
				return showToast({
					status: 'error',
					message: 'This NIN is already in use',
				})
			}

			if (!hasEnoughCredits) {
				return showToast({
					status: 'info',
					message: "You don't have enough credits",
				})
			}

			const response = await axios.post('/api/verify-nin', {
				nin,
			})

			if (
				response?.data?.status &&
				Boolean(response?.data?.status) &&
				response?.data?.nin_data &&
				Object.keys(response.data.nin_data || {}).length > 0
			) {
				await paymentActions.decrementCredit({
					amount: creditTable.VERIFICATION,
					user_id: user?._id as string,
				})

				const data: PremblyNINVerificationResponse = response.data.nin_data

				//check if lastname and gender matches
				// const lastNameMatches: boolean = data?.surname == lastname
				// const genderMatches: boolean = doesGenderMatch(data.gender, gender!)
				await UserInfoService.update({
					data: {
						is_verified: true,
						date_of_birth: data.birthdate,
						nin,
						nin_data: { ...data },
					},
					document_id: userId,
				})
				showToast({
					message: 'Your account has been verified successfully.',
					status: 'success',
				})
				setError(null)
				onClose()
				setLoading(false)

				window.location.replace('/')
			} else {
				setError(
					'Your NIN verification failed because there was no response from the server. Please reload this page.',
				)

				showToast({
					message: 'NIN verification failed',
					status: 'error',
				})
				setLoading(false)
			}
		} catch (err: any) {
			console.error('Error verifying NIN:', err)
			showToast({
				status: 'error',
				message: 'NIN verification error, please try again',
			})
			setLoading(false)
		}
	}

	return (
		<React.Fragment>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent bgColor={modalBg}>
					<ModalHeader>Verify Your NIN</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box>
							<Alert mb={5} status={error ? 'error' : 'info'} variant="subtle">
								<AlertIcon />
								{error
									? error
									: 'To avoid extra costs, please ensure that the NIN is correct and belongs to you'}
							</Alert>

							{showNameUpdate ? (
								<UpdateNameForm
									setShowNameUpdate={setShowNameUpdate}
									setError={setError}
									loading={loading}
									setLoading={setLoading}
								/>
							) : (
								<form id="verify_nin" onSubmit={handleSubmit}>
									<VStack spacing={4}>
										<FormControl
											id="nin"
											isInvalid={nin.length !== 11 && nin.length > 0}
										>
											<FormLabel>Enter your NIN</FormLabel>
											<Input
												type="text"
												value={nin}
												onChange={(e) => setNin(e.target.value)}
												placeholder="Enter your 11-digit NIN"
												maxLength={11}
											/>
											<FormErrorMessage>
												Please enter a valid 11-digit NIN
											</FormErrorMessage>
										</FormControl>

										<Button
											mt={3}
											mb={5}
											isLoading={loading}
											colorScheme="green"
											onClick={handleSubmit}
											width="full"
										>
											Verify NIN
										</Button>
									</VStack>
								</form>
							)}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</React.Fragment>
	)
}

export default VerifyNIN
