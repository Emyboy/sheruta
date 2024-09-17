'use client'

import MyInspectionsIcon from '@/assets/svg/my-inspections-icon'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAuthContext } from '@/context/auth.context'
import { useInspectionsContext } from '@/context/inspections.context'
import { returnedInspectionData } from '@/firebase/service/inspections/inspections.types'
import { Flex, Text } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import InspectionCard from './InspectionCard'

export type inspectionCategoryType =
	| 'upcoming'
	| 'missed'
	| 'past'
	| 'cancelled'

const inspectionCategories: inspectionCategoryType[] = [
	'upcoming',
	'past',
	'missed',
	'cancelled',
]

export default function MyInspections() {
	const { authState } = useAuthContext()
	const { inspections } = useInspectionsContext()

	const [filteredInspections, setFilteredInspections] =
		useState<returnedInspectionData[]>(inspections)
	const [inspectionCategory, setInspectionCategory] =
		useState<inspectionCategoryType>('upcoming')

	const filterInspections = useCallback(() => {
		const currentTime = new Date()

		switch (inspectionCategory) {
			case 'upcoming':
				return inspections.filter(
					(inspection) =>
						new Date(
							inspection.inspection_date.toDate().getTime() +
								6 * 60 * 60 * 1000,
						) > currentTime &&
						!inspection.hasOccured &&
						!inspection.isCancelled,
				)
			case 'missed':
				return inspections.filter(
					(inspection) =>
						new Date(
							inspection.inspection_date.toDate().getTime() +
								6 * 60 * 60 * 1000,
						) <= currentTime &&
						!inspection.hasOccured &&
						!inspection.isCancelled,
				)
			case 'past':
				return inspections.filter(
					(inspection) =>
						new Date(inspection.inspection_date.toDate().getTime()) <=
							currentTime &&
						inspection.hasOccured &&
						!inspection.isCancelled,
				)
			case 'cancelled':
				return inspections.filter((inspection) => inspection.isCancelled)
			default:
				return inspections
		}
	}, [inspectionCategory, inspections])

	useEffect(() => {
		if (!inspections.length) return

		const sortedInspections = filterInspections()
		setFilteredInspections(sortedInspections)
	}, [inspectionCategory, inspections.length, filterInspections])

	return (
		<Flex
			alignItems={'center'}
			flexDir={'column'}
			justifyContent={'center'}
			gap={DEFAULT_PADDING}
			py={DEFAULT_PADDING}
		>
			<Flex
				alignItems={'center'}
				justifyContent={'center'}
				w={'120px'}
				h={'120px'}
				rounded={999}
				bgColor={'#E4FAA833'}
			>
				<MyInspectionsIcon />
			</Flex>
			<Text
				fontSize={{ base: 'lg', md: '24px' }}
				fontWeight={300}
				_light={{ color: '#111717' }}
			>
				My Inspections
			</Text>
			<Flex
				borderBottom={'1px'}
				pt={DEFAULT_PADDING}
				px={{
					base: `calc(${DEFAULT_PADDING} * 1)`,
					sm: `calc(${DEFAULT_PADDING} * 1.5)`,
					md: `calc(${DEFAULT_PADDING} * 2)`,
				}}
				pb={0}
				alignItems={'start'}
				gap={{
					base: `calc(${DEFAULT_PADDING} * 1)`,
					sm: `calc(${DEFAULT_PADDING} * 1.5)`,
					md: `calc(${DEFAULT_PADDING} * 2)`,
				}}
				w={'full'}
				borderColor={'border_color'}
			>
				{inspectionCategories.map((item, i) => (
					<Flex
						key={i}
						alignItems="center"
						flexDirection="column"
						justifyContent="space-between"
						gap={'16px'}
						cursor="pointer"
						w="auto"
						onClick={() => setInspectionCategory(item)}
					>
						<Text
							as="p"
							fontWeight="normal"
							textAlign="center"
							fontSize={{ base: '12px', md: '16px' }}
							whiteSpace="nowrap"
							_light={{
								color: inspectionCategory === item ? '#111717CC' : '#11171766',
							}}
							_dark={{
								color: inspectionCategory === item ? 'white' : 'text_muted',
							}}
							textTransform={'capitalize'}
						>
							{item}
						</Text>
						{inspectionCategory === item && (
							<Text as="span" h="4px" w="full" borderRadius="4px" bg="brand" />
						)}
					</Flex>
				))}
			</Flex>
			{!filteredInspections.length ? (
				<Text
					fontWeight={600}
					fontSize={{ base: 'base', md: 'xl' }}
					mt={'24px'}
					w={'full'}
					textAlign={'center'}
				>
					You have no {inspectionCategory} inspections
				</Text>
			) : (
				<Flex
					flexDir={'column'}
					w={'100%'}
					justifyContent={'center'}
					gap={'24px'}
					px={{
						base: `calc(${DEFAULT_PADDING} * 1)`,
						sm: `calc(${DEFAULT_PADDING} * 1.5)`,
						md: `calc(${DEFAULT_PADDING} * 2)`,
					}}
				>
					{filteredInspections.map((inspection, i) => (
						<InspectionCard
							{...inspection}
							inspectionCategory={inspectionCategory}
							currentUserId={authState.user?._id || ''}
							key={i}
						/>
					))}
				</Flex>
			)}
		</Flex>
	)
}
