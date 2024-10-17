'use client'

import { useAppContext } from '@/context/app.context'
import { useAuthContext } from '@/context/auth.context'
import { useOptionsContext } from '@/context/options.context'
import {
	AvailabilityStatus,
	FlatShareRequest,
	HostSpaceFormData,
	PaymentType,
} from '@/firebase/service/request/request.types'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import Summary from './Summary'
// import UploadMedia from './UploadMedia'

export type HostSpaceFormProps = {
	next: () => void
	formData: HostSpaceFormData & {
		availability_status: AvailabilityStatus
		_id: string
	}
	setFormData: React.Dispatch<
		React.SetStateAction<
			HostSpaceFormData & {
				availability_status: AvailabilityStatus
				_id: string
			}
		>
	>
}

export default function EditHostSpace({
	request,
}: {
	request: FlatShareRequest
}) {
	const router = useRouter()

	const { optionsState: options } = useOptionsContext()
	const { appState } = useAppContext()
	const {
		authState: { user },
	} = useAuthContext()

	const [hostSpaceData, setHostSpaceData] = useState<
		HostSpaceFormData & { availability_status: AvailabilityStatus; _id: string }
	>({
		_id: request._id,
		description: request.description || '',
		service_charge: request.service_charge || 0,
		rent: request.rent || 0,
		// @ts-ignore
		payment_type: request.payment_type || PaymentType.monthly,
		bathrooms: request.bathrooms || 0,
		toilets: request.toilets || 0,
		living_rooms: request.living_rooms || 0,
		amenities: request.amenities.map((amenity) => amenity._id) || [],
		house_rules: request.house_rules || null,
		image_urls: request.image_urls || [],
		// imagesRefPaths: request.imagesRefPaths || [],
		video_url: request.video_url,
		// videoRefPath: request.videoRefPath || null,
		availability_status: request.availability_status,
		google_location_object: request.google_location_object || {},
		google_location_text: request.google_location_text || '',
		state: request.state._id,
		location: request.location._id,
		service: request.service._id,
		category: request.category._id,
		property_type: request.property_type._id,
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

		// <UploadMedia
		// 	key={1}
		// 	next={next}
		// 	formData={hostSpaceData}
		// 	setFormData={setHostSpaceData}
		// />,
	]

	const allStepNames = (): string[] => ['Edit Apartment Details', 'Edit Media']

	useEffect(() => {
		const totalSteps = allSteps().length
		const calculatedPercentage = (step / totalSteps) * 100
		setPercentage(calculatedPercentage)
	}, [step])

	useEffect(() => {
		if (appState.app_loading) return
		if (user?._id !== request.user._id) return router.back()
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
