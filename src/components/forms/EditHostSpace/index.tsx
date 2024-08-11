'use client'

import { useAppContext } from '@/context/app.context'
import { useOptionsContext } from '@/context/options.context'
import {
	AvailabilityStatus,
	HostRequestDataDetails,
	PaymentPlan,
} from '@/firebase/service/request/request.types'
import { Box, Flex, Text } from '@chakra-ui/react'
import { DocumentReference, Timestamp } from '@firebase/firestore'
import { StorageReference } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import Summary from './Summary'
import UploadMedia from './UploadMedia'
import { useAuthContext } from '@/context/auth.context'

export type HostSpaceFormProps = {
	next: () => void
	formData: FormDataType
	setFormData: React.Dispatch<React.SetStateAction<FormDataType>>
}

export type FormDataType = {
	uuid: string
	title: string
	description: string
	service_charge: number | null
	budget: number
	payment_type: PaymentPlan
	bathrooms: number | null
	toilets: number | null
	living_rooms: number | null
	amenities: string[]
	house_rules: string[] | null
	availability_status: AvailabilityStatus | null
	_property_type_ref: undefined | DocumentReference
	_location_keyword_ref: undefined | DocumentReference
	_state_ref: undefined | DocumentReference
	_service_ref: undefined | DocumentReference
	_category_ref: undefined | DocumentReference
	images_urls: string[]
	video_url: string | null
	google_location_object: Record<string, any>
	google_location_text: string
	mediaDataRefs: StorageReference[]
	createdAt: Timestamp | { seconds: number; nanoseconds: number }
	state?: string
	area?: string
	service?: string
	category?: string
	property?: string
}

export type MediaType = {
	images_urls: string[]
	video_url: string | null
}

export default function EditHostSpace({ data }: { data: string }) {
	const router = useRouter()
	const request: HostRequestDataDetails = JSON.parse(data)
	const { optionsState: options } = useOptionsContext()
	const { appState } = useAppContext()
	const {
		authState: { user },
	} = useAuthContext()

	const [hostSpaceData, setHostSpaceData] = useState<FormDataType>({
		uuid: request.uuid || '',
		title: request.title || '',
		description: request.description || '',
		service_charge: request.service_charge || 0,
		budget: request.budget || 0,
		payment_type: request.payment_type || 'monthly',
		bathrooms: request.bathrooms || 0,
		toilets: request.toilets || 0,
		living_rooms: request.living_rooms || 0,
		amenities: request.amenities || [],
		house_rules: request.house_rules || null,
		images_urls: request.images_urls || [],
		video_url: request.video_url || null,
		availability_status: request.availability_status || 'available',
		_location_keyword_ref: undefined,
		_state_ref: undefined,
		_service_ref: undefined,
		_category_ref: undefined,
		_property_type_ref: undefined,
		google_location_object: request.google_location_object || {},
		google_location_text: request.google_location_text || '',
		mediaDataRefs: request.mediaDataRefs || [],
		createdAt: request.createdAt,
		state: '',
		area: '',
		service: '',
		category: '',
		property: '',
	})

	const [step, setStep] = useState(0)
	const [percentage, setPercentage] = useState(0)

	const next = () => {
		setStep((prev) => prev + 1)
	}

	const back = () => {
		setStep((prev) => prev - 1)
	}

	const allSteps = (): Array<React.ReactNode> => [
		<Summary
			key={0}
			next={next}
			formData={hostSpaceData}
			setFormData={setHostSpaceData}
		/>,

		<UploadMedia
			key={1}
			next={next}
			formData={hostSpaceData}
			setFormData={setHostSpaceData}
		/>,
	]

	const allStepNames = (): string[] => ['Edit Apartment Details', 'Edit Media']

	useEffect(() => {
		const totalSteps = allSteps().length
		const calculatedPercentage = (step / totalSteps) * 100
		setPercentage(calculatedPercentage)
	}, [step])

	useEffect(() => {
		if (user?._id !== request._user_ref._id) return router.back()
		if (appState.app_loading) return

		const selectedCategory = options.categories.find(
			(category) => category.id === request._category_ref.slug,
		)
		if (selectedCategory) {
			setHostSpaceData((prev) => ({
				...prev,
				category: selectedCategory.id,
			}))
		}

		const selectedService = options.services.find(
			(service) => service.id === request._service_ref.slug,
		)
		if (selectedService) {
			setHostSpaceData((prev) => ({
				...prev,
				service: selectedService.id,
			}))
		}

		const selectedProperty = options.property_types.find(
			(property) => property.id === request._property_type_ref.slug,
		)
		if (selectedProperty) {
			setHostSpaceData((prev) => ({
				...prev,
				property: selectedProperty.id,
			}))
		}

		const selectedState = options.states.find(
			(state) => state.slug === request._state_ref.slug,
		)
		if (selectedState) {
			setHostSpaceData((prev) => ({
				...prev,
				state: selectedState.id,
			}))
		}

		const selectedLocation = options.location_keywords.find(
			(location) => location.id === request._location_keyword_ref.slug,
		)
		if (selectedLocation) {
			setHostSpaceData((prev) => ({
				...prev,
				area: selectedLocation.id,
			}))
		}
	}, [appState.app_loading])

	return (
		<Flex
			justifyContent={'center'}
			flexDirection={'column'}
			alignItems={'start'}
			position={'relative'}
			gap={2}
		>
			<Flex
				position={'fixed'}
				h={'5px'}
				rounded={'full'}
				overflow={'hidden'}
				top={0}
				left={0}
				right={0}
			>
				<Flex
					h={'full'}
					w={`${percentage}%`}
					bg={'brand'}
					rounded={'full'}
					transition={'width 0.5s ease-in-out'}
				/>
			</Flex>

			<Flex
				justifyContent={'center'}
				flexDirection={'row'}
				alignItems={'center'}
				cursor={'pointer'}
				gap={2}
				onClick={() => (step > 0 ? back() : router.back())}
			>
				<Box>
					<FaAngleLeft width={'24px'} height={'24px'} />
				</Box>
				<Text
					as={'h4'}
					fontSize={{ base: 'base', md: '24px' }}
					fontWeight={'medium'}
				>
					{allStepNames()[step]}
				</Text>
			</Flex>

			{allSteps()[step]}
		</Flex>
	)
}
