import React, { useEffect, useState } from 'react'
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Select,
	Textarea,
	FormErrorMessage,
	FormHelperText,
} from '@chakra-ui/react'
import { Timestamp, DocumentReference, DocumentData } from 'firebase/firestore' // Import Timestamp and DocumentReference from Firebase for type checking
import { v4 as generateUId } from 'uuid'
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import useCommon from '@/hooks/useCommon'
import {
	createSeekerRequestDTO,
	RequestData,
} from '@/firebase/service/request/request.types'
import { z, ZodError } from 'zod'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'
import { useRouter } from 'next/navigation'

// Define the type for the error objects
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

//generate schema from the validation object
// type createSeekerRequestSchema = z.infer<typeof createSeekerRequestDTO>

// Define the initial state based on the DTO structure
const initialFormState: Partial<RequestData> = {
	description: '',
	uuid: generateUId(), //automatically generate a uuid
	budget: 10000,
	google_location_object: {},
	google_location_text: '',
	_location_keyword_ref: undefined as DocumentReference | undefined,
	_state_ref: undefined as DocumentReference | undefined,
	_service_ref: undefined as DocumentReference | undefined,
	_category_ref: undefined as DocumentReference | undefined,
	_user_ref: undefined as DocumentReference | undefined,
	payment_type: 'monthly',
	// media_type: 'image',
	seeking: true, //this should be true by default for seekers
	createdAt: Timestamp.now(),
	updatedAt: Timestamp.now(),
}

const libraries: 'places'[] = ['places']

type OptionsRef = DocumentReference | undefined

interface Options {
	_service_ref: OptionsRef
	_property_type_ref: OptionsRef
	_category_ref: OptionsRef
	_location_keyword_ref: OptionsRef
}

const initialOptionsStateRef = {
	_service_ref: undefined,
	_property_type_ref: undefined,
	_category_ref: undefined,
	_location_keyword_ref: undefined,
}

interface budgetLimits {
	monthly: number
	annually: number
	quarterly: number
	bi_annually: number
	weekly: number
}

// PaymentType union type
type PaymentType =
	| 'monthly'
	| 'annually'
	| 'quarterly'
	| 'bi_annually'
	| 'weekly'

const budgetLimits: Record<PaymentType, number> = {
	weekly: 10000,
	monthly: 25000,
	quarterly: 80000,
	bi_annually: 100000,
	annually: 150000,
}

