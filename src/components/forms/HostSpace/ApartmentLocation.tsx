import { DEFAULT_PADDING } from '@/configs/theme'
import { Button, Flex, Input, Select, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

type Props = {
	next: () => void
}

export default function ApartmentLocation({ next }: Props) {
	const [locationData, setLocationData] = useState({
		address: '',
		state: '',
		city: '',
	})

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setLocationData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		console.log(locationData)
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
						<Input
							onChange={handleChange}
							required
							value={locationData.address}
							name="address"
							borderColor={'border_color'}
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Address"
							w={'full'}
						/>
					</Flex>

					<Flex gap={DEFAULT_PADDING} w="full" flexDir={['column', 'row']}>
						<Select
							onChange={handleChange}
							required
							value={locationData.state}
							name="state"
							borderColor={'border_color'}
							iconColor="border_color"
							_dark={{ borderColor: 'dark_light' }}
							placeholder="State"
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
							value={locationData.city}
							name="city"
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
