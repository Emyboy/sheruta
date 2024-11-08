import { DEFAULT_PADDING } from '@/configs/theme'
import { libraries } from '@/constants'
import { useOptionsContext } from '@/context/options.context'
import { LocationObject } from '@/firebase/service/request/request.types'
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
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import React, { useEffect, useState } from 'react'
import { BiMinusCircle, BiPlusCircle } from 'react-icons/bi'
import { HostSpaceFormProps } from '.'

const GOOGLE_PLACES_API_KEY: string | undefined =
	process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

export default function Summary({
	next,
	formData,
	setFormData,
}: HostSpaceFormProps) {
	const { optionsState: options } = useOptionsContext()

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: GOOGLE_PLACES_API_KEY as string,
		libraries,
	})

	const [filteredLocationOptions, setFilteredLocationOptions] = useState(
		options.locations,
	)

	const [autocomplete, setAutocomplete] =
		useState<google.maps.places.Autocomplete | null>(null)

	const handleLoad = (
		autocompleteInstance: google.maps.places.Autocomplete,
	) => {
		if (autocompleteInstance) {
			setAutocomplete(autocompleteInstance)
		}
	}

	const handlePlaceChanged = () => {
		if (autocomplete) {
			const place = autocomplete.getPlace()

			if (place && place.geometry && place.geometry.location) {
				const locationObject: LocationObject = {
					formatted_address: place.formatted_address || '',
					geometry: {
						location: {
							lat: place.geometry.location.lat(),
							lng: place.geometry.location.lng(),
						},
					},
				}

				const locationText =
					locationObject.formatted_address || formData.google_location_text

				setFormData((prev) => ({
					...prev,
					google_location_object: locationObject,
					google_location_text: locationText,
				}))
				localStorage.setItem(
					'host_space_form',
					JSON.stringify({
						...formData,
						google_location_object: locationObject,
						google_location_text: locationText,
					}),
				)
			}
		}
	}

	const addHouseRule = () =>
		setFormData((prev) => ({
			...prev,
			house_rules: [...formData.house_rules, ''],
		}))

	const removeHouseRule = (i: number) => {
		const updatedRules = formData.house_rules.filter((_, idx) => idx !== i)

		setFormData((prev) => ({ ...prev, house_rules: updatedRules }))
		localStorage.setItem(
			'host_space_form',
			JSON.stringify({
				...formData,
				house_rules: updatedRules,
			}),
		)
	}

	const handleHouseRuleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		idx: number,
	) => {
		const { value } = e.target

		const updatedRules = [...formData.house_rules]
		updatedRules[idx] = value

		setFormData((prev) => ({ ...prev, house_rules: updatedRules }))
		localStorage.setItem(
			'host_space_form',
			JSON.stringify({
				...formData,
				house_rules: updatedRules,
			}),
		)
	}

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		if (
			e.target.name === 'rent' ||
			e.target.name === 'service_charge' ||
			e.target.name === 'bathrooms' ||
			e.target.name === 'toilets' ||
			e.target.name === 'living_rooms' ||
			e.target.name === 'bedrooms'
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		next()
	}

	useEffect(() => {
		if (formData.state)
			setFilteredLocationOptions(
				options.locations.filter(
					(location) => location.state === formData.state,
				),
			)
	}, [formData.state, options.locations])

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
								_placeholder={{ color: 'text_muted' }}
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
								value={String(formData.rent)}
								name="rent"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Rent Value"
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
								<option style={{ color: 'black' }} value="daily">
									Daily
								</option>
								<option style={{ color: 'black' }} value="weekly">
									Weekly
								</option>
								<option style={{ color: 'black' }} value="monthly">
									Monthly
								</option>
								<option style={{ color: 'black' }} value="annually">
									Annually
								</option>
								<option style={{ color: 'black' }} value="biannually">
									Bi-Annually
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
										key={category._id}
										style={{ color: 'black' }}
										value={category._id}
									>
										{category.name}
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
										key={service._id}
										style={{ color: 'black', textTransform: 'capitalize' }}
										value={service._id}
									>
										{service.name}
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
								value={formData.property_type}
								name="property_type"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Property Type"
								size="md"
								color={'border_color'}
							>
								{options.property_types.map((property) => (
									<option
										key={property._id}
										style={{ color: 'black', textTransform: 'capitalize' }}
										value={property._id}
									>
										{property.name}
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
								{options.amenities.map((amenity) => (
									<Checkbox
										key={amenity._id}
										textTransform={'capitalize'}
										color={'border_color'}
										colorScheme="green"
										_light={{ color: 'dark' }}
										value={amenity._id}
										textColor={'white'}
										isChecked={formData.amenities.includes(amenity._id)}
										onChange={(e) => {
											const { checked, value } = e.target
											if (checked) {
												const amenities = [...formData.amenities, value]
												setFormData((prev) => ({ ...prev, amenities }))
												localStorage.setItem(
													'host_space_form',
													JSON.stringify({
														...formData,
														amenities,
													}),
												)
											} else {
												const amenities = formData.amenities.filter(
													(amenity) => amenity !== value,
												)
												setFormData((prev) => ({ ...prev, amenities }))
												localStorage.setItem(
													'host_space_form',
													JSON.stringify({
														...formData,
														amenities,
													}),
												)
											}
										}}
									>
										{amenity.name}
									</Checkbox>
								))}
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
						{(formData.house_rules.length ? formData.house_rules : ['']).map(
							(_, i) => (
								<Box key={i} pos={'relative'}>
									<Input
										onChange={(e) => handleHouseRuleChange(e, i)}
										minLength={5}
										value={
											(formData.house_rules.length
												? formData.house_rules
												: [''])[i]
										}
										_placeholder={{ color: 'text_muted' }}
										borderColor={'border_color'}
										_dark={{ borderColor: 'dark_light' }}
										placeholder="Enter your rule"
									/>
									{formData.house_rules.length > 1 && (
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
							),
						)}
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
										value={state._id}
										key={state._id}
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
								Select a location
							</Text>
							<Select
								_placeholder={{ color: 'text_muted' }}
								_light={{ color: 'dark' }}
								onChange={handleChange}
								required
								value={formData.location}
								name="location"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Location"
								size="md"
								color={'border_color'}
							>
								{formData.state &&
									filteredLocationOptions.map((location) => (
										<option
											style={{ color: 'black', textTransform: 'capitalize' }}
											value={location._id}
											key={location._id}
										>
											{location.name}
										</option>
									))}
							</Select>
						</Flex>
					</Flex>
					{formData.location &&
						(!isLoaded ? (
							<Text width={'full'} textAlign={'center'}>
								Loading google maps
							</Text>
						) : (
							<FormControl mt={1}>
								<FormLabel htmlFor="address">
									Where in{' '}
									{
										filteredLocationOptions.find(
											(location) => location._id === formData.location,
										)?.name
									}
									?
								</FormLabel>
								<Autocomplete
									onLoad={handleLoad}
									onPlaceChanged={handlePlaceChanged}
								>
									<Input
										_placeholder={{ color: 'text_muted' }}
										borderColor={'border_color'}
										_dark={{ borderColor: 'dark_light' }}
										id="address"
										type="text"
										placeholder="Enter a location"
										name="google_location_text"
										value={formData.google_location_text}
										onChange={handleChange}
									/>
								</Autocomplete>
							</FormControl>
						))}
				</VStack>
				<br />
				<Button bgColor={'brand'} color={'white'} type={'submit'}>
					Next
				</Button>
			</Flex>
		</>
	)
}