const CreateSeekerForm: React.FC = () => {
	//get the toast plugin
	const { showToast } = useCommon()

	//state to handle form submission
	const [isLoading, setIsLoading] = useState<boolean>(false)

	//init router
	const router = useRouter()

	//get user authentication state
	const {
		authState: { flat_share_profile },
	} = useAuthContext()

	// console.log(authState)

	//state to hold _user_ref value
	const [userRef, setUserRef] = useState<DocumentReference | undefined>(
		undefined,
	)

	// update userRef state when auth state changes
	useEffect(() => {
		if (typeof flat_share_profile?._user_ref !== 'undefined') {
			setUserRef(flat_share_profile?._user_ref)
		}
	}),
		[flat_share_profile, flat_share_profile?._user_ref]

	//get options
	const {
		optionsState: {
			categories,
			services,
			states,
			location_keywords,
			property_types,
		},
	} = useOptionsContext()

	//state for storing Document Ref for category, services, states, properties
	const [optionsRef, setOptionsRef] = useState<Options>(initialOptionsStateRef)

	//state for storing filtered locations based on the selected state
	const [locations, setLocations] = useState<any[]>([])

	//utility function to filter locations by the selected state using the selected state _state_id
	const getLocations = (stateId: string): string[] => {
		return location_keywords.filter((item) => item._state_id === stateId)
	}

	//state for storing form data
	const [formData, setFormData] = useState(initialFormState)

	//state to store budget validation
	const [isBudgetInvalid, setIsBudgetInvalid] = useState<boolean>(false)

	const [googleLocationObject, setGoogleLocationObject] = useState<any>(null)
	const [googleLocationText, setGoogleLocationText] = useState<string>('')

	//state to store errors when validating with zod
	const [formErrors, setFormErrors] = useState<Errors>({})

	const handlePlaceChanged = (
		autocomplete: google.maps.places.Autocomplete,
	) => {
		const place = autocomplete.getPlace()
		if (place.geometry) {
			setGoogleLocationObject(place)
			setGoogleLocationText(place.formatted_address || '')
		}
	}

	// Function to handle form input changes
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		let { name, value } = e.target

		switch (name) {
			case 'budget':
				//get the payment type
				const paymentType = formData.payment_type

				if (paymentType) {
					//get the budget limit
					const budgetLimit = budgetLimits[paymentType]

					setIsBudgetInvalid(Number(value) < budgetLimit)
					//convert to number
					value = Number(value) as any
				}

				break

			case 'payment_type':
				//get the budget
				const budget = formData.budget as number

				if (value) {
					//get the budget limit
					const budgetLimit = budgetLimits[value as PaymentType]

					setIsBudgetInvalid(budget < budgetLimit)
				}

				break

			case 'stateId':
				if (value) {
					//call function to filter the locaitons by _state_id
					const newLocations = getLocations(value)
					// console.log(newLocations)
					// store the new locations
					setLocations(newLocations)
					//get ref
					const stateRef = states.find((data) => data.id === value)?._ref
					//update options ref state
					setOptionsRef((prev) => ({
						...prev,
						_state_ref: stateRef,
					}))
				}
				break

			case 'locationKeywordId':
				if (value) {
					//get ref
					const locationKeywordRef = location_keywords.find(
						(data) => data.id === value,
					)?._ref
					//update options ref
					setOptionsRef((prev) => ({
						...prev,
						_location_keyword_ref: locationKeywordRef,
					}))
				}
				break

			case 'serviceId':
				if (value) {
					//get ref
					const serviceRef = services.find((data) => data.id === value)?._ref
					//update options ref
					setOptionsRef((prev) => ({
						...prev,
						_service_ref: serviceRef,
					}))
				}
				break

			case 'propertyTypeId':
				if (value) {
					//get ref
					const propertyTypeRef = property_types.find(
						(data) => data.id === value,
					)?._ref
					//update options ref
					setOptionsRef((prev) => ({
						...prev,
						_property_type_ref: propertyTypeRef,
					}))
				}
				break

			case 'categoryId':
				if (value) {
					//get ref
					const categoryRef = categories.find((data) => data.id === value)?._ref
					//update options ref state
					setOptionsRef((prev) => ({
						...prev,
						_category_ref: categoryRef,
					}))
				}
				break
		}

		//store in global form data state
		setFormData((prevData) => ({
			...prevData,
			...{
				[name]: value,
			},
		}))
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
				...optionsRef,
				_user_ref: userRef,
			}

			// console.log(finalFormData) // Log the form data to the console

			//validate the zod schema with final form data
			createSeekerRequestDTO.parse(finalFormData)

			//upload data to the collection
			const res: DocumentData = await SherutaDB.create({
				collection_name: 'requests',
				data: finalFormData,
				document_id: initialFormState.uuid as string,
			})

			//check if the request was successful
			if (Object.keys(res).length) {
				showToast({
					message: 'Your request has been posted successfully',
					status: 'success',
				})

				//redirect users after 3secs
				setTimeout(() => {
					router.push('/')
				}, 1500)
			}
		} catch (error) {
			console.error(error)
			if (error instanceof ZodError) {
				setFormErrors(extractErrors(error.issues as ErrorObject[]))
				console.log(typeof formErrors?.budget)
				console.error('Zod Validation Error:', error.issues)
			} else {
				// Handle other errors
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
			{/* Select service field */}
			<FormControl isRequired mb={4}>
				<FormLabel htmlFor="payment_type">Select service</FormLabel>
				<Select
					id="service"
					name="serviceId"
					onChange={handleChange}
					bg="dark"
					placeholder="Select a service"
				>
					{services &&
						services.map((data, index: number) => {
							const serviceTitle = data.title
							const serviceId = data.id
							return (
								<option key={index} value={serviceId}>
									{serviceTitle}
								</option>
							)
						})}
				</Select>
				<FormHelperText>
					What kind of service are you interested in?
				</FormHelperText>
			</FormControl>

			{/* Select property type field */}
			<FormControl isRequired mb={4}>
				<FormLabel htmlFor="_property_type_ref">
					Select apartment type
				</FormLabel>
				<Select
					id="property_type"
					name="propertyTypeId"
					onChange={handleChange}
					bg="dark"
					placeholder="Select apartment type"
				>
					{property_types &&
						property_types.map((data, index: number) => {
							const propertyTitle = data.title
							const propertyId = data.id
							return (
								<option key={index} value={propertyId}>
									{propertyTitle}
								</option>
							)
						})}
				</Select>
				<FormHelperText>
					What type of apartment are you interested in?
				</FormHelperText>
			</FormControl>

			{/* Select category field */}
			<FormControl isRequired mb={4}>
				<FormLabel htmlFor="payment_type">Select category</FormLabel>
				<Select
					id="category"
					name="categoryId"
					onChange={handleChange}
					bg="dark"
					placeholder="Select a category"
				>
					{categories &&
						categories.map((data, index: number) => {
							const categoryTitle = data.title
							const categoryId = data.id
							return (
								<option key={index} value={categoryId}>
									{categoryTitle}
								</option>
							)
						})}
				</Select>
				<FormHelperText>
					Select the type of space you are requesting, such as &apos;2
					bedroom&apos;, &apos;3 bedroom&apos;, or &apos;self-contained&apos;.
				</FormHelperText>
			</FormControl>

			{/* Description field */}
			<FormControl mb={4}>
				<FormLabel htmlFor="description">Description</FormLabel>
				<Textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleChange}
					placeholder="I am looking for ..."
					maxLength={200}
				/>
				<FormHelperText>
					Provide a little description of the apartment you are seeking
				</FormHelperText>
			</FormControl>

			{/* Select state field */}
			<FormControl isRequired mb={4}>
				<FormLabel htmlFor="payment_type">Select state</FormLabel>
				<Select
					id="state"
					name="stateId"
					onChange={handleChange}
					bg="dark"
					placeholder="Select a state"
				>
					{states &&
						states.map((state, index: number) => {
							const stateName = state.name
							const stateId = state.id
							return (
								<option key={index} value={stateId}>
									{stateName}
								</option>
							)
						})}
				</Select>
				<FormHelperText>
					Choose a state where you want to seek an apartment from
				</FormHelperText>
			</FormControl>

			{/* Select location field */}
			<FormControl isRequired mb={4}>
				<FormLabel htmlFor="payment_type">Select location</FormLabel>
				<Select
					id="location"
					name="locationKeywordId"
					onChange={handleChange}
					bg="dark"
					placeholder="Select a location"
				>
					{locations &&
						locations.map((data, index: number) => {
							const locationName = data.name
							const locationId = data.id
							return (
								<option key={index} value={locationId}>
									{locationName}
								</option>
							)
						})}
				</Select>
				<FormHelperText>
					Choose the location where you wish to seek an apartment from
				</FormHelperText>
			</FormControl>

			{/* Google location text field */}
			{/* <FormControl mb={4}>
                <FormLabel htmlFor="google_location_text">Location</FormLabel>
                <Input
                    id="google_location_text"
                    name="google_location_text"
                    value={formData.google_location_text}
                    onChange={handleChange}
                />
            </FormControl> */}
			<LoadScript
				googleMapsApiKey="AIzaSyB2cI573A6N2fvTgJcfyci5GLdTdU0Z67E"
				libraries={libraries}
			>
				<FormControl mb={4}>
					<FormLabel htmlFor="location">Location</FormLabel>
					<Autocomplete
						onLoad={(autocomplete) => console.log('Autocomplete Loaded')}
						onPlaceChanged={() =>
							handlePlaceChanged(
								(window as any).google.maps.places.Autocomplete,
							)
						}
					>
						<Input
							id="location"
							type="text"
							placeholder="Enter a location"
							value={googleLocationText}
							onChange={(e) => setGoogleLocationText(e.target.value)}
						/>
					</Autocomplete>
				</FormControl>
			</LoadScript>

			{/* Payment type field */}
			<FormControl isRequired mb={4}>
				<FormLabel htmlFor="payment_type">Payment Type</FormLabel>
				<Select
					id="payment_type"
					name="payment_type"
					onChange={handleChange}
					bg="dark"
					placeholder="Select payment type"
				>
					<option value="weekly">Weekly</option>
					<option value="monthly">Monthly</option>					
					<option value="quarterly">Quarterly</option>
					<option value="bi_annually">Bi-annually</option>
					<option value="annually">Annually</option>
				</Select>
				<FormHelperText>
					Choose how you would like to pay for this apartment
				</FormHelperText>
			</FormControl>

			{/* Budget field */}
			<FormControl
				isRequired
				isInvalid={isBudgetInvalid || typeof formErrors?.budget !== 'undefined'}
				mb={4}
			>
				<FormLabel htmlFor="budget">Your budget</FormLabel>
				<Input
					type="number"
					id="budget"
					name="budget"
					value={formData.budget}
					onChange={handleChange}
				/>
				<FormErrorMessage>
					Please enter an amount that meets the minimum required value of ₦
					{budgetLimits[formData?.payment_type || 'monthly'].toLocaleString()}.
				</FormErrorMessage>
				<FormHelperText>
					Your budget should meet the minimum required value of ₦
					{budgetLimits[formData?.payment_type || 'monthly'].toLocaleString()}
				</FormHelperText>
			</FormControl>

			{/* Submit button */}
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

export default CreateSeekerForm;
