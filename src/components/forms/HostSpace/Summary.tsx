import { DEFAULT_PADDING } from '@/configs/theme'
import { useOptionsContext } from '@/context/options.context'
import {
	Button,
	Flex,
	Input,
	Select,
	Text,
	Textarea,
	VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { HostSpaceFormProps } from '.'
import { RequestData } from '@/firebase/service/request/request.types'

export default function Summary({
	next,
	formData,
	setFormData,
}: HostSpaceFormProps) {
	const { optionsState: options } = useOptionsContext()

	const [summaryData, setSummaryData] = useState<Partial<RequestData>>({
		title: formData.title || '',
		description: formData.description || '',
		budget: formData.budget || undefined,
		service_charge: formData.service_charge || undefined,
		payment_type: formData.payment_type || undefined,
		availability_status: formData.availability_status || undefined,
		bedrooms: formData.bedrooms || undefined,
		bathrooms: formData.bathrooms || undefined,
		toilets: formData.toilets || undefined,
		living_rooms: formData.living_rooms || undefined,
		_state_ref: formData._state_ref || undefined,
		_location_keyword_ref: formData._location_keyword_ref || undefined,
		_service_ref: formData._service_ref || undefined,
		_category_ref: formData._category_ref || undefined,
		_status_ref: formData._status_ref || undefined,
	})

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
			setSummaryData((prev) => ({
				...prev,
				[e.target.name]: Number(e.target.value.replace(/[^0-9]/g, '')),
			}))
		} else {
			setSummaryData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
		}
	}

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		console.log(summaryData)
		setFormData((prev) => ({ ...prev, ...summaryData }))
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
								value={summaryData.title}
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
								value={summaryData.description}
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
								value={summaryData.budget}
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
								required
								value={summaryData.service_charge}
								name="service_charge"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Service Charge"
							/>
						</Flex>
					</Flex>

					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Select
							onChange={handleChange}
							required
							value={summaryData.payment_type}
							name="payment_type"
							borderColor={'border_color'}
							iconColor="border_color"
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Payment Type"
							size="md"
							color={'border_color'}
						>
							<option value="monthly">MONTHLY</option>
							<option value="annually">ANNUALLY</option>
							<option value="bi-annually">BI-ANNUALLY</option>
							<option value="option3">WEEKLY</option>
						</Select>

						<Select
							onChange={handleChange}
							required
							value={summaryData.availability_status}
							name="availability_status"
							borderColor={'border_color'}
							iconColor="border_color"
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Availability Status"
							size="md"
							color={'border_color'}
						>
							<option value="available">AVAILABLE</option>
							<option value="unavailable">UNAVAILABLE</option>
							<option value="reserved">RESERVED</option>
						</Select>
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
								value={summaryData.bedrooms}
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
								value={summaryData.living_rooms}
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
								value={summaryData.toilets}
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
								value={summaryData.bathrooms}
								name="bathrooms"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Bathrooms"
							/>
						</Flex>
					</Flex>

					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Select
							onChange={handleChange}
							required
							value={summaryData._state_ref}
							name="_state_ref"
							borderColor={'border_color'}
							iconColor="border_color"
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Select State"
							size="md"
							color={'border_color'}
						>
							{options.states.map((state) => (
								<option value={state._ref}>{state.name}</option>
							))}
						</Select>

						<Select
							onChange={handleChange}
							required
							value={summaryData._location_keyword_ref}
							name="_location_keyword_ref"
							borderColor={'border_color'}
							iconColor="border_color"
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Select Area"
							size="md"
							color={'border_color'}
						>
							{options.location_keywords.map((area) => (
								<option value={area._ref}>{area.name}</option>
							))}
						</Select>
					</Flex>

					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Select
							onChange={handleChange}
							required
							value={summaryData._service_ref}
							name="_service_ref"
							borderColor={'border_color'}
							iconColor="border_color"
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Service Type"
							size="md"
							color={'border_color'}
						>
							{options.services.map((service) => (
								<option value={service._ref}>{service.title}</option>
							))}
						</Select>

						<Select
							onChange={handleChange}
							// required
							value={summaryData._category_ref}
							name="_category_ref"
							borderColor={'border_color'}
							iconColor="border_color"
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Select Category"
							size="md"
							color={'border_color'}
						>
							{options.categories.map((category) => (
								<option value={category._ref}>{category.name}</option>
							))}
						</Select>
					</Flex>
				</VStack>
				<br />
				<Button type={'submit'}>{`Next`}</Button>
			</Flex>
		</>
	)
}
