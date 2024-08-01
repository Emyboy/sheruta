import { DEFAULT_PADDING } from '@/configs/theme'
import { useOptionsContext } from '@/context/options.context'
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	Select,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react'
import { Autocomplete, LoadScript } from '@react-google-maps/api'
import React, { useEffect, useState } from 'react'
import { HostSpaceFormProps } from '.'

const libraries: 'places'[] = ['places']

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

export default function Summary({
	next,
	formData,
	setFormData,
}: HostSpaceFormProps) {
	const { optionsState: options } = useOptionsContext()

	const [filteredLocationOptions, setFilteredLocationOptions] = useState(
		options.location_keywords,
	)

	useEffect(() => {
		if (formData.state)
			setFilteredLocationOptions(
				options.location_keywords.filter(
					(location) => location._state_id === formData.state,
				),
			)
	}, [formData.state])

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
			const place = autocomplete.getPlace()
			console.log(place)

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
			localStorage.setItem(
				'host_space_form',
				JSON.stringify({
					...formData,
					[e.target.name]: Number(e.target.value.replace(/[^0-9]/g, '')),
				}),
			)
		} else {
			setFormData((prev) => ({
				...prev,
				[e.target.name]: e.target.value,
			}))

			localStorage.setItem(
				'host_space_form',
				JSON.stringify({
					...formData,
					[e.target.name]: e.target.value,
				}),
			)
		}
	}

	const handleSubmit = async (e: any) => {
		e.preventDefault()

		setFormData((prev) => ({ ...prev, ...formData }))
		localStorage.setItem(
			'host_space_form',
			JSON.stringify({ ...formData, ...formData }),
		)

		next()
	}

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
								Title
							</Text>
							<Input
								onChange={handleChange}
								required
								minLength={5}
								value={formData.title}
								name="title"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="TITLE HERE"
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
								placeholder="Summary Here"
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
								Budget
							</Text>
							<Input
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
								onChange={(e) => {
									handleChange(e)
									const selectedCategory = options.categories.find(
										(category) => category.id === e.target.value,
									)
									if (selectedCategory) {
										setFormData((prev) => ({
											...prev,
											_category_ref: selectedCategory._ref,
										}))
									}
								}}
								required
								value={formData.category}
								name="category"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
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
								onChange={(e) => {
									handleChange(e)
									const selectedService = options.services.find(
										(service) => service.id === e.target.value,
									)
									if (selectedService) {
										setFormData((prev) => ({
											...prev,
											_service_ref: selectedService._ref,
										}))
									}
								}}
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
								onChange={(e) => {
									handleChange(e)
									const selectedProperty = options.property_types.find(
										(property) => property.id === e.target.value,
									)
									if (selectedProperty) {
										setFormData((prev) => ({
											...prev,
											_property_type_ref: selectedProperty._ref,
										}))
									}
								}}
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
								Select a State
							</Text>
							<Select
								onChange={(e) => {
									handleChange(e)
									const selectedState = options.states.find(
										(state) => state.id === e.target.value,
									)
									if (selectedState) {
										setFormData((prev) => ({
											...prev,
											_state_ref: selectedState._ref,
										}))
									}
								}}
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
								onChange={(e) => {
									handleChange(e)
									const selectedLocation = filteredLocationOptions.find(
										(location) => location.id === e.target.value,
									)
									if (selectedLocation) {
										setFormData((prev) => ({
											...prev,
											_location_keyword_ref: selectedLocation._ref,
										}))
									}
								}}
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
										id="address"
										type="text"
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
				<Button type={'submit'}>{`Next`}</Button>
			</Flex>
		</>
	)
}
