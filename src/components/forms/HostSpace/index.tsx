'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import Summary from './Summary'
import UploadMedia from './UploadMedia'
import ApartmentLocation from './ApartmentLocation'

export default function HostSpace() {
	const router = useRouter()

	const [hostSpaceData, setHostSpaceData] = useState()

	const [step, setStep] = useState(0)
	const [percentage, setPercentage] = useState(0)

	const next = () => {
		setStep((prev) => prev + 1)
	}

	const back = () => {
		setStep((prev) => prev - 1)
	}

	const allSteps = (): Array<React.ReactNode> => [
		<Summary next={next} />,
		<UploadMedia next={next} />,
		<ApartmentLocation next={next} />,
	]
	const allStepNames = (): string[] => [
		'Apartment Summary',
		'Upload Media',
		'Apartment Location',
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
