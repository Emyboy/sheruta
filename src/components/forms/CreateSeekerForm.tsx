import { libraries } from '@/constants'
import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Select,
	Textarea,
	useColorMode,
} from '@chakra-ui/react'
import { Timestamp, DocumentReference, DocumentData } from 'firebase/firestore'
import { LoadScript, Autocomplete } from '@react-google-maps/api'

import SherutaDB from '@/firebase/service/index.firebase'
import useCommon from '@/hooks/useCommon'
import {
	createSeekerRequestDTO,
	PaymentPlan,
	SeekerRequestData,
	LocationObject,
} from '@/firebase/service/request/request.types'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'

import { z, ZodError } from 'zod'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { v4 as generateUId } from 'uuid'

const GOOGLE_PLACES_API_KEY: string | undefined =
	process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

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

interface Options {
	_service_ref: DocumentReference | undefined
	_location_keyword_ref: DocumentReference | undefined
	_state_ref: DocumentReference | undefined
}

interface budgetLimits {
	monthly: number
	annually: number
	quarterly: number
	'bi-annually': number
	weekly: number
}

const budgetLimits: Record<PaymentPlan, number> = {
	weekly: 10000,
	monthly: 25000,
	quarterly: 80000,
	'bi-annually': 100000,
	annually: 150000,
}

interface userInfo {
	state: string | undefined
	location: string | undefined
}

const initialFormState: SeekerRequestData = {
	description: '',
	uuid: generateUId(), //automatically generate a uuid
	budget: 0,
	google_location_object: {} as LocationObject,
	google_location_text: '',
	_location_keyword_ref: undefined,
	_state_ref: undefined,
	_service_ref: undefined,
	_user_ref: undefined,
	payment_type: 'weekly',
	seeking: true, //this should be true by default for seekers
	createdAt: Timestamp.now(),
	updatedAt: Timestamp.now(),
}

const CreateSeekerForm: React.FC = () => {
	const { colorMode } = useColorMode()
	const { showToast } = useCommon()

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const {
		authState: { flat_share_profile, user, user_info },
	} = useAuthContext()

	const [userInfo, setUserInfo] = useState<userInfo>({
		state: undefined,
		location: undefined,
	})

	const {
		optionsState: { services, states, location_keywords },
	} = useOptionsContext()

	useEffect(() => {
		if (flat_share_profile && user_info) {
			setUserInfo({
				state: flat_share_profile?.state,
				location: flat_share_profile?.location_keyword,
			})

			setFormData((prev: SeekerRequestData) => ({
				...prev,
				_user_ref: flat_share_profile?._user_ref,
			}))
		}
	}, [flat_share_profile, user_info])

	const [optionsRef, setOptionsRef] = useState<Options>({
		_service_ref: undefined,
		_state_ref: undefined,
		_location_keyword_ref: undefined,
	})

	const [locations, setLocations] = useState<any[]>([])

	const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

	const getLocations = (stateId: string): string[] => {
		return location_keywords.filter((item) => item._state_id === stateId)
	}

	const [formData, setFormData] = useState(initialFormState)

	const [isBudgetInvalid, setIsBudgetInvalid] = useState<boolean>(false)

	const [googleLocationText, setGoogleLocationText] = useState<string>('')

	const [formErrors, setFormErrors] = useState<Errors>({})

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
		const { id, name, value } = e.target

		const updateBudgetInvalidState = (
			paymentType: string,
			budgetValue: number,
		) => {
			const budgetLimit = budgetLimits[paymentType as PaymentPlan]
			setIsBudgetInvalid(budgetValue < budgetLimit)
		}

		const updateOptionsRef = (key: string, refValue: any) => {
			setOptionsRef((prev) => ({
				...prev,
				[key]: refValue,
			}))
		}

		switch (id) {
			case 'budget':
				const paymentType = formData.payment_type
				if (paymentType) updateBudgetInvalidState(paymentType, Number(value))
				break

			case 'payment_type':
				const budget = formData.budget as number
				if (value) updateBudgetInvalidState(value as PaymentPlan, budget)
				break

			case 'stateId':
				if (value) {
					const newLocations = getLocations(value)
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
			if (
				!flat_share_profile ||
				!user ||
				Object.keys(flat_share_profile || {}).length === 0 ||
				Object.keys(user || {}).length === 0
			) {
				return showToast({
					message: 'Please login and try again',
					status: 'error',
				})
			}

			setIsLoading(true)
			if (!flat_share_profile?._user_id || !user?._id)
				return showToast({
					message: 'Please log in to make a request',
					status: 'error',
				})
			//create new form data object by retrieving the global form data and options ref
			const finalFormData = {
				...formData,
				...optionsRef,
			}

			finalFormData.budget = Number(finalFormData.budget)
			createSeekerRequestDTO.parse(finalFormData)

			const res: DocumentData = await SherutaDB.create({
				collection_name: 'requests',
				data: finalFormData,
				document_id: initialFormState.uuid as string,
			})

			if (Object.keys(res).length) {
				showToast({
					message: 'Your request has been posted successfully',
					status: 'success',
				})

				setTimeout(() => {
					window.location.assign('/')
				}, 1000)
			}
		} catch (error) {
			console.error(error)
			if (error instanceof ZodError) {
				setFormErrors(extractErrors(error.issues as ErrorObject[]))
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
				<FormControl
					isRequired
					isInvalid={
						isBudgetInvalid || typeof formErrors?.budget !== 'undefined'
					}
					flex="1"
				>
					<FormLabel requiredIndicator={null} htmlFor="budget">
						Budget
					</FormLabel>
					<Input
						type="number"
						id="budget"
						name="budget"
						onChange={handleChange}
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
						defaultValue={userInfo?.state}
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
						defaultValue={userInfo?.location}
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
					{
						(typeof window !== 'undefined' && !window.google) ?
							<LoadScript
								googleMapsApiKey={GOOGLE_PLACES_API_KEY as string}
								libraries={libraries}>
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
							</LoadScript> : <Autocomplete
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
					}
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
						value={formData.description}
						onChange={handleChange}
						placeholder="I'm looking for a shared flat with AC, Wifi and Gas Cooker"
						minLength={140}
						rows={10}
					/>
				</FormControl>
			</Flex>

			<Button
				isLoading={isLoading}
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
