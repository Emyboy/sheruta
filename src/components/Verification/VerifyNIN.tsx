'use client'

import { useEffect, useState } from 'react'
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	VStack,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Alert,
	AlertIcon,
	useColorModeValue,
} from '@chakra-ui/react'
import axios from 'axios'
import useCommon from '@/hooks/useCommon'
import { useAuthContext } from '@/context/auth.context'
import { NINResponseDTO } from '../types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import usePayment from '@/hooks/usePayment'
import { creditTable } from '@/constants'
import UserService from '@/firebase/service/user/user.firebase'
import { Timestamp } from 'firebase/firestore'

const doesGenderMatch = (NINGender: string, dbGender: string): boolean => {
	if (NINGender === 'm' && dbGender === 'male') {
		return true
	} else if (NINGender === 'f' && dbGender === 'female') {
		return true
	} else {
		return false
	}
}

const UpdateNameForm = ({ setShowNameUpdate, setError, loading, setLoading }: {
	setShowNameUpdate: (arg: boolean) => void
	setError: (arg: string | null) => void
	setLoading: (arg: boolean) => void
	loading: boolean
}) => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	const { authState: { user, user_info, user_settings, auth_loading, flat_share_profile }, setAuthState } = useAuthContext();
	const { showToast } = useCommon()

	useEffect(() => {
		if (user) {
			setFirstName(user.first_name)
			setLastName(user.last_name)
		}
	}, [user])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);

			await UserService.update({ document_id: user?._id as string, data: { last_name: lastName, first_name: firstName } })

			showToast({
				message: 'Your name has been updated',
				status: 'success'
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
					avatar_url: user?.avatar_url as string
				},
				user_info,
				user_settings,
				flat_share_profile,
				auth_loading,
			});

			setShowNameUpdate(false)
			setError(null)
			setLoading(false)
		} catch (err: any) {
			showToast({
				status: 'error',
				message: "Your name was not updated"
			})
			setLoading(false)
		}
	};

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
	);
};

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
	const [verificationAttempts, setVerificationAttempts] = useState<number>(0)
	const [showNameUpdate, setShowNameUpdate] = useState<boolean>(false);

	const {
		authState: { user, user_info },
	} = useAuthContext()

	const [_, paymentActions] = usePayment()
	const modalBg = useColorModeValue('white', '#777676')

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

	const handleSubmit = async (e: React.FormEvent) => {
		try {
			setLoading(true)
			e.preventDefault()

			if (nin.length !== 11 || isNaN(Number(nin))) {
				return
			}

			if (!hasEnoughCredits) {
				return showToast({
					status: 'info',
					message: "You don't have enough credits",
				})
			}

			const response = await axios.post('/api/verify-nin', {
				nin,
				lastname,
				userId,
				gender,
			})

			if (
				response.data.status == 'success' &&
				response?.data?.data &&
				Object.keys(response.data.data || {}).length > 0
			) {

				setVerificationAttempts(verificationAttempts + 1)

				if (verificationAttempts >= 4) {
					//initiate debit whether NIN belongs to the user or not
					await paymentActions.decrementCredit({
						amount: creditTable.VERIFICATION,
						user_id: user?._id as string,
					})

					setVerificationAttempts(0)
				}

				const data: NINResponseDTO = response.data.data

				//check if lastname and gender matches
				const lastNameMatches: boolean = data?.lastname == lastname;
				const genderMatches: boolean = doesGenderMatch(data.gender, gender as string);

				if (lastNameMatches && genderMatches) {
					//TODO: Handle scenarios where there can be an existing NIN on the database already
					await UserInfoService.update({
						data: { is_verified: true, date_of_birth: data.birthdate, nin },
						document_id: userId,
					})
					showToast({
						message: 'Your account has been verified successfully.',
						status: 'success',
					})
					setError(null)
					onClose()
					setLoading(false)

					window.location.reload()
				} else {
					//Only show the form if the lastname does not match with the one in the database
					if (!lastNameMatches) {
						setError('Your NIN verification failed because of an identity error. Please update your name and try again.');
						setShowNameUpdate(true)
					}

					showToast({
						message: 'NIN verification failed',
						status: 'error',
					})

					setLoading(false)
				}
			} else {
				setError('Your NIN verification failed because there was no response from the server. Please reload this page.');

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
		<>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Verify Your NIN</ModalHeader>
					<ModalCloseButton />
					<ModalBody bg={modalBg}>
						<Box>
							<Alert mb={5} status={(error) ? 'error' : 'info'} variant="subtle">
								<AlertIcon />
								{(error) ? error : "To avoid extra costs, please ensure that the NIN is correct and belongs to you"}
							</Alert>

							{(showNameUpdate) ? <UpdateNameForm setShowNameUpdate={setShowNameUpdate} setError={setError} loading={loading} setLoading={setLoading} /> : <form id='verify_nin' onSubmit={handleSubmit}>
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
							</form>}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}

export default VerifyNIN
