'use client'

import { DEFAULT_PADDING } from '@/configs/theme'
import { useOptionsContext } from '@/context/options.context'
import { Box, Checkbox, Flex, Select, SimpleGrid, Text } from '@chakra-ui/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IoLocationOutline } from 'react-icons/io5'
import { useDebouncedCallback } from 'use-debounce'

type Props = {}
const budgetList = [
	{
		label: 'N100,000 - N500,000',
		value: '100000-500000',
	},
	{
		label: 'N500,000 - N1,000,000',
		value: '500000-1000000',
	},
	{
		label: 'N1,000,000 - N5,000,000',
		value: '1000000-5000000',
	},
]

const findApartmentList = [
	{
		label: 'By Request',
		value: 'by-request',
	},
	{
		label: 'Show Flatmates',
		value: 'show-flatmates',
	},
	{
		label: 'Available Spaces',
		value: 'available-spaces',
	},
]

const paymentTypeList = [
	{
		label: 'Weekly',
		value: 'weekly',
	},
	{
		label: 'Monthly',
		value: 'monthly',
	},
	{
		label: 'Quaterly',
		value: 'quaterly',
	},
	{
		label: 'Annually',
		value: 'annually',
	},
	{
		label: 'Bi Annually',
		value: 'bi-annually',
	},
]

