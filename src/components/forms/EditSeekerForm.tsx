'use client'

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
import Link from 'next/link'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import useCommon from '@/hooks/useCommon'
import {
	createSeekerRequestDTO,
	PaymentType,
	SeekerRequestData,
	LocationObject,
} from '@/firebase/service/request/request.types'

import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { ZodError } from 'zod'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'

import { SuperJSON } from 'superjson'
import { SeekerRequestDataDetails } from '@/firebase/service/request/request.types'
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

const EditSeekerForm: React.FC<{
	requestData: string | undefined
	requestId: string
}> = ({ requestData, requestId }) => {
	const parsedRequestData: SeekerRequestDataDetails | undefined = requestData
		? SuperJSON.parse(requestData)
		: undefined

	const { colorMode } = useColorMode()
	const { showToast } = useCommon()

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: GOOGLE_PLACES_API_KEY as string,
		libraries,
	})

	const axiosInstance = useAuthenticatedAxios()

	const {
		authState: { user },
	} = useAuthContext()

	// Redirect to '/' if parsedRequestData is undefined
	useEffect(() => {
		if (parsedRequestData) {
			// Check for missing parsedRequestData or mismatched user ID
			if (user && parsedRequestData.user._id !== user?._id) {
				window.location.assign('/')
				return
			}
		} else {
			window.location.assign('/')
			return
		}
	}, [parsedRequestData, user])

	const [formData, setFormData] = useState(initialFormState)

	useEffect(() => {
		if (parsedRequestData) {
			setFormData((prev) => ({
				...prev,
				location: parsedRequestData.location._id,
				state: parsedRequestData.state._id,
				service: parsedRequestData.service._id,
				description: parsedRequestData.description,
				rent: parsedRequestData.rent || 0,
				payment_type: parsedRequestData?.payment_type as PaymentType,
				google_location_object: parsedRequestData?.google_location_object || {},
				google_location_text: parsedRequestData?.google_location_text || '',
			}))

			setNewLocations(getLocations(parsedRequestData.state._id))
		}
	}, [])

	console.log(formData)

	const {
		optionsState: { services, states, locations },
	} = useOptionsContext()

	const getLocations = (stateId: string) => {
		return locations.filter((item) => item.state === stateId)
	}

	const [newLocations, setNewLocations] = useState<any[]>([])
	const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

	const [isRentInvalid, setIsRentInvalid] = useState<boolean>(false)
	const [googleLocationText, setGoogleLocationText] = useState<string>('')
	const [autocomplete, setAutocomplete] =
		useState<google.maps.places.Autocomplete | null>(null)
	const [formErrors, setFormErrors] = useState<Errors>({})

	const handleLoad = useCallback(
		(autocompleteInstance: google.maps.places.Autocomplete) =>
			setAutocomplete(autocompleteInstance),
		[],
	)

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
				const paymentType = formData?.payment_type
				if (paymentType) updateRentInvalidState(paymentType, Number(value))
				break

			case 'payment_type':
				const rent = formData?.rent as number
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

	const { mutate: editRequest, isPending } = useMutation({
		mutationFn: async () => {
			if (!axiosInstance) {
				showToast({
					message: 'Failed to post request, please try again',
					status: 'error',
				})
				throw new Error('Axios instance not available') // Abort mutation
			}

			// Check if user is logged in
			if (!(user?._id && parsedRequestData?.user._id === user._id)) {
				showToast({
					message: 'Failed to post request, please log in first',
					status: 'error',
				})
				throw new Error('User not logged in') // Abort mutation
			}

			// Prepare final form data
			const finalFormData = {
				...formData,
				rent: Number(formData.rent),
			}

			createSeekerRequestDTO.parse(finalFormData)

			const response = await await axiosInstance.put(
				`/flat-share-requests/seeker/${requestId}`,
				finalFormData,
			)
			return response.data
		},
		onSuccess: async (data) => {
			showToast({
				message: 'Your request has been edited successfully',
				status: 'success',
			})

			// Redirect after 1 second
			setTimeout(() => {
				window.location.assign(`/request/seeker/${data?.data?._id || ''}`)
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

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (
			formData.description.length < 140 ||
			formData.description.length > 500
		) {
			return showToast({
				message: 'Description should be between 140 and 500 characters long.',
				status: 'info',
			})
		}

		editRequest()
	}

	return (
		<form onSubmit={handleSubmit}>
			<Flex mb={4} gap={4}>
				<FormControl isRequired isInvalid={isRentInvalid} flex="1">
					<FormLabel requiredIndicator={null} htmlFor="budget">
						Budget
					</FormLabel>
					<Input
						type="number"
						id="budget"
						name="budget"
						onChange={(e) => handleChange(e)}
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
						value={formData?.state}
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
						value={formData?.location}
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
						value={formData?.service}
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
						defaultValue={formData?.description}
						onChange={handleChange}
						placeholder="I'm looking for a shared flat with AC, Wifi and Gas Cooker"
						minLength={140}
						maxLength={500}
						rows={10}
					/>
				</FormControl>
			</Flex>

			<Flex flexDir={'column'} gap={'2'} justify={'center'}>
				<Button
					isLoading={isPending}
					disabled={isPending}
					loadingText="Please wait..."
					type="submit"
					colorScheme="teal"
					size="lg"
					width="full"
				>
					{'Update Request'}
				</Button>
				<Link href={'/'}>
					<Text
						textAlign={'center'}
						color="gray.600"
						fontSize="sm"
						ml={2}
						textDecoration={'underline'}
					>
						Cancel and return to requests list
					</Text>
				</Link>
			</Flex>
		</form>
	)
}

export default EditSeekerForm
