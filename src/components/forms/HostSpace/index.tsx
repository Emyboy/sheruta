'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { DocumentReference } from '@firebase/firestore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import Summary from './Summary'
import UploadMedia from './UploadMedia'
import { useAppContext } from '@/context/app.context'

export type HostSpaceFormProps = {
	next: () => void
	formData: FormDataType
	setFormData: React.SetStateAction<React.Dispatch<FormDataType>>
}

export type FormDataType = Partial<ApartmentDetailsType & MediaType>

export type ApartmentDetailsType = {
	title: string
	description: string
	service_charge: number | null
	budget: number
	payment_type: string
	bedrooms: number | null
	bathrooms: number | null
	toilets: number | null
	living_rooms: number | null
	availability_status: string | null
	_property_type_ref: undefined | DocumentReference
	_location_keyword_ref: undefined | DocumentReference
	_state_ref: undefined | DocumentReference
	_service_ref: undefined | DocumentReference
	_category_ref: undefined | DocumentReference
	_status_ref: undefined | DocumentReference
	state: string
	area: string
	service: string
	category: string
	property: string
}

export type MediaType = {
	images_urls: string[]
	video_url: string | null
}

const initialState = {
	title: '',
	description: '',
	service_charge: null,
	budget: 0,
	payment_type: '',
	bedrooms: 0,
	bathrooms: 0,
	toilets: 0,
	living_rooms: 0,
	images_urls: [],
	video_url: '',
	availability_status: null,
	_location_keyword_ref: undefined,
	_state_ref: undefined,
	_service_ref: undefined,
	_category_ref: undefined,
	_property_type_ref: undefined,
	state: '',
	area: '',
	service: '',
	category: '',
	property: '',
}

export default function HostSpace() {
	const router = useRouter()
	const { appState } = useAppContext()

	const [hostSpaceData, setHostSpaceData] = useState<FormDataType>(initialState)

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

	const allStepNames = (): string[] => ['About Apartment', 'Upload Media']

	useEffect(() => {
		const formData = localStorage.getItem('host_space_form')
		if (formData && appState) setHostSpaceData(JSON.parse(formData))
	}, [appState])

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
