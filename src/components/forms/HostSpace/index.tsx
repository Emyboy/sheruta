'use client'

import { RequestData } from '@/firebase/service/request/request.types'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import AvailableAmenities from './AvailableAmenities'
import Summary from './Summary'
import UploadMedia from './UploadMedia'
import LocationDetails from './LocationDetails'

export type HostSpaceFormProps = {
	next: () => void
	formData: Partial<RequestData>
	setFormData: React.SetStateAction<React.Dispatch<Partial<RequestData>>>
}

const initialState = {
	title: '',
	description: '',
	uuid: '',
	service_charge: undefined,
	budget: undefined,
	payment_type: undefined,
	bedrooms: null,
	bathrooms: null,
	toilets: null,
	living_rooms: null,

	room_type: undefined,
	agency_free_included: false,

	images_urls: [],
	video_url: '',
	availability_status: null,
}

export default function HostSpace() {
	const router = useRouter()

	const [hostSpaceData, setHostSpaceData] =
		useState<Partial<RequestData>>(initialState)

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
			next={next}
			formData={hostSpaceData}
			setFormData={setHostSpaceData}
		/>,
		<AvailableAmenities
			next={next}
			formData={hostSpaceData}
			setFormData={setHostSpaceData}
		/>,
		<LocationDetails
			next={next}
			formData={hostSpaceData}
			setFormData={setHostSpaceData}
		/>,
		<UploadMedia
			next={next}
			formData={hostSpaceData}
			setFormData={setHostSpaceData}
		/>,
	]

	const allStepNames = (): string[] => [
		'About Apartment',
		'Available Amenities',
		'Location Details',
		'Upload Media',
	]

	useEffect(() => {
		const totalSteps = allSteps().length
		const calculatedPercentage = (step / totalSteps) * 100
		setPercentage(calculatedPercentage)
	}, [step])

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
				style={{
					cursor: 'pointer',
				}}
				gap={2}
				onClick={() => (step > 0 ? back() : router.back())}
			>
				<Box>
					<FaAngleLeft width={'24px'} height={'24px'} />
				</Box>
				<Text as={'h4'} fontSize={'24px'} fontWeight={'medium'}>
					{allStepNames()[step]}
				</Text>
			</Flex>

			{allSteps()[step]}
		</Flex>
	)
}
