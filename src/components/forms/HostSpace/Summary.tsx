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

type Props = {
	next: () => void
}

export default function Summary({ next }: Props) {
	const [summaryData, setSummaryData] = useState({
		title: '',
		summary: '',
		accomodationType: '',
		apartmentType: '',
		serviceType: '',
	})

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		setSummaryData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		console.log(summaryData)
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
								Apartment Summary
							</Text>
							<Textarea
								onChange={handleChange}
								required
								value={summaryData.summary}
								name="summary"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Summary Here"
								resize={'vertical'}
								height={160}
							/>
						</Flex>
					</Flex>
					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Select
							onChange={handleChange}
							required
							value={summaryData.accomodationType}
							name="accomodationType"
							borderColor={'border_color'}
							iconColor="border_color"
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Accomodation Type"
							size="md"
							color={'border_color'}
							w={'full'}
						>
							<option value="option1">Option 1</option>
							<option value="option2">Option 2</option>
							<option value="option3">Option 3</option>
						</Select>
					</Flex>

					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Select
							onChange={handleChange}
							required
							value={summaryData.apartmentType}
							name="apartmentType"
							borderColor={'border_color'}
							iconColor="border_color"
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Apartment Type"
							size="md"
							color={'border_color'}
						>
							<option value="option1">Option 1</option>
							<option value="option2">Option 2</option>
							<option value="option3">Option 3</option>
						</Select>

						<Select
							onChange={handleChange}
							required
							value={summaryData.serviceType}
							name="serviceType"
							borderColor={'border_color'}
							iconColor="border_color"
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Service Type"
							size="md"
							color={'border_color'}
						>
							<option value="option1">Option 1</option>
							<option value="option2">Option 2</option>
							<option value="option3">Option 3</option>
						</Select>
					</Flex>
				</VStack>
				<br />
				<Button type={'submit'}>{`Next`}</Button>
			</Flex>
		</>
	)
}
