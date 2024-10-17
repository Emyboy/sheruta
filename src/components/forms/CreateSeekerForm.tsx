import { libraries } from '@/constants'
import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Select,
	Text,
	Textarea,
	useColorMode,
} from '@chakra-ui/react'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'

import useCommon from '@/hooks/useCommon'
import {
	createSeekerRequestDTO,
	PaymentType,
	SeekerRequestData,
	LocationObject,
} from '@/firebase/service/request/request.types'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'

import { z, ZodError } from 'zod'
import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import useAnalytics from '@/hooks/useAnalytics'
import { useMutation } from '@tanstack/react-query'
import useAuthenticatedAxios from '@/hooks/useAxios'

const GOOGLE_PLACES_API_KEY: string | undefined =
	process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

const rentLimits: Record<PaymentType, number> = {
	daily: 10000,
	monthly: 25000,
	quarterly: 80000,
	biannually: 100000,
	annually: 150000,
}

interface ErrorObject {
	code: string
	expected?: string
	received?: string
	message: string
	fatal?: boolean
	path: string[]
}

type Errors = {
	[key: string]: ErrorObject
}

const extractErrors = (errorArray: ErrorObject[]): Errors => {
	return errorArray.reduce((acc, error) => {
		const key = error.path[0]
		acc[key] = {
			code: error.code,
			expected: error.expected,
			received: error.received,
			message: error.message,
			fatal: error.fatal,
			path: error.path,
		}
		return acc
	}, {} as Errors)
}

const initialFormState: SeekerRequestData = {
	description: '',
	rent: 0,
	google_location_object: {} as LocationObject,
	google_location_text: '',
	location: '',
	state: '',
	service: '',
	payment_type: PaymentType.daily,
}

