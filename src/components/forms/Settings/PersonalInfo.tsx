'use client'

import { useAuthContext } from '@/context/auth.context'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import SherutaDB from '@/firebase/service/index.firebase'
import { PaymentType } from '@/firebase/service/request/request.types'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'
import UserService from '@/firebase/service/user/user.firebase'
import useCommon from '@/hooks/useCommon'
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Select,
	VStack,
	Flex,
	Text,
	Alert,
	AlertIcon,
	useColorMode,
	Avatar,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BiCamera } from 'react-icons/bi'

const PersonalInfoForm = () => {
	const [formData, setFormData] = useState<{
		firstName: string
		lastName: string
		phone: string
		email: string
		bio: string
		religion: string
		gender: 'male' | 'female'
	}>({
		firstName: '',
		lastName: '',
		phone: '',
		email: '',
		bio: '',
		religion: 'christianity',
		gender: 'male',
	})

	const {
		authState: { user, user_info, flat_share_profile },
	} = useAuthContext()

	useEffect(() => {
		if (user && user_info && flat_share_profile) {
			setFormData({
				firstName: user.first_name,
				lastName: user.last_name,
				phone: user_info?.primary_phone_number || '',
				email: user.email,
				bio: flat_share_profile?.bio || '',
				religion: flat_share_profile?.religion || '',
				gender: user_info?.gender || 'male',
			})
			setAvatarUrl(user?.avatar_url)
		}
	}, [user, user_info, flat_share_profile])

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { colorMode } = useColorMode()
	const { showToast } = useCommon()
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
	const [avatarFile, setAvatarFile] = useState<File | null>(null)

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setAvatarFile(file)
			const reader = new FileReader()
			reader.onloadend = () => setAvatarUrl(reader.result as string)
			reader.readAsDataURL(file)
		}
	}

	const handleSubmit = async (e: React.FormEvent): Promise<any> => {
		try {
			e.preventDefault()
			setIsLoading(true)

			if (
				!(
					user &&
					user_info &&
					flat_share_profile &&
					user?._id &&
					user_info?._user_id &&
					flat_share_profile?._user_id
				)
			) {
				setIsLoading(false)
				return showToast({
					message: 'Please refresh this page and sign in again',
					status: 'error',
				})
			}

			let downloadURL: string | undefined = user?.avatar_url

			if (avatarFile) {
				if (user?.avatar_url) {
					await SherutaDB.deleteMedia(user.avatar_url)
				}

				const uploadAvatar = new Promise<string | undefined>(
					(resolve, reject) => {
						const reader = new FileReader()
						reader.readAsDataURL(avatarFile)
						reader.onload = async () => {
							if (reader.result) {
								try {
									const storageUrl = `images/profiles/${user?._id}/${avatarFile.name}`

									await SherutaDB.uploadMedia({
										data: reader.result as string,
										storageUrl,
									})

									const url = await SherutaDB.getMediaUrl(storageUrl)
									resolve(url || '')
								} catch (error) {
									console.error('Error uploading avatar:', error)
									reject(undefined)
								}
							} else {
								reject(undefined)
							}
						}
						reader.onerror = () => reject(undefined)
					},
				)

				downloadURL = await uploadAvatar
				setAvatarUrl(downloadURL || '')
			}

			await Promise.all([
				UserInfoService.update({
					data: {
						primary_phone_number: formData.phone,
						gender: formData.gender,
					},
					document_id: user_info._user_id,
				}),
				UserService.update({
					data: {
						first_name: formData.firstName,
						last_name: formData.lastName,
						avatar_url: downloadURL,
					},
					document_id: user._id,
				}),
				FlatShareProfileService.update({
					data: {
						bio: formData.bio,
						religion: formData.religion,
					},
					document_id: flat_share_profile?._user_id,
				}),
			])

			setIsLoading(false)

			showToast({
				message: 'Your information has been updated',
				status: 'success',
			})

			return setTimeout(() => {
				window.location.href = '/settings'
			}, 1000)
		} catch (err: any) {
			setIsLoading(false)
			showToast({
				message: 'An error occurred while updating your information',
				status: 'error',
			})
		}
	}

	return (
		<Box maxW="600px" mx="auto" p={6}>
			<Text fontSize={'3xl'} fontWeight={500} mb="5" textAlign={'center'}>
				Update your personal profile
			</Text>

			<Alert mb={5} status={'info'} variant="subtle">
				<AlertIcon />
				{
					'You cannot change your first name or last name once your account has been verified.'
				}
			</Alert>
			<form onSubmit={handleSubmit}>
				<VStack spacing={4} align="stretch">
					<Flex justifyContent={'center'}>
						<Flex
							cursor={'pointer'}
							htmlFor="file-selector"
							as={'label'}
							bg={'brand'}
							h={'170px'}
							w={'170px'}
							rounded={'full'}
							p={1}
							alignItems={'center'}
							justifyContent={'center'}
							color={'text_muted'}
						>
							{avatarUrl || user?.avatar_url ? (
								<div
									style={{
										backgroundImage: `url(${avatarUrl || user?.avatar_url})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										width: '100%',
										height: '100%',
										borderRadius: '50%',
									}}
								/>
							) : (
								<BiCamera size={50} />
							)}
						</Flex>
						<input
							type="file"
							id="file-selector"
							accept="image/*"
							onChange={handleAvatarChange}
							style={{ display: 'none' }}
						/>
					</Flex>
					<FormLabel mt={3} width="100%" textAlign={'center'}>
						Update your avatar
					</FormLabel>

					<Flex gap={4}>
						<FormControl
							id="firstName"
							isRequired
							isReadOnly={user_info?.is_verified}
						>
							<FormLabel requiredIndicator={null}>First Name</FormLabel>
							<Input
								name="firstName"
								value={formData.firstName}
								onChange={handleChange}
								placeholder="Enter your first name"
							/>
						</FormControl>

						<FormControl
							id="lastName"
							isRequired
							isReadOnly={user_info?.is_verified}
						>
							<FormLabel requiredIndicator={null}>Last Name</FormLabel>
							<Input
								name="lastName"
								value={formData.lastName}
								onChange={handleChange}
								placeholder="Enter your last name"
							/>
						</FormControl>
					</Flex>

					<Flex gap={4}>
						<FormControl id="phone" isRequired>
							<FormLabel requiredIndicator={null}>Phone</FormLabel>
							<Input
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								placeholder="Enter your phone number"
							/>
						</FormControl>

						<FormControl id="gender" isRequired>
							<FormLabel requiredIndicator={null}>Gender</FormLabel>
							<Select
								name="gender"
								value={formData.gender}
								onChange={handleChange}
								bgColor={colorMode}
								placeholder="Select your gender"
							>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</Select>
						</FormControl>
					</Flex>

					<FormControl id="email" isRequired isReadOnly={true}>
						<FormLabel requiredIndicator={null}>Email</FormLabel>
						<Input type="email" value={formData.email} />
					</FormControl>

					<FormControl id="religion" isRequired>
						<FormLabel requiredIndicator={null}>Religion</FormLabel>
						<Select
							name="religion"
							value={formData.religion}
							onChange={handleChange}
							placeholder="Select your religion"
							bgColor={colorMode}
						>
							<option value="Christianity">Christianity</option>
							<option value="Islam">Islam</option>
							<option value="Hinduism">Hinduism</option>
							<option value="Buddhism">Buddhism</option>
							<option value="Other">Other</option>
						</Select>
					</FormControl>

					<FormControl id="bio" isRequired>
						<FormLabel requiredIndicator={null}>About</FormLabel>
						<Textarea
							name="bio"
							value={formData.bio}
							onChange={handleChange}
							placeholder="Tell us something about yourself"
						/>
					</FormControl>

					<Button
						isLoading={isLoading}
						type="submit"
						colorScheme="teal"
						size="lg"
						width="full"
					>
						Update Information
					</Button>
				</VStack>
			</form>
		</Box>
	)
}

export default PersonalInfoForm
