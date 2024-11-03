'use client'

import CloseIcon from '@/assets/svg/close-icon-dark'
import CreditInfo from '@/components/info/CreditInfo/CreditInfo'
import { creditTable } from '@/constants'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'
import useAuthenticatedAxios from '@/hooks/useAxios'
import useCommon from '@/hooks/useCommon'
import {
	Box,
	Button,
	Flex,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	Select,
	Text,
	Textarea,
	useColorMode,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { ImageSelector } from './imageSelector'

interface Props {
	profileOwnerId: string
}

export const UpdateProfilePopup = ({ profileOwnerId }: Props) => {
	const { colorMode } = useColorMode()
	const {
		optionsState: { services },
	} = useOptionsContext()
	const { showToast } = useCommon()

	const {
		authState: { flat_share_profile, user, wallet },
		setAuthState,
	} = useAuthContext()
	const axiosInstance = useAuthenticatedAxios()

	const [isOpen, setIsOpen] = useState(false)

	const onOpen = () => setIsOpen(true)
	const onClose = () => setIsOpen(false)

	const [bio, setBio] = useState(flat_share_profile?.bio || '')
	const [service, setService] = useState<string>('')
	const [days, setNoOfDays] = useState(0)

	const [isLoading, setIsLoading] = useState(false)
	const [blurModal, setBlurModal] = useState<boolean>(false)

	const [showCreditInfo, setShowCreditInfo] = useState<boolean>(false)

	const { mutate } = useMutation({
		mutationFn: async () => {
			setIsLoading(true)
			setShowCreditInfo(false)

			if (!flat_share_profile || !user) return

			await axiosInstance.post('/promotions/profile', {
				days,
				pitch: bio,
				service,
			})
		},
		onSuccess: () => {
			setAuthState({
				// @ts-ignore
				flat_share_profile: { ...flat_share_profile, bio },
				// @ts-ignore
				wallet: {
					...wallet,
					total_credit:
						// @ts-ignore
						wallet?.total_credit - creditTable.PROFILE_PROMO_PER_DAY * days,
				},
			})

			showToast({
				message: 'You have succesfully promoted your profile',
				status: 'success',
			})
			setIsLoading(false)
			onClose()
		},
		onError: (error: any) => {
			showToast({
				message:
					error?.response?.data?.message || 'Error promoting your profile',
				status: 'error',
			})
			setIsLoading(false)
		},
	})

	if (!user) return null

	return (
		<>
			{profileOwnerId === user._id && (
				<Button onClick={onOpen}>Promote profile on feeds</Button>
			)}

			<Modal
				isOpen={showCreditInfo}
				onClose={() => {
					setIsLoading(false)
					setShowCreditInfo(false)
				}}
				size={'xl'}
			>
				<ModalOverlay />
				<ModalContent
					w={'100%'}
					margin={'auto'}
					flexDir={'column'}
					alignItems={'center'}
					justifyContent={'center'}
					position={'relative'}
					rounded={'16px'}
					_dark={{ bgColor: 'black' }}
					_light={{
						bgColor: '#FDFDFD',
						border: '1px',
						borderColor: 'text_muted',
					}}
					py={{ base: '16px', md: '24px' }}
					px={{ base: '16px', sm: '24px', md: '32px' }}
					gap={{ base: '24px', md: '32px' }}
				>
					<Box
						pos={'absolute'}
						top={{ base: '16px', md: '30px' }}
						right={{ base: '16px', md: '30px' }}
						cursor={'pointer'}
						onClick={() => {
							setIsLoading(false)
							setShowCreditInfo(false)
						}}
					>
						<CloseIcon />
					</Box>
					<CreditInfo
						credit={creditTable.PROFILE_PROMO_PER_DAY * days}
						onUse={() => mutate()}
					/>
				</ModalContent>
			</Modal>

			<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay backdropFilter="blur(100px)" bg="rgba(0, 0, 0, 0.5)" />
				<ModalContent
					background={colorMode === 'dark' ? 'dark' : 'accent_lighter'}
				>
					<Text
						mt={4}
						textAlign={'center'}
						as={'h1'}
						fontSize={'xl'}
						className={'animate__animated animate__fadeInUp animate__faster'}
						fontWeight={'400'}
						style={{ visibility: !blurModal ? 'visible' : 'hidden' }}
					>{`Update Profile`}</Text>
					<ModalCloseButton />
					<ImageSelector onShowCropper={setBlurModal} />

					<ModalBody style={{ visibility: !blurModal ? 'visible' : 'hidden' }}>
						<Flex
							flexDirection={'column'}
							justifyContent={'center'}
							alignItems={'center'}
						>
							<Text
								textAlign={'left'}
								color={'dark_lighter'}
								className={'animate__animated animate__fadeInUp'}
								outlineColor={'brand_light'}
							>
								Update bio
							</Text>
							<Textarea
								w={'70%'}
								placeholder="Ex: Searching for a vacant space in Lekki, go through my profile"
								onChange={(e) => {
									setBio(e.target.value)
								}}
								value={bio}
								isRequired
							/>

							<Text
								textAlign={'left'}
								color={'dark_lighter'}
								className={'animate__animated animate__fadeInUp'}
								outlineColor={'brand_light'}
								mt={2}
							>
								Enter service type
							</Text>
							<Select
								placeholder="Select option"
								bg="dark"
								required
								w={'70%'}
								onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
									setService(e.target.value)
								}
								value={service}
								isRequired
							>
								{services.map((data, index: number) => (
									<option key={index} value={data._id}>
										{data.name}
									</option>
								))}
							</Select>

							<Text
								textAlign={'left'}
								color={'dark_lighter'}
								className={'animate__animated animate__fadeInUp'}
								outlineColor={'brand_light'}
								mt={2}
							>
								Promotion duration (450 credits per day)
							</Text>
							<Input
								placeholder="Enter promotion duration"
								bg="dark"
								required
								w={'70%'}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									const value = e.target.value
									const regex = /^[0-9]*$/
									if (regex.test(value)) setNoOfDays(Number(value))
								}}
								value={days}
								isRequired
							/>
						</Flex>
					</ModalBody>
					<ModalFooter>
						<Button
							color="brand"
							type={'submit'}
							fontSize={'14px'}
							mr={5}
							onClick={() => setShowCreditInfo(true)}
							isLoading={isLoading}
							style={{ visibility: !blurModal ? 'visible' : 'hidden' }}
							isDisabled={!service || !bio || !days}
						>
							Promote
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
