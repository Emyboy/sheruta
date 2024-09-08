'use client'

import React, { useEffect, useState } from 'react'
import { useAuthContext } from '@/context/auth.context'
import useCommon from '@/hooks/useCommon'
import FlatShareProfileService from '@/firebase/service/flat-share-profile/flat-share-profile.firebase'
import {
	Box,
	FormControl,
	FormLabel,
	Select,
	Button,
	VStack,
	Text,
	useColorMode,
} from '@chakra-ui/react'
import { useOptionsContext } from '@/context/options.context'
import { DocumentReference } from 'firebase/firestore'
import { LocationKeywordData } from '@/firebase/service/options/location-keywords/location-keywords.types'

const SearchPreferenceForm = () => {
	const [formData, setFormData] = useState<{
		gender_preference: string
		age_preference: string
		location_keyword: DocumentReference | null
		state: DocumentReference | null
	}>({
		gender_preference: '',
		age_preference: '',
		location_keyword: null,
		state: null,
	})

	const { colorMode } = useColorMode()
	const {
		authState: { flat_share_profile },
	} = useAuthContext()
	const { showToast } = useCommon()
	const {
		optionsState: { states, location_keywords },
	} = useOptionsContext()

	const [locations, setLocations] = useState<any[]>([])

	const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
	const [selectedState, setSelectedState] = useState<string | null>(null)

	const getLocations = (stateId: string): string[] => {
		return location_keywords.filter((item) => item._state_id === stateId)
	}

	useEffect(() => {
		if (states.length > 0 && selectedState) {
			const locations = getLocations(selectedState)
			setLocations(locations)
		}
	}, [states, selectedState])

	useEffect(() => {
		if (flat_share_profile) {
			setFormData({
				gender_preference: flat_share_profile?.gender_preference || '',
				age_preference: flat_share_profile?.age_preference || '',
				location_keyword: flat_share_profile?.location_keyword || null,
				state: flat_share_profile?.state || null,
			})
		}
	}, [flat_share_profile])

	useEffect(() => {
		if (locations.length > 0 && selectedLocation) {
			const locationObj: LocationKeywordData | undefined = locations.find(
				(loc: LocationKeywordData) => loc.id === selectedLocation,
			)

			if (locationObj) {
				setFormData((prev) => ({
					...prev,
					location_keyword: locationObj._ref,
					state: locationObj._state_ref,
				}))
			}
		}
	}, [locations, selectedLocation])

	const [isLoading, setIsLoading] = useState<boolean>(false)

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const handleSubmit = async (e: React.FormEvent): Promise<any> => {
		try {
			e.preventDefault()
			setIsLoading(true)
			if (!(flat_share_profile && flat_share_profile?._user_id)) {
				return showToast({
					message: 'Please refresh this page and sign in again',
					status: 'error',
				})
			}

			await FlatShareProfileService.update({
				data: {
					...formData,
				},
				document_id: flat_share_profile?._user_id,
			})

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
			<Text fontSize={'2xl'} fontWeight={500} mb="5" textAlign={'center'}>
				Update your search preferences
			</Text>

			<form onSubmit={handleSubmit}>
				<VStack spacing={4} align="stretch">
					<FormControl id="gender_preference" isRequired>
						<FormLabel requiredIndicator={null}>Gender Preference</FormLabel>
						<Select
							name="gender_preference"
							value={formData.gender_preference}
							onChange={handleChange}
							placeholder="Select gender preference"
							bgColor={colorMode}
						>
							<option value="male">Male</option>
							<option value="female">Female</option>
							<option value="both">Both</option>
						</Select>
					</FormControl>

					<FormControl id="age_preference" isRequired>
						<FormLabel requiredIndicator={null}>Age Preference</FormLabel>
						<Select
							name="age_preference"
							value={formData.age_preference}
							onChange={handleChange}
							placeholder="Select age range"
							bgColor={colorMode}
						>
							<option value="18-24">18 - 24</option>
							<option value="25-29">25 - 29</option>
							<option value="30-35">30 - 35</option>
							<option value="Above 35">Above 35</option>
						</Select>
					</FormControl>

					<FormControl isRequired>
						<FormLabel requiredIndicator={null}>Select state</FormLabel>
						<Select
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
								setSelectedState(e.target.value)
							}
							placeholder="Select a state"
							bgColor={colorMode}
						>
							{states &&
								states.map((state, index: number) => (
									<option key={index} value={state.id}>
										{state.name}
									</option>
								))}
						</Select>
					</FormControl>

					<FormControl isRequired flex="1">
						<FormLabel requiredIndicator={null} htmlFor="location">
							Select location
						</FormLabel>
						<Select
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
								setSelectedLocation(e.target.value)
							}
							placeholder="Select a location"
							bgColor={colorMode}
						>
							{locations &&
								locations.map((data, index: number) => (
									<option key={index} value={data.id}>
										{data.name}
									</option>
								))}
						</Select>
					</FormControl>

					<Button
						isLoading={isLoading}
						type="submit"
						colorScheme="teal"
						size="lg"
						width="full"
					>
						Update Preferences
					</Button>
				</VStack>
			</form>
		</Box>
	)
}

export default SearchPreferenceForm
