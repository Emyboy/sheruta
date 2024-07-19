import { DEFAULT_PADDING } from '@/configs/theme'
import { useOptionsContext } from '@/context/options.context'
import { Button, Flex, Select, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { HostSpaceFormProps } from '.'

export default function LocationDetails({
	next,
	formData,
	setFormData,
}: HostSpaceFormProps) {
	const { optionsState: options } = useOptionsContext()

	const [locationDetails, setLocationDetials] = useState({
		_state_ref: '',
		_location_keyword_ref: '',
	})

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setLocationDetials((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		console.log(locationDetails)
		// setFormData((prev) => ({ ...prev, ...locationDetails }))
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
						<Select
							onChange={handleChange}
							required
							value={locationDetails._state_ref}
							name="_state_ref"
							borderColor={'border_color'}
							iconColor="border_color"
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Select State"
							size="md"
							color={'border_color'}
						>
							{options.states.map((state) => (
								<option value={state.id}>{state.name}</option>
							))}
						</Select>

						<Select
							onChange={handleChange}
							required
							value={locationDetails._location_keyword_ref}
							name="_location_keyword_ref"
							borderColor={'border_color'}
							iconColor="border_color"
							_dark={{ borderColor: 'dark_light' }}
							placeholder="Select Area"
							size="md"
							color={'border_color'}
						>
							{options.location_keywords.map((area) => (
								<option value={area.id}>{area.name}</option>
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