const CreateSeekerForm: React.FC = () => {
	const { colorMode } = useColorMode()
	const { showToast } = useCommon()

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: GOOGLE_PLACES_API_KEY as string,
		libraries,
	})

	const {
		authState: { flat_share_profile, user },
	} = useAuthContext()

	const {
		optionsState: { services, states, locations },
	} = useOptionsContext()

	const [newLocations, setNewLocations] = useState<any[]>([])

	const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
	const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
		null,
	)

	const getLocations = (stateId: string) => {
		return locations.filter((item) => item.state === stateId)
	}

	useEffect(() => {
		if (flat_share_profile?.state) {
			setNewLocations(getLocations(flat_share_profile.state))
			setFormData((prev) => ({
				...prev,
				state: flat_share_profile.state,
			}))
		}
	}, [flat_share_profile?.state])

	const [formData, setFormData] = useState(initialFormState)

	const [isRentInvalid, setIsRentInvalid] = useState<boolean>(false)

	const [googleLocationText, setGoogleLocationText] = useState<string>('')

	const [formErrors, setFormErrors] = useState<Errors>({})

	const [autocomplete, setAutocomplete] =
		useState<google.maps.places.Autocomplete | null>(null)

	const handleLoad = useCallback(
		(autocompleteInstance: google.maps.places.Autocomplete) =>
			setAutocomplete(autocompleteInstance),
		[],
	)

	const axiosInstance = useAuthenticatedAxios()

	const { addAnalyticsData } = useAnalytics()

	const handlePlaceChanged = useCallback(() => {
		if (autocomplete) {
			const place = autocomplete.getPlace()
			const locationObject: LocationObject = {
				formatted_address: place.formatted_address,
				geometry: place.geometry
					? {
							location: {
								lat: place.geometry.location?.lat() ?? 0,
								lng: place.geometry.location?.lng() ?? 0,
							},
						}
					: undefined,
			}
			const locationText = locationObject.formatted_address || ''
			setGoogleLocationText(locationText)
			setFormData((prev) => ({
				...prev,
				google_location_object: locationObject,
				google_location_text: locationText,
			}))
		}
	}, [googleLocationText, autocomplete])

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { id, name, value } = e.target

		const updateRentInvalidState = (paymentType: string, rentValue: number) => {
			const rentLimit = rentLimits[paymentType as PaymentType]
			setIsRentInvalid(rentValue < rentLimit)
		}

		switch (id) {
			case 'rent':
				const paymentType = formData.payment_type
				if (paymentType) updateRentInvalidState(paymentType, Number(value))
				break

			case 'payment_type':
				const rent = formData.rent as number
				if (value) updateRentInvalidState(value as PaymentType, rent)
				break

			case 'state':
				if (value) {
					const newLocations = getLocations(value)
					setNewLocations(newLocations)
				}
				break

			case 'location':
				if (value) {
					const { name, _id } =
						locations.find((data) => data._id === value) ?? {}
					setSelectedLocation(name as string)
					setSelectedLocationId(_id as string)
				}
				break

			default:
				break
		}

		if (name && value) {
			setFormData((prevData) => ({
				...prevData,
				[name]: value,
			}))
		}
	}

	const { mutate: postRequest, isPending } = useMutation({
		mutationFn: async () => {
			if (user) {
				const finalFormData = {
					...formData,
					rent: Number(formData.rent),
				}

				createSeekerRequestDTO.parse(finalFormData)

				await axiosInstance.post('/flat-share-requests/seeker', finalFormData)
			}
		},
		onSuccess: async () => {
			showToast({
				message: 'Your request has been posted successfully',
				status: 'success',
			})

			//add analytics
			await addAnalyticsData('posts', selectedLocationId as string)

			setTimeout(() => {
				window.location.assign('/')
			}, 1000)
		},
		onError: (err) => {
			if (err instanceof ZodError) {
				setFormErrors(extractErrors(err.issues as ErrorObject[]))
				console.error('Zod Validation Error:', err.issues)
			} else {
				showToast({
					message: 'Error, please try again',
					status: 'error',
				})
			}
		},
	})

	return (
		<form onSubmit={(e: FormEvent) => {
			e.preventDefault();
			postRequest()
		}}>
			<Flex mb={4} gap={4}>
				<FormControl
					isRequired
					isInvalid={isRentInvalid || typeof formErrors?.rent !== 'undefined'}
					flex="1"
				>
					<FormLabel requiredIndicator={null} htmlFor="budget">
						Rent
					</FormLabel>
					<Input
						type="number"
						id="rent"
						name="rent"
						onChange={handleChange}
						placeholder={`Minimum ₦${rentLimits[formData?.payment_type || 'daily'].toLocaleString()}`}
						defaultValue={!formData?.rent ? '' : formData.rent}
					/>
					<FormErrorMessage>
						Please enter an amount that meets the minimum required value of ₦
						{rentLimits[formData?.payment_type || 'daily'].toLocaleString()}.
					</FormErrorMessage>
				</FormControl>

				<FormControl isRequired flex="1">
					<FormLabel requiredIndicator={null} htmlFor="payment_type">
						Payment Type
					</FormLabel>
					<Select
						id="payment_type"
						name="payment_type"
						onChange={handleChange}
						placeholder="Monthly, Annually etc"
						bgColor={colorMode}
						defaultValue={formData?.payment_type}
					>
						<option value="daily">Daily</option>
						<option value="monthly">Monthly</option>
						<option value="quarterly">Quarterly</option>
						<option value="biannually">Bi-annually</option>
						<option value="annually">Annually</option>
					</Select>
				</FormControl>
			</Flex>
			<Flex mb={4} gap={4}>
				<FormControl isRequired flex="1">
					<FormLabel requiredIndicator={null} htmlFor="state">
						Select state
					</FormLabel>
					<Select
						id="state"
						name="state"
						onChange={handleChange}
						placeholder="Select a state"
						bgColor={colorMode}
						defaultValue={flat_share_profile?.state}
					>
						{states &&
							states.map((state, index: number) => (
								<option key={index} value={state._id}>
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
						id="location"
						name="location"
						onChange={handleChange}
						placeholder="Select a location"
						bgColor={colorMode}
					>
						{newLocations &&
							newLocations.map((data, index: number) => (
								<option key={index} value={data._id}>
									{data.name}
								</option>
							))}
					</Select>
				</FormControl>
			</Flex>

			{selectedLocation &&
				(!isLoaded ? (
					<Text width={'full'} textAlign={'center'}>
						Loading google maps
					</Text>
				) : (
					<FormControl isRequired mb={4}>
						<FormLabel requiredIndicator={null} htmlFor="address">
							Where in {selectedLocation}
						</FormLabel>
						<Autocomplete
							onLoad={handleLoad}
							onPlaceChanged={handlePlaceChanged}
						>
							<Input
								id="address"
								type="text"
								placeholder="Select..."
								value={googleLocationText}
								onChange={(e) => setGoogleLocationText(e.target.value)}
							/>
						</Autocomplete>
					</FormControl>
				))}

			<Flex mb={4} gap={4}>
				<FormControl isRequired flex="1">
					<FormLabel requiredIndicator={null} htmlFor="service">
						Service Type
					</FormLabel>
					<Select
						id="service"
						name="service"
						onChange={handleChange}
						placeholder="For rent, Shared room etc"
						bgColor={colorMode}
					>
						{services &&
							services.map((data, index: number) => (
								<option key={index} value={data._id}>
									{data.name}
								</option>
							))}
					</Select>
				</FormControl>
			</Flex>
			<Flex mb={4} gap={4}>
				<FormControl isRequired flex="1">
					<FormLabel requiredIndicator={null} htmlFor="description">
						Describe your ideal room (140 chars)
					</FormLabel>
					<Textarea
						id="description"
						name="description"
						value={formData.description}
						onChange={handleChange}
						placeholder="I'm looking for a shared flat with AC, Wifi and Gas Cooker"
						minLength={140}
						maxLength={500}
						rows={10}
					/>
				</FormControl>
			</Flex>

			<Button
				isLoading={isPending}
				disabled={isPending}
				loadingText="Please wait..."
				type="submit"
				colorScheme="teal"
				size="lg"
				width="full"
			>
				Submit Request
			</Button>
		</form>
	)
}

export default CreateSeekerForm
