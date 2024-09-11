'use client'

import { libraries } from '@/constants'
import { db } from '@/firebase'
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

import {
	doc,
	DocumentData,
	DocumentReference,
	Timestamp,
} from 'firebase/firestore'
import Link from 'next/link'
import { LoadScript, Autocomplete } from '@react-google-maps/api'
import SherutaDB from '@/firebase/service/index.firebase'
import useCommon from '@/hooks/useCommon'
import {
	createSeekerRequestDTO,
	PaymentPlan,
	RequestData,
	SeekerRequestData,
	LocationObject,
} from '@/firebase/service/request/request.types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { v4 as generateUId } from 'uuid'
import { ZodError } from 'zod'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'
import { StateData } from '@/firebase/service/options/states/states.types'
import { SuperJSON } from 'superjson'
import { SeekerRequestDataDetails } from '@/firebase/service/request/request.types'
import { LocationKeywordData } from '@/firebase/service/options/location-keywords/location-keywords.types'

const GOOGLE_PLACES_API_KEY: string | undefined =
	process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

const budgetLimits: Record<PaymentPlan, number> = {
	weekly: 10000,
	monthly: 25000,
	quarterly: 80000,
	'bi-annually': 100000,
	annually: 150000,
}

const initialFormState: SeekerRequestData = {
	description: '',
	uuid: generateUId(),
	budget: 0,
	google_location_object: {} as LocationObject,
	google_location_text: '',
	_location_keyword_ref: undefined as DocumentReference | undefined,
	_state_ref: undefined as DocumentReference | undefined,
	_service_ref: undefined as DocumentReference | undefined,
	payment_type: 'weekly',
	seeking: true, //this should be true by default for seekers
	createdAt: Timestamp.now(),
	updatedAt: Timestamp.now(),
}
function convertPlainObjectsToTimestamps(data: any): any {
	if (data && typeof data === 'object') {
		if (data.seconds !== undefined && data.nanoseconds !== undefined) {
			return new Timestamp(data.seconds, data.nanoseconds)
		}
		// Recursively process arrays and objects
		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				data[key] = convertPlainObjectsToTimestamps(data[key])
			}
		}
	}
	return data
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
	const router = useRouter()

	const {
		authState: { flat_share_profile },
	} = useAuthContext()

	// Redirect to '/' if parsedRequestData is undefined
	useEffect(() => {
		console.log('why?????', parsedRequestData)
		if (parsedRequestData) {
			// Check for missing parsedRequestData or mismatched user ID
			if (flat_share_profile && parsedRequestData._user_ref._id !== flat_share_profile?._user_id) {
				window.location.assign('/');
				return;
			}
		}else{
			window.location.assign('/');
			return;
		}

	}, [parsedRequestData, flat_share_profile]);


	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [formData, setFormData] = useState({
		_location_keyword_ref: undefined,
		_state_ref: undefined,
		_service_ref: undefined,
		_user_ref: undefined,
		updatedAt: parsedRequestData?.updatedAt || Timestamp.now(),
		createdAt: parsedRequestData?.createdAt || Timestamp.now(),
		description: parsedRequestData?.description || '',
		uuid: parsedRequestData?.id,
		budget: parsedRequestData?.budget,
		google_location_object: parsedRequestData?.google_location_object,
		google_location_text: parsedRequestData?.google_location_text,
		payment_type: parsedRequestData?.payment_type as PaymentPlan,
		seeking: true,
	})

	console.log(formData)

	const {
		optionsState: { services, states, location_keywords },
	} = useOptionsContext()

	const [docRefs, setDocRefs] = useState<{
		_service_ref: DocumentReference | undefined
		_location_keyword_ref: DocumentReference | undefined
		_state_ref: DocumentReference | undefined
	}
	>({
		_service_ref: undefined,
		_state_ref: undefined,
		_location_keyword_ref: undefined
	})

	const [locations, setLocations] = useState<any[]>([])

	const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

	const getLocations = (stateId: string): string[] => {
		return location_keywords.filter((item: LocationKeywordData) => item._state_id === stateId)
	}

	// useEffect(() => {
	// 	if (parsedRequestData && flat_share_profile?._user_id) {
	// 		const convertedFormData =
	// 			convertPlainObjectsToTimestamps(parsedRequestData)
	// 		console.log('infinite')
	// 		console.log(convertedFormData)

	// 		// If user IDs don't match, redirect
	// 		if (parsedRequestData._user_ref._id !== flat_share_profile?._user_id) {
	// 			window.location.assign('/')
	// 			return
	// 		}

	// 		const newFormData = {
	// 			...convertedFormData,
	// 			updatedAt: parsedRequestData.updatedAt,
	// 			createdAt: parsedRequestData.createdAt,
	// 			description: parsedRequestData.description,
	// 			uuid: parsedRequestData.id,
	// 			budget: parsedRequestData.budget,
	// 			google_location_object: parsedRequestData.google_location_object,
	// 			google_location_text: parsedRequestData.google_location_text,
	// 			payment_type: parsedRequestData.payment_type,
	// 			seeking: true,
	// 		}

	// 		setFormData((prev) => ({
	// 			...prev,
	// 			...newFormData
	// 		}))
	// 	}
	// }, [flat_share_profile])


	const [isBudgetInvalid, setIsBudgetInvalid] = useState<boolean>(false)
	const [googleLocationText, setGoogleLocationText] = useState<string>('')
	const [autocomplete, setAutocomplete] =
		useState<google.maps.places.Autocomplete | null>(null)

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
		console.log('I AM WORKING')
		console.log(location_keywords)
		const { id, name, value } = e.target

		console.log(id, name, value)

		const updateBudgetInvalidState = (
			paymentType: string,
			budgetValue: number,
		) => {
			const budgetLimit = budgetLimits[paymentType as PaymentPlan]
			setIsBudgetInvalid(budgetValue < budgetLimit)
		}

		const updateOptionsRef = (key: string, refValue: any) => {
			setDocRefs((prev) => ({
				...prev,
				[key]: refValue,
			}))
		}
		switch (id) {
			case 'budget':
				const paymentType = formData?.payment_type
				if (paymentType) updateBudgetInvalidState(paymentType, Number(value))
				break

			case 'payment_type':
				const budget = formData?.budget as number
				if (value) updateBudgetInvalidState(value as PaymentPlan, budget)
				break

			case 'stateId':
				if (value) {
					const newLocations = getLocations(value)
					console.log(newLocations)
					setLocations(newLocations)
					const stateRef = states.find((data) => data.id === value)?._ref
					updateOptionsRef('_state_ref', stateRef)
				}
				break

			case 'locationKeywordId':
				if (value) {
					const { _ref, name } =
						location_keywords.find((data) => data.id === value) ?? {}
					setSelectedLocation(name)
					updateOptionsRef('_location_keyword_ref', _ref)
				}
				break

			case 'serviceId':
				if (value) {
					const serviceRef = services.find((data) => data.id === value)?._ref
					updateOptionsRef('_service_ref', serviceRef)
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

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<any> => {
		e.preventDefault()
		try {
			setIsLoading(true)

			const finalFormData = {
				...formData,
				...docRefs,
				_user_ref: flat_share_profile?._user_ref,
				updatedAt: Timestamp.now(),
			}

			finalFormData.budget = Number(finalFormData.budget)

			createSeekerRequestDTO.parse(finalFormData)

			const res: DocumentData | undefined = await SherutaDB.update({
				data: finalFormData,
				collection_name: 'requests',
				document_id: requestId,
			})

			if (res && Object.keys(res).length) {
				showToast({
					message: 'Your request has been updated successfully',
					status: 'success',
				})

				setTimeout(() => {
					router.push('/')
				}, 1000)
			}
		} catch (error: any) {
			console.error(error)
			if (error instanceof ZodError) {
				console.error('Zod Validation Error:', error.issues)
			} else {
				showToast({
					message: 'Error, please try again',
					status: 'error',
				})
			}
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<Flex mb={4} gap={4}>
				<FormControl isRequired isInvalid={isBudgetInvalid} flex="1">
					<FormLabel requiredIndicator={null} htmlFor="budget">
						Budget
					</FormLabel>
					<Input
						type="number"
						id="budget"
						name="budget"
						onChange={(e) => handleChange(e)}
						placeholder={`Minimum ₦${budgetLimits[formData?.payment_type || 'weekly'].toLocaleString()}`}
						defaultValue={!formData?.budget ? '' : formData.budget}
					/>
					<FormErrorMessage>
						Please enter an amount that meets the minimum required value of ₦
						{budgetLimits[formData?.payment_type || 'weekly'].toLocaleString()}.
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
						<option value="weekly">Weekly</option>
						<option value="monthly">Monthly</option>
						<option value="quarterly">Quarterly</option>
						<option value="bi-annually">Bi-annually</option>
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
						id="stateId"
						onChange={handleChange}
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
						id="locationKeywordId"
						onChange={handleChange}
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
			</Flex>

			{selectedLocation && (
				<FormControl isRequired mb={4}>
					<FormLabel requiredIndicator={null} htmlFor="address">
						Where in {selectedLocation}
					</FormLabel>
					<LoadScript
						googleMapsApiKey={GOOGLE_PLACES_API_KEY as string}
						libraries={libraries}
					>
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
					</LoadScript>
				</FormControl>
			)}

			<Flex mb={4} gap={4}>
				<FormControl isRequired flex="1">
					<FormLabel requiredIndicator={null} htmlFor="service">
						Service Type
					</FormLabel>
					<Select
						id="serviceId"
						onChange={handleChange}
						placeholder="For rent, Shared room etc"
						bgColor={colorMode}
					>
						{services &&
							services.map((data, index: number) => (
								<option key={index} value={data.id}>
									{data.title}
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
						rows={10}
					/>
				</FormControl>
			</Flex>

			<Flex flexDir={'column'} gap={'2'} justify={'center'}>
				<Button
					isLoading={isLoading}
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
