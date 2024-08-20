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
	ModalFooter,
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

const doesGenderMatch = (NINGender: string, dbGender: string): boolean => {
	if (NINGender === 'm' && dbGender === 'male') {
		return true
	} else if (NINGender === 'f' && dbGender === 'female') {
		return true
	} else {
		return false
	}
}

const VerifyNIN = ({
	isOpen,
	onOpen,
	onClose,
	hasEnoughCredits,
}: {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
	hasEnoughCredits: boolean
}) => {
	const [nin, setNin] = useState<string>('')
	const [lastname, setLastname] = useState<string | undefined>('')
	const [gender, setGender] = useState<string | undefined>('')
	const [userId, setUserId] = useState<string>('')
	const { showToast } = useCommon()
	const [loading, setLoading] = useState<boolean>(false)
	const {
		authState: { user, user_info },
	} = useAuthContext()

	const [_, paymentActions] = usePayment()
	const modalBg = useColorModeValue('white', 'black')

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

				//initiate debit whether NIN belongs to the user or not
				await paymentActions.decrementCredit({
					amount: creditTable.VERIFICATION,
					user_id: user?._id as string,
				})

				const data: NINResponseDTO = response.data.data

				//check if lastname and gender matches
				if (
					data?.lastname == lastname &&
					doesGenderMatch(data.gender, gender as string)
				) {

					//TODO: Handle scenarios where there can be an existing NIN on the database already
					await UserInfoService.update({
						data: { is_verified: true, date_of_birth: data.birthdate, nin },
						document_id: userId,
					})
					showToast({
						message: 'Your account has been verified successfully.',
						status: 'success',
					})

					onClose()
					setLoading(false)

					window.location.reload()
				} else {
					showToast({
						message: 'NIN verification failed [Identity Clash]',
						status: 'error',
					})
					setLoading(false)
				}
			} else {
				showToast({
					message: 'NIN verification failed [No Response Data]',
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
							<Alert mb={5} status={'info'} variant="subtle">
								<AlertIcon />
								To avoid extra costs, please ensure that the NIN is correct and
								belongs to you
							</Alert>

							<form onSubmit={handleSubmit}>
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
								</VStack>
							</form>
						</Box>
					</ModalBody>
					<ModalFooter>
						<Button
							isLoading={loading}
							colorScheme="green"
							onClick={handleSubmit}
							width="full"
						>
							Verify NIN
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}

export default VerifyNIN
