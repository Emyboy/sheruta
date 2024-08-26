'use client'

import { libraries } from '@/constants'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'
import { db } from '@/firebase'
import SherutaDB from '@/firebase/service/index.firebase'
import {
	createSeekerRequestDTO,
	LocationObject,
	PaymentPlan,
	RequestData,
} from '@/firebase/service/request/request.types'
import useCommon from '@/hooks/useCommon'
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
import { Autocomplete, LoadScript } from '@react-google-maps/api'
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
} from '@/firebase/service/request/request.types'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { v4 as generateUId } from 'uuid'
import { ZodError } from 'zod'

const GOOGLE_PLACES_API_KEY: string | undefined =
	process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

interface DocRefs {
	_service_ref: DocumentReference | undefined
	_location_keyword_ref: DocumentReference | undefined
	_state_ref: DocumentReference | undefined
	_user_ref: DocumentReference | undefined
}

const budgetLimits: Record<PaymentPlan, number> = {
	weekly: 10000,
	monthly: 25000,
	quarterly: 80000,
	'bi-annually': 100000,
	annually: 150000,
}

interface Props {
	editFormData: Partial<RequestData> | undefined
	requestId: string
}

const initialFormState: SeekerRequestData = {
	description: '',
	uuid: '',
	budget: 0,
	google_location_object: {} as LocationObject,
	google_location_text: '',
	_location_keyword_ref: undefined as DocumentReference | undefined,
	_state_ref: undefined as DocumentReference | undefined,
	_service_ref: undefined as DocumentReference | undefined,
	flat_share_profile: {
		done_kyc: false,
		_id: '',
		first_name: '',
		last_name: '',
		avatar_url: '',
	},
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
	editFormData: SeekerRequestData
	requestId: string
}> = ({ editFormData, requestId }) => {
	const { colorMode } = useColorMode()
	const { showToast } = useCommon()
	const router = useRouter()

	const {
		authState: { flat_share_profile },
	} = useAuthContext()

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [formData, setFormData] = useState(initialFormState)

	const {
		optionsState: { services, states, location_keywords },
	} = useOptionsContext()

	const [docRefs, setDocRefs] = useState<DocRefs>({
		_service_ref: undefined,
		_state_ref: undefined,
		_location_keyword_ref: undefined,
		_user_ref: undefined,
	})

	const [locations, setLocations] = useState<any[]>([])

	const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

	const getLocations = (stateId: string): string[] => {
		return location_keywords.filter((item) => item._state_id === stateId)
	}

	useEffect(() => {
		const fetchData = async () => {
			if (editFormData && flat_share_profile?._user_id) {
				try {
					const convertedFormData =
						convertPlainObjectsToTimestamps(editFormData)

					if (editFormData.flat_share_profile) {
						const authorDoc = editFormData.flat_share_profile

						// If user IDs don't match, redirect
						if (authorDoc?._id !== flat_share_profile?._user_id) {
							router.push('/')
							return
						}

						const { done_kyc } = flat_share_profile
						const { _id, first_name, last_name, avatar_url } = authorDoc

						setFormData((prev) => ({
							...prev,
							...convertedFormData,
							flat_share_profile: {
								done_kyc,
								_id,
								first_name,
								last_name,
								avatar_url,
							},
						}))

						// Convert authorDoc back to DocumentReference
						const _user_ref = doc(db, 'users', authorDoc._id)

						// Set document reference state
						setDocRefs((prev) => ({
							...prev,
							_user_ref,
						}))
					}
				} catch (error) {
					console.error('Error fetching data: ', error)
				}
			}
		}

		fetchData()
	}, [editFormData, flat_share_profile, router])

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
		const { id, name, value } = e.target

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
