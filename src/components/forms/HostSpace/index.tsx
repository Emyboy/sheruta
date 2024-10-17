'use client'

import { useAppContext } from '@/context/app.context'
import {
	HostSpaceFormData,
	PaymentType,
} from '@/firebase/service/request/request.types'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import Summary from './Summary'
import UploadMedia from './UploadMedia'

export type HostSpaceFormProps = {
	next: () => void
	formData: HostSpaceFormData
	setFormData: React.Dispatch<React.SetStateAction<HostSpaceFormData>>
}

export default function HostSpace() {
	const router = useRouter()
	const { appState } = useAppContext()

	const [hostSpaceData, setHostSpaceData] = useState<HostSpaceFormData>({
		description: '',
		service_charge: 0,
		rent: 0,
		payment_type: PaymentType.monthly,
		bathrooms: 0,
		toilets: 0,
		living_rooms: 0,
		amenities: [],
		house_rules: [],
		image_urls: [],
		video_url: null,
		// availability_status: 'available',
		google_location_object: {},
		google_location_text: '',
		state: '',
		location: '',
		service: '',
		category: '',
		property_type: '',
	})

	const [step, setStep] = useState(0)
	const [percentage, setPercentage] = useState(0)

	const next = () => setStep((prev) => prev + 1)

	const back = () => setStep((prev) => prev - 1)

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

	const allStepNames = (): string[] => ['About Apartment', 'Upload Media']

	useEffect(() => {
		const formData = localStorage.getItem('host_space_form')

		if (formData && !appState.app_loading)
			setHostSpaceData(JSON.parse(formData))
	}, [appState.app_loading])

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
