import { DEFAULT_PADDING } from '@/configs/theme'
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

export default function Summary({
	next,
	formData,
	setFormData,
}: HostSpaceFormProps) {
	const [summaryData, setSummaryData] = useState({
		title: formData.title || '',
		description: formData.description || '',
		budget: formData.budget || undefined,
		service_charge: formData.service_charge || undefined,
		payment_type: formData.payment_type || '',
		availability_status: formData.availability_status || '',
	})

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		if (e.target.name === 'budget' || e.target.name === 'service_charge') {
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
				</VStack>
				<br />
				<Button type={'submit'}>{`Next`}</Button>
			</Flex>
		</>
	)
}
