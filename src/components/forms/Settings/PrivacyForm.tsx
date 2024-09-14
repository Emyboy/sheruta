'use client'

import React, { useState, useEffect } from 'react'
import {
	Box,
	FormControl,
	FormLabel,
	Switch,
	VStack,
	Text,
	Alert,
	AlertIcon,
} from '@chakra-ui/react'
import { useAuthContext } from '@/context/auth.context'
import useCommon from '@/hooks/useCommon'
import UserInfoService from '@/firebase/service/user-info/user-info.firebase'

const PrivacyForm = () => {
	const [formData, setFormData] = useState({
		hide_profile: false,
		hide_phone: false,
	})

	const {
		authState: { user_info },
	} = useAuthContext()
	const { showToast } = useCommon()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	useEffect(() => {
		if (user_info && user_info._user_id) {
			setFormData({
				hide_profile: user_info.hide_profile || false,
				hide_phone: user_info.hide_phone || false,
			})
		}
	}, [user_info])

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const { name, checked } = e.target

			if (!(user_info && user_info._user_id)) {
				return showToast({
					message: 'Please refresh this page and sign in again',
					status: 'error',
				})
			}
			setIsLoading(true)
			await UserInfoService.update({
				data: {
					[name]: checked,
				},
				document_id: user_info._user_id,
			})

			setFormData((prev) => ({
				...prev,
				[name]: checked,
			}))
			setIsLoading(false)
			return showToast({
				message: 'Your information has been updated',
				status: 'success',
			})
		} catch (err: any) {
			console.log(err)
			setIsLoading(false)
			showToast({
				status: 'error',
				message: 'An error occurred while updating your privacy settings.',
			})
		}
	}

	return (
		<Box maxW="600px" mx="auto" p={6}>
			<Text fontSize={'3xl'} fontWeight={500} mb="5" textAlign={'center'}>
				Update your privacy settings
			</Text>
			<Alert mb={5} status="info" variant="subtle">
				<AlertIcon />
				{
					'When you hide your profile, your posts will no longer be visible to other users.'
				}
			</Alert>

			<form>
				<VStack spacing={4} align="stretch">
					<FormControl display="flex" alignItems="center" id="hide_profile">
						<FormLabel mb="0">Hide my profile</FormLabel>
						<Switch
							disabled={isLoading}
							name="hide_profile"
							isChecked={formData.hide_profile}
							onChange={handleChange}
							sx={{
								'span.chakra-switch__track': {
									backgroundColor: formData.hide_profile
										? '#38A169'
										: '#CBD5E0',
								},
								'span.chakra-switch__thumb': {
									backgroundColor: formData.hide_profile ? 'white' : 'white',
								},
							}}
						/>
					</FormControl>

					<FormControl display="flex" alignItems="center" id="hide_phone">
						<FormLabel mb="0">Hide my phone number</FormLabel>
						<Switch
							disabled={isLoading}
							name="hide_phone"
							isChecked={formData.hide_phone}
							onChange={handleChange}
							sx={{
								'span.chakra-switch__track': {
									backgroundColor: formData.hide_phone ? '#38A169' : '#CBD5E0',
								},
								'span.chakra-switch__thumb': {
									backgroundColor: formData.hide_phone ? 'white' : 'white',
								},
							}}
						/>
					</FormControl>
				</VStack>
			</form>
		</Box>
	)
}

export default PrivacyForm