export default function SearchPageFilter({}: Props) {
	const { optionsState: options } = useOptionsContext()

	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()

	const [filteredLocationOptions, setFilteredLocationOptions] = useState(
		options.location_keywords,
	)

	useEffect(() => {
		if (searchParams.get('state')?.toString()) {
			setFilteredLocationOptions(
				options.location_keywords.filter(
					(location) =>
						location._state_id === searchParams.get('state')?.toString(),
				),
			)
		} else {
			setFilteredLocationOptions(options.location_keywords)
		}
	}, [searchParams.toString(), searchParams.get('state')?.toString()])

	const handleFilterOption = useDebouncedCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const params = new URLSearchParams(searchParams)

			const { name, value } = e.target

			if (name === 'state') params.delete('location')

			if (!value) {
				params.delete(name)
			} else {
				params.set(name, value)
			}

			replace(`${pathname}?${params.toString()}`)
		},
		300,
	)

	const handleCheckBoxOptions = useDebouncedCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const params = new URLSearchParams(searchParams)

			const { name, checked, value } = e.target

			const prevBudgetQuery = params.get(name)

			if (!checked && prevBudgetQuery?.includes(value)) {
				const budgets = prevBudgetQuery
					.split(',')
					.filter((item) => item != value)

				budgets.length < 1
					? params.delete(name)
					: params.set(name, budgets.join(','))
			} else if (prevBudgetQuery && checked) {
				params.set(name, `${prevBudgetQuery},${value}`)
			} else if (checked && !prevBudgetQuery) {
				params.set(name, value)
			}

			replace(`${pathname}?${params.toString()}`)
		},
		300,
	)

	return (
		<Flex
			flexDir={'column'}
			pr={DEFAULT_PADDING}
			py={DEFAULT_PADDING}
			gap={{ base: '24px', md: '48px' }}
		>
			<Box
				p={DEFAULT_PADDING}
				bgColor={'#11171708'}
				_dark={{ bgColor: 'lightgray' }}
				rounded={'8px'}
			>
				<Flex flexDir={'column'} gap={DEFAULT_PADDING} alignItems={'stretch'}>
					<Flex
						w={'100%'}
						pos={'relative'}
						border={'1px'}
						rounded={'8px'}
						borderColor={'border_color'}
						bgColor={'white'}
					>
						<Box pos={'absolute'} zIndex={10} top={'10px'} left={'6px'}>
							<IoLocationOutline size={'20px'} color={'gray'} />
						</Box>

						<Select
							color={'gray'}
							_focus={{
								outline: 0,
								ring: 0,
							}}
							bgColor={'white'}
							onChange={handleFilterOption}
							defaultValue={searchParams.get('state')?.toString() || ''}
							name="state"
							border={0}
							_dark={{ borderColor: 'dark_light' }}
							size="md"
							w={'100%'}
							pl={'16px'}
						>
							<option
								style={{ color: 'black', textTransform: 'capitalize' }}
								value={''}
							>
								Filter by state
							</option>
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
						w={'100%'}
						pos={'relative'}
						border={'1px'}
						rounded={'8px'}
						borderColor={'border_color'}
						bgColor={'white'}
					>
						<Box pos={'absolute'} zIndex={10} top={'10px'} left={'6px'}>
							<IoLocationOutline size={'20px'} color={'gray'} />
						</Box>

						<Select
							color={'gray'}
							required
							_focus={{
								outline: 0,
								ring: 0,
							}}
							bgColor={'white'}
							onChange={handleFilterOption}
							defaultValue={searchParams.get('location')?.toString() || ''}
							name="location"
							border={0}
							_dark={{ borderColor: 'dark_light' }}
							size="md"
							w={'100%'}
							pl={'16px'}
						>
							<option
								style={{ color: 'black', textTransform: 'capitalize' }}
								value={''}
							>
								Filter by city
							</option>
							{filteredLocationOptions.map((area) => (
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
			</Box>

			<Flex gap={{ base: '14px', md: '20px' }} flexDir={'column'}>
				<Text
					as={'h3'}
					fontWeight={'normal'}
					fontSize={{ base: 'sm', md: 'base' }}
					color={'#111717CC'}
					_dark={{ color: 'white' }}
				>
					Search By Budget
				</Text>

				<SimpleGrid columns={1} spacingY={{ base: '12px', md: '16px' }}>
					{budgetList.map((budget, i) => (
						<Checkbox
							key={i}
							name="budget"
							textTransform={'capitalize'}
							_dark={{ color: 'text_muted' }}
							colorScheme="green"
							color={'#11171799'}
							fontWeight={'300'}
							fontSize={{ base: 'xs', md: 'sm' }}
							value={budget.value}
							onChange={handleCheckBoxOptions}
							defaultChecked={searchParams.toString().includes(budget.value)}
						>
							{budget.label}
						</Checkbox>
					))}
				</SimpleGrid>
			</Flex>

			<Flex gap={{ base: '14px', md: '20px' }} flexDir={'column'}>
				<Text
					as={'h3'}
					fontWeight={'normal'}
					fontSize={{ base: 'sm', md: 'base' }}
					color={'#111717CC'}
					_dark={{ color: 'white' }}
				>
					Search By Service Type
				</Text>

				<SimpleGrid columns={1} spacingY={{ base: '12px', md: '16px' }}>
					{options.services.map((service) => (
						<Checkbox
							key={service.id}
							textTransform={'capitalize'}
							_dark={{ color: 'text_muted' }}
							colorScheme="green"
							color={'#11171799'}
							fontWeight={'300'}
							fontSize={{ base: 'xs', md: 'sm' }}
							value={service.id}
							name="service"
							onChange={handleCheckBoxOptions}
							defaultChecked={searchParams.toString().includes(service.id)}
						>
							{service.title}
						</Checkbox>
					))}
				</SimpleGrid>
			</Flex>

			<Flex gap={{ base: '14px', md: '20px' }} flexDir={'column'}>
				<Text
					as={'h3'}
					fontWeight={'normal'}
					fontSize={{ base: 'sm', md: 'base' }}
					color={'#111717CC'}
					_dark={{ color: 'white' }}
				>
					Find Apartment
				</Text>

				<SimpleGrid columns={1} spacingY={{ base: '12px', md: '16px' }}>
					{findApartmentList.map((apartmentType, i) => (
						<Checkbox
							key={i}
							textTransform={'capitalize'}
							_dark={{ color: 'text_muted' }}
							colorScheme="green"
							color={'#11171799'}
							fontWeight={'300'}
							fontSize={{ base: 'xs', md: 'sm' }}
							value={apartmentType.value}
							name="apartment"
							onChange={handleCheckBoxOptions}
							defaultChecked={searchParams
								.toString()
								.includes(apartmentType.value)}
						>
							{apartmentType.label}
						</Checkbox>
					))}
				</SimpleGrid>
			</Flex>

			<Flex gap={{ base: '14px', md: '20px' }} flexDir={'column'}>
				<Text
					as={'h3'}
					fontWeight={'normal'}
					fontSize={{ base: 'sm', md: 'base' }}
					color={'#111717CC'}
					_dark={{ color: 'white' }}
				>
					Payment Mode
				</Text>

				<SimpleGrid columns={1} spacingY={{ base: '12px', md: '16px' }}>
					{paymentTypeList.map((paymentType, i) => (
						<Checkbox
							key={i}
							textTransform={'capitalize'}
							_dark={{ color: 'text_muted' }}
							colorScheme="green"
							color={'#11171799'}
							fontWeight={'300'}
							fontSize={{ base: 'xs', md: 'sm' }}
							value={paymentType.value}
							name="payment_type"
							onChange={handleCheckBoxOptions}
							defaultChecked={searchParams
								.toString()
								.includes(paymentType.value)}
						>
							{paymentType.label}
						</Checkbox>
					))}
				</SimpleGrid>
			</Flex>
		</Flex>
	)
}
