import { DEFAULT_PADDING } from '@/configs/theme'
import { useOptionsContext } from '@/context/options.context'
import {
	Box,
	Button,
	Flex,
	Input,
	Select,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ApartmentDetailsType, HostSpaceFormProps } from '.'

export default function Summary({
	next,
	formData,
	setFormData,
}: HostSpaceFormProps) {
	const { optionsState: options } = useOptionsContext()

	const [apartmentDetails, setApartmentDetails] =
		useState<ApartmentDetailsType>({
			title: formData.title || '',
			description: formData.description || '',
			budget: formData.budget || 0,
			service_charge: formData.service_charge || null,
			payment_type: formData.payment_type || '',
			availability_status: formData.availability_status || null,
			bedrooms: formData.bedrooms || null,
			bathrooms: formData.bathrooms || null,
			toilets: formData.toilets || null,
			living_rooms: formData.living_rooms || null,
			_state_ref: formData._state_ref,
			_location_keyword_ref: formData._location_keyword_ref,
			_service_ref: formData._service_ref,
			_category_ref: formData._category_ref,
			_property_type_ref: formData._property_type_ref,
			state: formData.state || '',
			area: formData.area || '',
			service: formData.service || '',
			category: formData.category || '',
			property: formData.property || '',
		})

	const [filteredLocationOptions, setFilteredLocationOptions] = useState(
		options.location_keywords,
	)

	useEffect(() => {
		if (apartmentDetails.state)
			setFilteredLocationOptions(
				options.location_keywords.filter(
					(location) => location._state_id === apartmentDetails.state,
				),
			)
	}, [apartmentDetails.state])

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		if (
			e.target.name === 'budget' ||
			e.target.name === 'service_charge' ||
			e.target.name === 'bedrooms' ||
			e.target.name === 'bathrooms' ||
			e.target.name === 'toilets' ||
			e.target.name === 'living_rooms'
		) {
			setApartmentDetails((prev) => ({
				...prev,
				[e.target.name]: Number(e.target.value.replace(/[^0-9]/g, '')),
			}))
			localStorage.setItem(
				'host_space_form',
				JSON.stringify({
					...apartmentDetails,
					[e.target.name]: Number(e.target.value.replace(/[^0-9]/g, '')),
				}),
			)
		} else {
			setApartmentDetails((prev) => ({
				...prev,
				[e.target.name]: e.target.value,
			}))

			localStorage.setItem(
				'host_space_form',
				JSON.stringify({
					...apartmentDetails,
					[e.target.name]: e.target.value,
				}),
			)
		}
	}

	const handleSubmit = async (e: any) => {
		e.preventDefault()

		setFormData((prev) => ({ ...prev, ...apartmentDetails }))
		localStorage.setItem(
			'host_space_form',
			JSON.stringify({ ...formData, ...apartmentDetails }),
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
								value={apartmentDetails.title}
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
								minLength={10}
								value={apartmentDetails.description}
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
								type="number"
								min={1}
								value={String(apartmentDetails.budget)}
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
								type="number"
								value={String(apartmentDetails.service_charge)}
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
								value={apartmentDetails.payment_type}
								name="payment_type"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Payment Type"
								size="md"
								color={'border_color'}
							>
								<option style={{ color: 'black' }} value="weekly">
									WEEKLY
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
								value={apartmentDetails.availability_status || ''}
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
								Number of rooms
							</Text>
							<Input
								onChange={handleChange}
								required
								type="number"
								min={1}
								value={String(apartmentDetails.bedrooms)}
								name="bedrooms"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Bedrooms"
							/>
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
								type="number"
								min={1}
								value={String(apartmentDetails.living_rooms)}
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
								type="number"
								min={1}
								value={String(apartmentDetails.toilets)}
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
								type="number"
								min={1}
								value={String(apartmentDetails.bathrooms)}
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
								Select a State
							</Text>
							<Select
								onChange={(e) => {
									handleChange(e)
									const selectedState = options.states.find(
										(state) => state.id === e.target.value,
									)
									if (selectedState) {
										setApartmentDetails((prev) => ({
											...prev,
											_state_ref: selectedState._ref,
										}))
									}
								}}
								required
								value={apartmentDetails.state}
								name="state"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="State"
								size="md"
								color={'border_color'}
							>
								{options.states.map((state) => (
									<option style={{ color: 'black' }} value={state.id}>
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
									const selectedLocation = options.location_keywords.find(
										(location) => location.id === e.target.value,
									)
									if (selectedLocation) {
										setApartmentDetails((prev) => ({
											...prev,
											_location_keyword_ref: selectedLocation._ref,
										}))
									}
								}}
								required
								value={apartmentDetails.area}
								name="area"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Area"
								size="md"
								color={'border_color'}
							>
								{apartmentDetails.state &&
									filteredLocationOptions.map((area) => (
										<option style={{ color: 'black' }} value={area.id}>
											{area.name}
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
								Select a service type
							</Text>
							<Select
								onChange={(e) => {
									handleChange(e)
									const selectedService = options.services.find(
										(service) => service.id === e.target.value,
									)
									if (selectedService) {
										setApartmentDetails((prev) => ({
											...prev,
											_service_ref: selectedService._ref,
										}))
									}
								}}
								required
								value={apartmentDetails.service}
								name="service"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Service Type"
								size="md"
								color={'border_color'}
							>
								{options.services.map((service) => (
									<option style={{ color: 'black' }} value={service.id}>
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
								Select a category
							</Text>
							<Select
								onChange={(e) => {
									handleChange(e)
									const selectedCategory = options.categories.find(
										(category) => category.id === e.target.value,
									)
									if (selectedCategory) {
										setApartmentDetails((prev) => ({
											...prev,
											_category_ref: selectedCategory._ref,
										}))
									}
								}}
								required
								value={apartmentDetails.category}
								name="category"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Category"
								size="md"
								color={'border_color'}
							>
								{options.categories.map((category) => (
									<option style={{ color: 'black' }} value={category.id}>
										{category.title}
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
								Select type of property
							</Text>
							<Select
								onChange={(e) => {
									handleChange(e)
									const selectedProperty = options.property_types.find(
										(property) => property.id === e.target.value,
									)
									if (selectedProperty) {
										setApartmentDetails((prev) => ({
											...prev,
											_property_type_ref: selectedProperty._ref,
										}))
									}
								}}
								required
								value={apartmentDetails.property}
								name="property"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Property Type"
								size="md"
								color={'border_color'}
							>
								{options.property_types.map((property) => (
									<option style={{ color: 'black' }} value={property.id}>
										{property.title}
									</option>
								))}
							</Select>
						</Flex>
					</Flex>
				</VStack>
				<br />
				<Button type={'submit'}>{`Next`}</Button>
			</Flex>
		</>
	)
}
