'use client'

import MyInspectionsIcon from '@/assets/svg/my-inspections-icon'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useAppContext } from '@/context/app.context'
import { useAuthContext } from '@/context/auth.context'
import InspectionServices from '@/firebase/service/inspections/inspections.firebase'
import { InspectionData } from '@/firebase/service/inspections/inspections.types'
import useCommon from '@/hooks/useCommon'
import { Box, Flex, Text } from '@chakra-ui/react'
import { DocumentData, DocumentReference } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type inspectionCategoryType = 'upcoming' | 'missed' | 'past' | 'cancelled'

const inspectionCategories: inspectionCategoryType[] = [
	'upcoming',
	'missed',
	'past',
	'cancelled',
]

export default function MyInspections() {
	const { authState } = useAuthContext()
	const { appState } = useAppContext()

	const router = useRouter()
	const { showToast } = useCommon()

	const [inspections, setInspections] = useState<any[]>([])
	const [filteredInspections, setFilteredInspections] =
		useState<any[]>(inspections)
	const [inspectionCategory, setInspectionCategory] =
		useState<inspectionCategoryType>('upcoming')

	const fetchYourInspections = async (id: string) => {
		try {
			const res = await InspectionServices.getYourInspections(id)
			setInspections(res)
			console.log(res)
		} catch (error) {
			console.error('Error', error)
		}
	}

	const filterInspections = () => {
		const currentTime = new Date()

		switch (inspectionCategory) {
			case 'upcoming':
				return inspections.filter(
					(inspection) =>
						inspection.inspection_date.toDate() > currentTime &&
						!inspection.hasOccured &&
						!inspection.isCancelled,
				)
			case 'missed':
				return inspections.filter(
					(inspection) =>
						inspection.inspection_date.toDate() <= currentTime &&
						!inspection.hasOccured &&
						!inspection.isCancelled,
				)
			case 'past':
				return inspections.filter(
					(inspection) =>
						inspection.inspection_date.toDate() <= currentTime &&
						inspection.hasOccured &&
						!inspection.isCancelled,
				)
			case 'cancelled':
				return inspections.filter((inspection) => inspection.isCancelled)
			default:
				return inspections
		}
	}

	useEffect(() => {
		if (appState.app_loading) return
		if (!authState.user?._id) return

		fetchYourInspections(authState.user?._id || '')
	}, [appState.app_loading, authState.user?._id])

	useEffect(() => {
		if (appState.app_loading) return
		if (!authState.user?._id) return
		if (!inspections.length) return

		const sortedInspections = filterInspections()
		console.log(sortedInspections)
		setFilteredInspections(sortedInspections)
	}, [
		inspectionCategory,
		appState.app_loading,
		authState.user?._id,
		inspections.length,
	])

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
					sm: `calc(${DEFAULT_PADDING} * 2)`,
					md: `calc(${DEFAULT_PADDING} * 3)`,
				}}
				pb={0}
				alignItems={'start'}
				gap={{
					base: `calc(${DEFAULT_PADDING} * 1)`,
					sm: `calc(${DEFAULT_PADDING} * 2)`,
					md: `calc(${DEFAULT_PADDING} * 3)`,
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
			) : null}
		</Flex>
	)
}
