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

interface Props{
	profileOwnerId: string;
}


export const UpdateProfilePopup = ({profileOwnerId}:Props) => {
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
	const [profileOwner, setProfileOwner] = useState(false);
	const [blurModal, setBlurModal] = useState<boolean>(false);

	useEffect(() => {
		
		const currentUser = user?._id
		const viewedProfileId = profileOwnerId

		if (viewedProfileId === currentUser) {
			setProfileOwner(true)
		}
	}, [user, profileOwnerId])

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
				setBio(profile.bio)
				setProfileData(profileData)
			} else {
				console.log('Profile not found or could not be loaded.')
			}
		}

		if (userId) {
			fetchProfile()
		}
	}, [userId])

	useEffect(() => {
		setUserId(user?._id || '')
		// setBio(flat_share_profile?.bio || '')
		console.log('Bio.....................', bio)
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
		
	}

	return (
		<>
			{profileOwner && <Button onClick={onOpen}>Promote profile on feeds</Button>}
			

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
							style={{ visibility: !blurModal ? "visible" : "hidden" }}
						>
							Promote
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
