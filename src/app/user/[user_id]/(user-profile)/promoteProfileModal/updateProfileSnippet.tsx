'use client'
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Box,
	Button,
	Center,
	Flex,
	Text,
	useColorMode,
	Textarea,
	Select,
} from '@chakra-ui/react'
import {
	saveProfileDocs,
	getProfile,
	saveProfileSnippetDocs,
} from '@/firebase/service/userProfile/user-profile'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import { DBCollectionName } from '@/firebase/service/index.firebase'
import { useAuthContext } from '@/context/auth.context'
import React, { useEffect, useState } from 'react'
import { ImageSelector } from './imageSelector'
import { useOptionsContext } from '@/context/options.context'

export const UpdateProfilePopup = () => {
	const { colorMode } = useColorMode()

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
	const [bio, setBio] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [userId, setUserId] = useState<string>('')
	const [_service, setService] = useState<string>('')
	const [_profileData, setProfileData] = useState({})

	useEffect(() => {
		const fetchProfile = async () => {
			const profile = await getProfile(userId)

			if (profile) {
				const profileData = {
					first_name: profile.first_name,
					last_name: profile.last_name,
					service_type: profile.service_type,
					seeking: profile.seeking,
					payment_plan: profile.payment_plan,
					bio: profile.bio,
					budget: profile.budget,
					avatar_url: profile.avatar_url,
					state: profile.state,
					area: profile.area,
					_user_ref: profile._user_ref,
					document_id: profile.document_id,
				}

				setService(profileData.service_type)
				setProfileData(profileData)
			} else {
				console.log('Profile not found or could not be loaded.')
			}
		}

		if (isOpen) {
			fetchProfile()
		}
	}, [isOpen])

	useEffect(() => {
		setUserId(user?._id || '')
		setBio(flat_share_profile?.bio || '')
		console.log('Service.....................', _service)
	}, [isOpen])

	const update = async (e: any) => {
		e.preventDefault()
		setIsLoading(true)
		await saveProfileDocs(
			{
				bio,
				service_type: _service,
			},
			userId,
		)
		await FlatShareProfileService.update({
			data: { bio },
			document_id: userId,
		})
		createProfileSnippetAd()
		await getAuthDependencies()
		setIsLoading(false)
		onClose()
	}

	const createProfileSnippetAd = async () => {
		await saveProfileSnippetDocs(_profileData, userId)
		console.log('successfull........................', _profileData, userId)
	}

	return (
		<>
			<Button onClick={onOpen}>Promote profile on feeds</Button>

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
						/>

						<Text
							textAlign={'left'}
							color={'dark_lighter'}
							className={'animate__animated animate__fadeInUp'}
							outlineColor={'brand_light'}
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
						>
							{services &&
								services.map((data, index: number) => (
									<option key={index} value={data.item}>
										{data.title}
									</option>
								))}
						</Select>
					</Flex>
					<ModalBody>
						<Text
							className={'animate__animated animate__fadeInUp'}
							textAlign={'center'}
						></Text>
					</ModalBody>

					<ModalFooter>
						{/* <Button color='brand' mr={3} onClick={onClose}>
              Close
            </Button> */}
						<Button
							color="brand"
							type={'submit'}
							fontSize={'14px'}
							mr={5}
							onClick={update}
							isLoading={isLoading}
						>
							Promote
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
