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
import React, { useState, useEffect } from 'react'
import { ImageSelector } from './imageSelector'
interface Props{
	profileOwnerId: string;
}


export const UpdateProfilePopup = ({profileOwnerId}:Props) => {
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
	const [_profileData, setProfileData] = useState({})
	const [profileOwner, setProfileOwner] = useState(false);
	const [blurModal, setBlurModal] = useState<boolean>(false);
	const [promotionOption, setPromotionOption] = useState(
		creditTable.PROFILE_PROMO_7_DAYS,
	)
	const [noOfDays, setNoOfDays] = useState(7)
	const [isLoading, setIsLoading] = useState(false)

	const [showCreditInfo, setShowCreditInfo] = useState<boolean>(false)

	useEffect(() => {
		
		const currentUser = user?._id
		const viewedProfileId = profileOwnerId
		if(flat_share_profile){
			setBio(flat_share_profile?.bio || "")

		}

		if (viewedProfileId === currentUser) {
			setProfileOwner(true)
		}
	}, [user, profileOwnerId])

	// useEffect(() => {
	// 	const fetchProfile = async () => {
	// 		const profile = await getProfile(userId)

	// 		if (profile) {
	// 			const profileData = {
	// 				first_name: profile.first_name,
	// 				last_name: profile.last_name,
	// 				service_type: profile.service_type,
	// 				seeking: profile.seeking,
	// 				payment_type: profile.payment_type,
	// 				bio: profile.bio,
	// 				budget: profile.budget,
	// 				avatar_url: profile.avatar_url,
	// 				state: profile.state,
	// 				area: profile.area,
	// 				_user_ref: profile._user_ref,
	// 				document_id: profile.document_id,
	// 			}

	// 			setService(profileData.service_type)
	// 			setBio(profile.bio)
	// 			setProfileData(profileData)
	// 		} else {
	// 			console.log('Profile not found or could not be loaded.')
	// 		}
	// 	}

	// 	if (userId) {
	// 		fetchProfile()
	// 	}
	// }, [userId])

	// useEffect(() => {
		
	// 	setBio(flat_share_profile?.bio || '')
	// 	console.log('Bio.....................', bio)
	// }, [isOpen])
	

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
			payment_type: flat_share_profile.payment_type || null,
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
				data: { bio,
					service_type: _service, },
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
			{profileOwner && <Button onClick={onOpen}>Promote profile on feeds</Button>}
			

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
				<ModalOverlay
				backdropFilter="blur(100px)" // Adjust the value for more or less blur
				bg="rgba(0, 0, 0, 0.5)" 
				/>
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
						style={{ visibility: !blurModal ? "visible" : "hidden" }}
					>{`Update Profile`}</Text>
					<ModalCloseButton />
					<ImageSelector onShowCropper={setBlurModal}/>
					
					<ModalBody
					style={{ visibility: !blurModal ? "visible" : "hidden" }}
					 
					>
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
							Promotion duration
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
					</ModalBody>
					<ModalFooter>
						<Button
							color="brand"
							type={'submit'}
							fontSize={'14px'}
							mr={5}
							onClick={() => setShowCreditInfo(true)}
							isLoading={isLoading}
							style={{ visibility: !blurModal ? "visible" : "hidden" }}
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
