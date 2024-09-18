import { DEFAULT_PADDING } from '@/configs/theme'
import { libraries } from '@/constants'
import { useOptionsContext } from '@/context/options.context'
import SherutaDB, { DBCollectionName } from '@/firebase/service/index.firebase'
import {
	createHostRequestDTO,
	HostRequestData,
} from '@/firebase/service/request/request.types'
import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Select,
	SimpleGrid,
	Spinner,
	Text,
	Textarea,
	useToast,
	VStack,
} from '@chakra-ui/react'
import { Autocomplete, LoadScript } from '@react-google-maps/api'
import { Timestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { BiMinusCircle, BiPlusCircle } from 'react-icons/bi'
import { HostSpaceFormProps } from '.'
import { useAuthContext } from '@/context/auth.context'

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

export default function Summary({ formData, setFormData }: HostSpaceFormProps) {
	const { optionsState: options } = useOptionsContext()
	const toast = useToast()
	const router = useRouter()
	const {
		authState: { flat_share_profile },
	} = useAuthContext()

	const [loading, setLoading] = useState(false)

	const [houseRules, setHouseRules] = useState<string[]>(
		formData.house_rules ? formData.house_rules : [''],
	)

	const [filteredLocationOptions, setFilteredLocationOptions] = useState(
		options.location_keywords,
	)

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

			const locationText =
				locationObject.formatted_address || formData.google_location_text

			setFormData((prev) => ({
				...prev,
				google_location_object: locationObject,
				google_location_text: locationText,
			}))
		}
	}, [autocomplete, formData.google_location_text])

	const addHouseRule = () => setHouseRules((prev) => [...prev, ''])

	const removeHouseRule = (i: number) => {
		const updatedRules = houseRules.filter((_, idx) => idx !== i)

		setHouseRules(updatedRules)
		setFormData((prev) => ({ ...prev, house_rules: updatedRules }))
	}

	const handleHouseRuleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		idx: number,
	) => {
		const { value } = e.target

		const updatedRules = [...houseRules]
		updatedRules[idx] = value
		setHouseRules(updatedRules)

		setFormData((prev) => ({ ...prev, house_rules: updatedRules }))
	}

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		if (
			e.target.name === 'budget' ||
			e.target.name === 'service_charge' ||
			e.target.name === 'bathrooms' ||
			e.target.name === 'toilets' ||
			e.target.name === 'living_rooms'
		) {
			setFormData((prev) => ({
				...prev,
				[e.target.name]: Number(e.target.value.replace(/[^0-9]/g, '')),
			}))
		} else {
			setFormData((prev) => ({
				...prev,
				[e.target.name]: e.target.value,
			}))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		setLoading(true)

		const selectedCategory = options.categories.find(
			(category) => category.id === formData.category,
		)
		const selectedService = options.services.find(
			(service) => service.id === formData.service,
		)
		const selectedLocation = filteredLocationOptions.find(
			(location) => location.id === formData.area,
		)
		const selectedState = options.states.find(
			(state) => state.id === formData.state,
		)
		const selectedProperty = options.property_types.find(
			(property) => property.id === formData.property,
		)

		try {
			const { category, service, state, area, property, ...cleanedFormData } =
				formData

			const data: HostRequestData = {
				...cleanedFormData,
				_location_keyword_ref: selectedLocation._ref,
				_state_ref: selectedState._ref,
				_service_ref: selectedService._ref,
				_category_ref: selectedCategory._ref,
				_property_type_ref: selectedProperty._ref,
				_user_ref: flat_share_profile?._user_ref,
				seeking: false,
				updatedAt: Timestamp.now(),
			}

			console.log('data before parse', data)

			createHostRequestDTO.parse(data)

			await SherutaDB.update({
				collection_name: DBCollectionName.flatShareRequests,
				data,
				document_id: formData.uuid,
			})

			toast({
				status: 'success',
				title: 'You have successfully updated your space',
			})

			router.push('/')
		} catch (e) {
			console.log('Unknown error', e)
			toast({ title: 'Error updating your details', status: 'error' })
		}

		setLoading(false)
	}

	useEffect(() => {
		if (formData.state)
			setFilteredLocationOptions(
				options.location_keywords.filter(
					(location) => location._state_id === formData.state,
				),
			)
	}, [formData.state])

	return (
		<>
			<Flex
				onSubmit={handleSubmit}
				flexDir={'column'}
				justifyContent={'center'}
				alignItems={'center'}
				as={'form'}
				w={'full'}
			>
				<br />

				<VStack spacing={6} mb={3} w={'full'}>
					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Apartment Description
							</Text>
							<Textarea
								onChange={handleChange}
								required
								minLength={20}
								value={formData.description}
								name="description"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Write a brief description about the apartment"
								resize={'vertical'}
								height={160}
							/>
						</Flex>
					</Flex>
					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Rent
							</Text>
							<Input
								_placeholder={{ color: 'text_muted' }}
								onChange={handleChange}
								required
								type="text"
								min={1}
								value={String(formData.budget)}
								name="budget"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Price"
							/>
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Service Charge
							</Text>
							<Input
								_placeholder={{ color: 'text_muted' }}
								onChange={handleChange}
								type="text"
								value={String(formData.service_charge)}
								name="service_charge"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Service Charge"
							/>
						</Flex>
					</Flex>

					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Select a payment type
							</Text>
							<Select
								onChange={handleChange}
								required
								value={formData.payment_type}
								name="payment_type"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Payment Type"
								_placeholder={{ color: 'text_muted' }}
								_light={{ color: 'dark' }}
								size="md"
								color={'border_color'}
							>
								<option style={{ color: 'black' }} value="weekly">
									Weekly
								</option>
								<option style={{ color: 'black' }} value="monthly">
									Monthly
								</option>
								<option style={{ color: 'black' }} value="annually">
									Annually
								</option>
								<option style={{ color: 'black' }} value="bi-annually">
									Bi-Annually
								</option>
							</Select>
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Select availability status
							</Text>
							<Select
								onChange={handleChange}
								required
								value={formData.availability_status || ''}
								name="availability_status"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								_placeholder={{ color: 'text_muted' }}
								_light={{ color: 'dark' }}
								placeholder="Availability Status"
								size="md"
							>
								<option style={{ color: 'black' }} value="available">
									Available
								</option>
								<option style={{ color: 'black' }} value="unavailable">
									Unavailable
								</option>
								<option style={{ color: 'black' }} value="reserved">
									Reserved
								</option>
							</Select>
						</Flex>
					</Flex>

					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Select apartment category
							</Text>
							<Select
								onChange={handleChange}
								required
								value={formData.category}
								name="category"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								_placeholder={{ color: 'text_muted' }}
								_light={{ color: 'dark' }}
								placeholder="Category"
								size="md"
								color={'border_color'}
							>
								{options.categories.map((category) => (
									<option
										key={category.id}
										style={{ color: 'black' }}
										value={category.id}
									>
										{category.title}
									</option>
								))}
							</Select>
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Living rooms
							</Text>
							<Input
								_placeholder={{ color: 'text_muted' }}
								onChange={handleChange}
								required
								type="text"
								min={1}
								value={String(formData.living_rooms)}
								name="living_rooms"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Living rooms"
							/>
						</Flex>
					</Flex>
					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Toilets
							</Text>
							<Input
								_placeholder={{ color: 'text_muted' }}
								onChange={handleChange}
								required
								type="text"
								min={1}
								value={String(formData.toilets)}
								name="toilets"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Toilets"
							/>
						</Flex>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Bathrooms
							</Text>
							<Input
								_placeholder={{ color: 'text_muted' }}
								onChange={handleChange}
								required
								type="text"
								min={1}
								value={String(formData.bathrooms)}
								name="bathrooms"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Bathrooms"
							/>
						</Flex>
					</Flex>

					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Select a service type
							</Text>
							<Select
								_placeholder={{ color: 'text_muted' }}
								_light={{ color: 'dark' }}
								onChange={handleChange}
								required
								value={formData.service}
								name="service"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Service Type"
								size="md"
								color={'border_color'}
							>
								{options.services.map((service) => (
									<option
										key={service.id}
										style={{ color: 'black', textTransform: 'capitalize' }}
										value={service.id}
									>
										{service.title}
									</option>
								))}
							</Select>
						</Flex>

						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Select type of property
							</Text>
							<Select
								_placeholder={{ color: 'text_muted' }}
								_light={{ color: 'dark' }}
								onChange={handleChange}
								required
								value={formData.property}
								name="property"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Property Type"
								size="md"
								color={'border_color'}
							>
								{options.property_types.map((property) => (
									<option
										key={property.id}
										style={{ color: 'black', textTransform: 'capitalize' }}
										value={property.id}
									>
										{property.title}
									</option>
								))}
							</Select>
						</Flex>
					</Flex>
					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Select available amenities
							</Text>

							<SimpleGrid columns={[1, 2, 3]} spacingY="8px">
								{options.amenities.map((amenity) => {
									return (
										<Checkbox
											type="checkbox"
											colorScheme="green"
											textTransform={'capitalize'}
											color={'border_color'}
											_light={{ color: 'dark' }}
											value={amenity.title}
											key={amenity.id}
											textColor={'white'}
											isChecked={formData.amenities.includes(amenity.title)}
											onChange={(e) => {
												const { checked, value } = e.target
												if (checked) {
													const amenities = [...formData.amenities, value]
													setFormData((prev) => ({ ...prev, amenities }))
												} else {
													const amenities = formData.amenities.filter(
														(amenity) => amenity !== value,
													)
													setFormData((prev) => ({ ...prev, amenities }))
												}
											}}
										>
											{amenity.title}
										</Checkbox>
									)
								})}
							</SimpleGrid>
						</Flex>
					</Flex>

					<Flex gap={DEFAULT_PADDING} w="full" flexDir={'column'}>
						<Flex
							justifyContent={'space-between'}
							alignItems={'center'}
							w="full"
						>
							<Text color={'text_muted'} fontSize={'base'}>
								List some house rules
							</Text>

							<Box mr={'-8px'}>
								<BiPlusCircle
									cursor={'pointer'}
									onClick={addHouseRule}
									size={'20px'}
									fill="#00bc73"
									title="add house rule"
								/>
							</Box>
						</Flex>
						{houseRules.map((_, i) => (
							<Box key={i} pos={'relative'}>
								<Input
									onChange={(e) => handleHouseRuleChange(e, i)}
									minLength={5}
									value={houseRules[i]}
									_placeholder={{ color: 'text_muted' }}
									borderColor={'border_color'}
									_dark={{ borderColor: 'dark_light' }}
									placeholder="Enter your rule"
								/>
								{houseRules.length > 1 && (
									<Box
										cursor={'pointer'}
										pos={'absolute'}
										top={'-8px'}
										right={'-8px'}
										_dark={{
											bgColor: 'dark',
										}}
										bgColor="white"
										rounded={'full'}
									>
										<BiMinusCircle
											onClick={() => removeHouseRule(i)}
											size={'20px'}
											fill="#00bc73"
											title="remove house rule"
										/>
									</Box>
								)}
							</Box>
						))}
					</Flex>

					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Select a State
							</Text>
							<Select
								_placeholder={{ color: 'text_muted' }}
								_light={{ color: 'dark' }}
								onChange={handleChange}
								required
								value={formData.state}
								name="state"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="State"
								size="md"
								color={'border_color'}
							>
								{options.states.map((state) => (
									<option
										style={{ color: 'black', textTransform: 'capitalize' }}
										value={state.id}
										key={state.id}
									>
										{state.name}
									</option>
								))}
							</Select>
						</Flex>

						<Flex
							justifyContent={'flex-start'}
							flexDir={'column'}
							w="full"
							gap={3}
						>
							<Text color={'text_muted'} fontSize={'base'}>
								Select an area
							</Text>
							<Select
								_placeholder={{ color: 'text_muted' }}
								_light={{ color: 'dark' }}
								onChange={handleChange}
								required
								value={formData.area}
								name="area"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Area"
								size="md"
								color={'border_color'}
							>
								{formData.state &&
									filteredLocationOptions.map((area) => (
										<option
											style={{ color: 'black', textTransform: 'capitalize' }}
											value={area.id}
											key={area.id}
										>
											{area.name}
										</option>
									))}
							</Select>
						</Flex>
					</Flex>

					{formData.area && (
						<LoadScript
							googleMapsApiKey={
								process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY as string
							}
							libraries={libraries}
						>
							<FormControl mt={'-1.5rem'}>
								<FormLabel htmlFor="address">
									Choose a more descriptive location in {formData.area}?
								</FormLabel>
								<Autocomplete
									onLoad={handleLoad}
									onPlaceChanged={handlePlaceChanged}
								>
									<Input
										_placeholder={{ color: 'text_muted' }}
										id="address"
										type="text"
										required
										placeholder="Enter a location"
										name="google_location_text"
										value={formData.google_location_text}
										onChange={handleChange}
									/>
								</Autocomplete>
							</FormControl>
						</LoadScript>
					)}
				</VStack>
				<br />
				<Button bgColor={'brand'} color={'white'} type={'submit'}>
					{loading ? <Spinner /> : 'Update'}
				</Button>
			</Flex>
		</>
	)
}
