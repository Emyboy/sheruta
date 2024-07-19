import { DEFAULT_PADDING } from '@/configs/theme'
import { Button, Flex, Input, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { HostSpaceFormProps } from '.'

export default function AvailableAmenities({
	next,
	formData,
	setFormData,
}: HostSpaceFormProps) {
	const [amenities, setAmenities] = useState({
		bedrooms: formData.bedrooms || undefined,
		bathrooms: formData.bathrooms || undefined,
		toilets: formData.toilets || undefined,
		living_rooms: formData.living_rooms || undefined,
	})

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setAmenities((prev) => ({
			...prev,
			[e.target.name]: Number(e.target.value.replace(/[^0-9]/g, '')),
		}))
	}

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		console.log(amenities)
		setFormData((prev) => ({ ...prev, ...amenities }))
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
								Number of rooms
							</Text>
							<Input
								onChange={handleChange}
								required
								value={amenities.bedrooms}
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
								value={amenities.living_rooms}
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
								value={amenities.toilets}
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
								value={amenities.bathrooms}
								name="bathrooms"
								borderColor={'border_color'}
								_dark={{ borderColor: 'dark_light' }}
								placeholder="Bathrooms"
							/>
						</Flex>
					</Flex>
				</VStack>
				<br />
				<Button type={'submit'}>{`Next`}</Button>
			</Flex>
		</>
	)
}
