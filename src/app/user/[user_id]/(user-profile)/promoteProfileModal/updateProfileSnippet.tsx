'use client'

import CloseIcon from '@/assets/svg/close-icon-dark'
import CreditInfo from '@/components/info/CreditInfo/CreditInfo'
import { creditTable } from '@/constants'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import {
	saveProfileDocs,
	saveProfileSnippetDocs,
} from '@/firebase/service/userProfile/user-profile'
import usePayment from '@/hooks/usePayment'
import {
	Box,
	Button,
	Flex,
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
import { Timestamp } from 'firebase/firestore'
import React, { useState } from 'react'
import { ImageSelector } from './imageSelector'

export const UpdateProfilePopup = () => {
	const { colorMode } = useColorMode()

	const [_, paymentActions] = usePayment()

	const {
		authState: { flat_share_profile, user },
		getAuthDependencies,
	} = useAuthContext()

	const {
		optionsState: { services },
	} = useOptionsContext()

	const [isOpen, setIsOpen] = useState(false)

	const onOpen = () => setIsOpen(true)
	const onClose = () => setIsOpen(false)

	const [bio, setBio] = useState(flat_share_profile?.bio || '')
	const [_service, setService] = useState<string>('')
	const [promotionOption, setPromotionOption] = useState(
		creditTable.PROFILE_PROMO_7_DAYS,
	)
	const [noOfDays, setNoOfDays] = useState(7)
	const [isLoading, setIsLoading] = useState(false)

	const [showCreditInfo, setShowCreditInfo] = useState<boolean>(false)

	const update = async () => {
		setIsLoading(true)
		setShowCreditInfo(false)

		if (!flat_share_profile || !user) return

		const profileData = {
			bio,
			service_type: _service,
			first_name: user.first_name,
			last_name: user.last_name,
			seeking: flat_share_profile.seeking,
			payment_plan: flat_share_profile.payment_type || null,
			budget: flat_share_profile.budget,
			avatar_url: user.avatar_url,
			state: flat_share_profile.state,
			location_keyword: flat_share_profile.location_keyword,
			_user_ref: flat_share_profile._user_ref,
			document_id: flat_share_profile._user_id,
			promotion_expiry_date: Timestamp.fromDate(
				new Date(new Date().setDate(new Date().getDate() + noOfDays)),
			),
		}

		await Promise.all([
			saveProfileDocs(
				{
					bio,
					service_type: _service,
				},
				flat_share_profile._user_id,
			),
			FlatShareProfileService.update({
				data: { bio },
				document_id: flat_share_profile._user_id,
			}),
			paymentActions.decrementCredit({
				amount: promotionOption,
				user_id: user._id,
			}),
			saveProfileSnippetDocs(profileData, flat_share_profile._user_id),
		])

		await getAuthDependencies()
		setIsLoading(false)
		onClose()
	}

	if (!user) return null

	return (
		<>
			<Button onClick={onOpen}>Promote profile on feeds</Button>

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
					<CreditInfo credit={promotionOption} onUse={update} />
				</ModalContent>
			</Modal>

			<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
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
					>{`Update Profile`}</Text>
					<ModalCloseButton />
					<ImageSelector />
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
							value={_service}
							isRequired
						>
							{services &&
								services.map((data, index: number) => (
									<option key={index} value={data.item}>
										{data.title}
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
							How long will you be promoting your profile?
						</Text>
						<Select
							placeholder="Select option"
							bg="dark"
							required
							w={'70%'}
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
								setPromotionOption(Number(e.target.value))
								if (Number(e.target.value) === creditTable.PROFILE_PROMO_7_DAYS)
									setNoOfDays(7)
								if (
									Number(e.target.value) === creditTable.PROFILE_PROMO_14_DAYS
								)
									setNoOfDays(14)
								if (
									Number(e.target.value) === creditTable.PROFILE_PROMO_30_DAYS
								)
									setNoOfDays(30)
							}}
							value={promotionOption}
							isRequired
						>
							<option value={creditTable.PROFILE_PROMO_7_DAYS}>
								7 Days (3000 Credits)
							</option>
							<option value={creditTable.PROFILE_PROMO_14_DAYS}>
								14 Days (5000 Credits)
							</option>
							<option value={creditTable.PROFILE_PROMO_30_DAYS}>
								30 Days (8000 Credits)
							</option>
						</Select>
					</Flex>
					<ModalBody>
						<Text
							className={'animate__animated animate__fadeInUp'}
							textAlign={'center'}
						></Text>
					</ModalBody>

					<ModalFooter>
						<Button
							color="brand"
							type={'submit'}
							fontSize={'14px'}
							mr={5}
							onClick={() => setShowCreditInfo(true)}
							isLoading={isLoading}
							isDisabled={!_service || !bio || !promotionOption}
						>
							Promote
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
