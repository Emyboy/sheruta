import React, { useEffect, useState } from 'react'
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Select,
	Textarea,
	FormErrorMessage,
	Flex,
	useColorMode,
} from '@chakra-ui/react'
import {
	Timestamp,
	DocumentReference,
	DocumentData,
	getDoc,
	doc,
} from 'firebase/firestore'
import { v4 as generateUId } from 'uuid'
import { LoadScript, Autocomplete } from '@react-google-maps/api'
import SherutaDB from '@/firebase/service/index.firebase'
import useCommon from '@/hooks/useCommon'
import {
	createSeekerRequestDTO,
	PaymentPlan,
	RequestData,
} from '@/firebase/service/request/request.types'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'
import { useRouter } from 'next/navigation'
import { ZodError } from 'zod'
import { db } from '@/firebase'

//get google places API KEY
const GOOGLE_PLACES_API_KEY: string | undefined =
	process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

const libraries: 'places'[] = ['places']
interface DocRefs {
	_service_ref: DocumentReference | undefined
	_location_keyword_ref: DocumentReference | undefined
	_state_ref: DocumentReference | undefined
	_user_ref: DocumentReference | undefined
}

interface LocationObject {
	formatted_address?: string
	geometry?: {
		location?: {
			lat: number
			lng: number
		}
	}
	[key: string]: any
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

// Define the initial state based on the DTO structure
const initialFormState: Partial<RequestData> = {
	description: '',
	uuid: generateUId(), //automatically generate a uuid
	budget: 0,
	google_location_object: {} as LocationObject,
	google_location_text: '',
	_location_keyword_ref: undefined as DocumentReference | undefined,
	_state_ref: undefined as DocumentReference | undefined,
	_service_ref: undefined as DocumentReference | undefined,
	_user_ref: undefined as DocumentReference | undefined,
	payment_type: 'weekly',
	seeking: true, //this should be true by default for seekers
	createdAt: Timestamp.now(),
	updatedAt: Timestamp.now(),
}

// const getDataFromRef = async (docRef: DocumentReference): Promise<any> => {
// 	const recordSnap = await getDoc(docRef)

// 	return recordSnap.exists() ? recordSnap.data() : null
// }

const EditSeekerForm: React.FC<Props> = ({ editFormData, requestId }) => {
	//color mode
	const { colorMode } = useColorMode()

	//get the toast plugin
	const { showToast } = useCommon()

	//init router
	const router = useRouter()

	//get user authentication state
	const {
		authState: { flat_share_profile },
	} = useAuthContext()

	//state to handle form submission
	const [isLoading, setIsLoading] = useState<boolean>(false)

	//state for storing form data
	const [formData, setFormData] = useState(initialFormState)

	//get options
	const {
		optionsState: { services, states, location_keywords },
	} = useOptionsContext()

	//state for storing Document Ref for category, services, states, properties
	const [docRefs, setDocRefs] = useState<DocRefs>({
		_service_ref: undefined,
		_state_ref: undefined,
		_location_keyword_ref: undefined,
		_user_ref: undefined,
	})

	//state for storing filtered locations based on the selected state
	const [locations, setLocations] = useState<any[]>([])

	//state for storing selected location keyword
	const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

	//utility function to filter locations by the selected state using the selected state _state_id
	const getLocations = (stateId: string): string[] => {
		return location_keywords.filter((item) => item._state_id === stateId)
	}

	useEffect(() => {
		const fetchData = async () => {
			if (editFormData && flat_share_profile?._user_id) {
				setFormData((prev) => ({
					...prev,
					...editFormData,
				}))
				// Get author's Doc and check if current user is allowed to perform this action
				if (editFormData._user_ref) {
					const authorDoc = editFormData._user_ref as unknown as Record<
						string,
						any
					>
					if (authorDoc?._id !== flat_share_profile?._user_id) {
						router.push('/')
					}

					//convert authorDoc | _user_ref back to a DocumentReference
					const _user_ref = doc(db, 'users', authorDoc._id)
					setDocRefs((prev) => ({
						...prev,
						_user_ref,
					}))
				}
			}
		}

		fetchData()
	}, [editFormData, flat_share_profile])

	//state to store budget validation
	const [isBudgetInvalid, setIsBudgetInvalid] = useState<boolean>(false)

	// const [googleLocationObject, setGoogleLocationObject] = useState<any>(null)
	const [googleLocationText, setGoogleLocationText] = useState<string>('')

	//state to store google places location data
	const [autocomplete, setAutocomplete] =
		useState<google.maps.places.Autocomplete | null>(null)

	const handleLoad = (
		autocompleteInstance: google.maps.places.Autocomplete,
	) => {
		setAutocomplete(autocompleteInstance)
		console.log('Autocomplete Loaded:', autocompleteInstance)
	}

	const handlePlaceChanged = () => {
		if (autocomplete) {
			//get place
			const place = autocomplete.getPlace()
			//get location object
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
			//get locaiton text
			const locationText = locationObject.formatted_address || ''
			//update location text state
			setGoogleLocationText(locationText)
			//update form data
			setFormData((prev) => ({
				...prev,
				google_location_object: locationObject,
				google_location_text: locationText,
			}))
		}
	}

	// Function to handle form input changes
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

	// Function to handle form submission
	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	): Promise<any> => {
		e.preventDefault()
		try {
			setIsLoading(true)
			//create new form data object by retrieving the global form data and options ref
			const finalFormData = {
				...formData,
				...docRefs,
			}

			//convert budget to number
			finalFormData.budget = Number(finalFormData.budget)

			const dataToUpdate = {
				data: finalFormData,
				collection_name: 'requests',
				document_id: requestId,
			}

			//validate the zod schema with final form data
			createSeekerRequestDTO.parse(finalFormData)

			//upload data to the collection
			const res: DocumentData | undefined = await SherutaDB.update(dataToUpdate)

			//check if the request was successful
			if (res && Object.keys(res).length) {
				showToast({
					message: 'Your request has been updated successfully',
					status: 'success',
				})

				//redirect users after 3secs
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

			{/* Submit button */}
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
		</form>
	)
}

export default EditSeekerForm
