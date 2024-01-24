'use client'
import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import MainIconBtn from './MainIconBtn'
import { BiChevronLeft } from 'react-icons/bi'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useRouter } from 'next13-progressbar'
import Skeleton from 'react-loading-skeleton'

type Props = {
	heading?: string
	subHeading?: string
	isLoading?: boolean
}

export default function MainBackHeader({
	heading,
	subHeading,
	isLoading,
}: Props) {
	const router = useRouter()
	return (
		<Flex
			h="full"
			w="full"
			maxW={'99%'}
			px={DEFAULT_PADDING}
			gap={DEFAULT_PADDING}
		>
			<MainIconBtn
				Icon={BiChevronLeft}
				label="Go back"
				onClick={() => router.back()}
			/>
			<Flex flexDirection={'column'} maxW={'full'}>
				{heading && (
					<>
						<Text opacity={isLoading ? '0.2' : 1} isTruncated>
							{isLoading ? <Skeleton width={200} height={10} /> : heading}
						</Text>
						<Text
							opacity={isLoading ? '0.2' : 1}
							isTruncated
							fontSize={'sm'}
							color="text_muted"
						>
							{isLoading ? <Skeleton width={100} height={10} /> : subHeading}
						</Text>
					</>
				)}
			</Flex>
		</Flex>
	)
}
