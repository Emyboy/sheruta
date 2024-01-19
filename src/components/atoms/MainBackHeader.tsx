'use client'
import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import MainIconBtn from './MainIconBtn'
import { BiChevronLeft } from 'react-icons/bi'
import { DEFAULT_PADDING } from '@/configs/theme'
import { useRouter } from 'next13-progressbar'

type Props = {
	heading?: string
	subHeading?: string
}

export default function MainBackHeader({ heading, subHeading }: Props) {
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
				<Text isTruncated>The heading</Text>
				<Text isTruncated fontSize={'sm'} color="text_muted">
					The sub heading
				</Text>
			</Flex>
		</Flex>
	)
}
